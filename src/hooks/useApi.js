/**
 * Custom hooks for API interactions
 * Provides a clean interface for all API operations with error handling and loading states
 */

import { useState, useEffect, useCallback } from 'react'
import { internalApi, videoGenerationService, paymentService } from '../services/api'
import { useApp } from '../context/AppContext'

/**
 * Generic API hook for handling loading states and errors
 */
export function useApiCall() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiCall) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      setLoading(false)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      setLoading(false)
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return { loading, error, execute, reset }
}

/**
 * Hook for managing brand assets
 */
export function useBrandAssets() {
  const { state, dispatch } = useApp()
  const { loading, error, execute } = useApiCall()

  const loadBrandAssets = useCallback(async () => {
    const assets = await execute(() => internalApi.getBrandAssets(state.user.userId))
    dispatch({ type: 'SET_BRAND_ASSETS', payload: assets })
    return assets
  }, [state.user.userId, execute, dispatch])

  const createBrandAsset = useCallback(async (assetData) => {
    const newAsset = await execute(() => 
      internalApi.createBrandAsset(state.user.userId, assetData)
    )
    dispatch({ type: 'ADD_BRAND_ASSET', payload: newAsset })
    return newAsset
  }, [state.user.userId, execute, dispatch])

  const updateBrandAsset = useCallback(async (assetId, assetData) => {
    const updatedAsset = await execute(() => 
      internalApi.updateBrandAsset(assetId, assetData)
    )
    dispatch({ type: 'UPDATE_BRAND_ASSET', payload: updatedAsset })
    return updatedAsset
  }, [execute, dispatch])

  const deleteBrandAsset = useCallback(async (assetId) => {
    await execute(() => internalApi.deleteBrandAsset(assetId))
    dispatch({ type: 'REMOVE_BRAND_ASSET', payload: assetId })
  }, [execute, dispatch])

  const uploadBrandAsset = useCallback(async (file, type, details = {}) => {
    // First upload the file
    const uploadResult = await execute(() => internalApi.uploadFile(file, 'brand-asset'))
    
    // Then create the brand asset record
    const assetData = {
      type,
      name: file.name,
      url: uploadResult.url,
      details
    }
    
    return await createBrandAsset(assetData)
  }, [execute, createBrandAsset])

  return {
    brandAssets: state.brandAssets,
    loading,
    error,
    loadBrandAssets,
    createBrandAsset,
    updateBrandAsset,
    deleteBrandAsset,
    uploadBrandAsset
  }
}

/**
 * Hook for managing projects
 */
export function useProjects() {
  const { state, dispatch } = useApp()
  const { loading, error, execute } = useApiCall()

  const loadProjects = useCallback(async () => {
    const projects = await execute(() => internalApi.getProjects(state.user.userId))
    dispatch({ type: 'SET_PROJECTS', payload: projects })
    return projects
  }, [state.user.userId, execute, dispatch])

  const createProject = useCallback(async (projectData) => {
    const newProject = await execute(() => 
      internalApi.createProject(state.user.userId, projectData)
    )
    dispatch({ type: 'ADD_PROJECT', payload: newProject })
    return newProject
  }, [state.user.userId, execute, dispatch])

  const updateProject = useCallback(async (projectId, projectData) => {
    const updatedProject = await execute(() => 
      internalApi.updateProject(projectId, projectData)
    )
    dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject })
    return updatedProject
  }, [execute, dispatch])

  const deleteProject = useCallback(async (projectId) => {
    await execute(() => internalApi.deleteProject(projectId))
    dispatch({ type: 'REMOVE_PROJECT', payload: projectId })
  }, [execute, dispatch])

  return {
    projects: state.projects,
    currentProject: state.currentProject,
    loading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject
  }
}

/**
 * Hook for video generation
 */
export function useVideoGeneration() {
  const { state, dispatch } = useApp()
  const [generationStatus, setGenerationStatus] = useState({})
  const { loading, error, execute } = useApiCall()

  const generateVideo = useCallback(async (projectData) => {
    const projectId = projectData.projectId
    
    // Update project status to generating
    dispatch({ 
      type: 'UPDATE_PROJECT', 
      payload: { ...projectData, status: 'generating', progress: 0 }
    })
    
    setGenerationStatus(prev => ({ 
      ...prev, 
      [projectId]: { status: 'generating', progress: 0 }
    }))

    try {
      // Get user's brand assets
      const brandAssets = state.brandAssets.filter(asset => 
        projectData.brandAssetIds?.includes(asset.assetId)
      )

      // Start video generation
      const result = await execute(() => 
        videoGenerationService.generateVideo(projectData, brandAssets)
      )

      // Update project with task ID
      const updatedProject = {
        ...projectData,
        taskId: result.taskId,
        aiService: result.service,
        status: 'generating'
      }
      
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject })

      // Start polling for status
      pollVideoStatus(projectId, result.taskId, result.service)

      return result
    } catch (err) {
      // Update project status to failed
      dispatch({ 
        type: 'UPDATE_PROJECT', 
        payload: { 
          ...projectData, 
          status: 'failed', 
          errorMessage: err.message 
        }
      })
      
      setGenerationStatus(prev => ({ 
        ...prev, 
        [projectId]: { status: 'failed', error: err.message }
      }))
      
      throw err
    }
  }, [state.brandAssets, execute, dispatch])

  const pollVideoStatus = useCallback(async (projectId, taskId, service) => {
    try {
      const result = await videoGenerationService.pollVideoStatus(taskId, service)
      
      // Update project with final result
      const updatedProject = state.projects.find(p => p.projectId === projectId)
      if (updatedProject) {
        dispatch({ 
          type: 'UPDATE_PROJECT', 
          payload: { 
            ...updatedProject,
            status: 'ready',
            progress: 100,
            outputVideoUrl: result.videoUrl,
            metadata: {
              ...updatedProject.metadata,
              duration: result.duration,
              fileSize: result.fileSize,
              thumbnailUrl: result.thumbnailUrl
            }
          }
        })
      }
      
      setGenerationStatus(prev => ({ 
        ...prev, 
        [projectId]: { status: 'completed', videoUrl: result.videoUrl }
      }))
      
    } catch (err) {
      // Update project status to failed
      const updatedProject = state.projects.find(p => p.projectId === projectId)
      if (updatedProject) {
        dispatch({ 
          type: 'UPDATE_PROJECT', 
          payload: { 
            ...updatedProject,
            status: 'failed',
            errorMessage: err.message
          }
        })
      }
      
      setGenerationStatus(prev => ({ 
        ...prev, 
        [projectId]: { status: 'failed', error: err.message }
      }))
    }
  }, [state.projects, dispatch])

  return {
    loading,
    error,
    generationStatus,
    generateVideo
  }
}

/**
 * Hook for file uploads
 */
export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState({})
  const { loading, error, execute } = useApiCall()

  const uploadFile = useCallback(async (file, type = 'content', onProgress) => {
    const fileId = 'temp_' + Date.now()
    
    setUploadProgress(prev => ({ 
      ...prev, 
      [fileId]: { progress: 0, status: 'uploading' }
    }))

    try {
      // Simulate upload progress if onProgress callback is provided
      if (onProgress) {
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[fileId]?.progress || 0
            const newProgress = Math.min(current + Math.random() * 20, 90)
            
            if (newProgress >= 90) {
              clearInterval(interval)
            }
            
            onProgress(newProgress)
            return {
              ...prev,
              [fileId]: { progress: newProgress, status: 'uploading' }
            }
          })
        }, 200)
      }

      const result = await execute(() => internalApi.uploadFile(file, type))
      
      setUploadProgress(prev => ({ 
        ...prev, 
        [fileId]: { progress: 100, status: 'completed', result }
      }))

      return result
    } catch (err) {
      setUploadProgress(prev => ({ 
        ...prev, 
        [fileId]: { progress: 0, status: 'failed', error: err.message }
      }))
      throw err
    }
  }, [execute])

  const uploadMultipleFiles = useCallback(async (files, type = 'content', onProgress) => {
    const uploads = files.map(file => uploadFile(file, type, onProgress))
    return await Promise.all(uploads)
  }, [uploadFile])

  return {
    loading,
    error,
    uploadProgress,
    uploadFile,
    uploadMultipleFiles
  }
}

/**
 * Hook for subscription management
 */
export function useSubscription() {
  const { state, dispatch } = useApp()
  const [subscription, setSubscription] = useState(null)
  const { loading, error, execute } = useApiCall()

  const loadSubscription = useCallback(async () => {
    // In a real app, you'd get the subscription ID from the user data
    const subscriptionId = state.user.subscriptionId
    if (subscriptionId) {
      const sub = await execute(() => paymentService.getSubscription(subscriptionId))
      setSubscription(sub)
      return sub
    }
  }, [state.user.subscriptionId, execute])

  const createSubscription = useCallback(async (priceId) => {
    const sub = await execute(() => 
      paymentService.createSubscription(priceId, state.user.stripeCustomerId)
    )
    setSubscription(sub)
    
    // Update user's subscription tier
    dispatch({ 
      type: 'UPDATE_USER', 
      payload: { 
        ...state.user, 
        subscriptionTier: sub.tier,
        subscriptionId: sub.subscriptionId
      }
    })
    
    return sub
  }, [state.user.stripeCustomerId, execute, dispatch, state.user])

  const updateSubscription = useCallback(async (priceId) => {
    const sub = await execute(() => 
      paymentService.updateSubscription(subscription.subscriptionId, priceId)
    )
    setSubscription(sub)
    
    // Update user's subscription tier
    dispatch({ 
      type: 'UPDATE_USER', 
      payload: { 
        ...state.user, 
        subscriptionTier: sub.tier
      }
    })
    
    return sub
  }, [subscription?.subscriptionId, execute, dispatch, state.user])

  const cancelSubscription = useCallback(async () => {
    await execute(() => paymentService.cancelSubscription(subscription.subscriptionId))
    setSubscription(prev => ({ ...prev, status: 'canceled' }))
  }, [subscription?.subscriptionId, execute])

  return {
    subscription,
    loading,
    error,
    loadSubscription,
    createSubscription,
    updateSubscription,
    cancelSubscription
  }
}

/**
 * Hook for templates
 */
export function useTemplates() {
  const { state, dispatch } = useApp()
  const { loading, error, execute } = useApiCall()

  const loadTemplates = useCallback(async () => {
    const templates = await execute(() => internalApi.getTemplates())
    dispatch({ type: 'SET_TEMPLATES', payload: templates })
    return templates
  }, [execute, dispatch])

  const getTemplate = useCallback(async (templateId) => {
    return await execute(() => internalApi.getTemplate(templateId))
  }, [execute])

  return {
    templates: state.templates,
    loading,
    error,
    loadTemplates,
    getTemplate
  }
}

export default {
  useApiCall,
  useBrandAssets,
  useProjects,
  useVideoGeneration,
  useFileUpload,
  useSubscription,
  useTemplates
}
