import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { useProjects, useVideoGeneration, useFileUpload, useBrandAssets } from '../hooks/useApi'
import VideoUploader from '../components/VideoUploader'
import TemplateSelector from '../components/TemplateSelector'
import LayoutEditor from '../components/LayoutEditor'
import ProgressTracker from '../components/ProgressTracker'
import { ArrowLeft, ArrowRight, Wand2, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateProject() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  
  // API hooks
  const { createProject, loading: projectLoading } = useProjects()
  const { generateVideo, loading: generationLoading, generationStatus } = useVideoGeneration()
  const { uploadFile, uploadMultipleFiles, uploadProgress } = useFileUpload()
  const { brandAssets, loadBrandAssets } = useBrandAssets()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState({
    projectName: '',
    description: '',
    files: [],
    uploadedFiles: [],
    template: null,
    selectedBrandAssets: [],
    customizations: {},
    isGenerating: false,
    progress: 0,
    errors: {}
  })

  const steps = [
    { id: 1, title: 'Upload Content', description: 'Add your videos, images, and text' },
    { id: 2, title: 'Choose Template', description: 'Select a video template' },
    { id: 3, title: 'Customize Layout', description: 'Adjust design and timing' },
    { id: 4, title: 'Generate Video', description: 'AI creates your branded video' }
  ]

  // Load brand assets on component mount
  useEffect(() => {
    loadBrandAssets().catch(err => {
      console.error('Failed to load brand assets:', err)
      toast.error('Failed to load brand assets')
    })
  }, [loadBrandAssets])

  // Handle file uploads
  const handleFilesChange = async (files) => {
    setProjectData(prev => ({ ...prev, files }))
    
    try {
      toast.loading('Uploading files...', { id: 'upload' })
      const uploadedFiles = await uploadMultipleFiles(files, 'content')
      
      setProjectData(prev => ({ 
        ...prev, 
        uploadedFiles: [...prev.uploadedFiles, ...uploadedFiles]
      }))
      
      toast.success('Files uploaded successfully!', { id: 'upload' })
    } catch (error) {
      console.error('File upload failed:', error)
      toast.error('Failed to upload files', { id: 'upload' })
    }
  }

  const handleTemplateSelect = (template) => {
    setProjectData(prev => ({ ...prev, template }))
    
    // Auto-select compatible brand assets
    if (template && brandAssets.length > 0) {
      const compatibleAssets = brandAssets.filter(asset => asset.isActive)
      setProjectData(prev => ({ 
        ...prev, 
        selectedBrandAssets: compatibleAssets.map(asset => asset.assetId)
      }))
    }
  }

  const handleBrandAssetToggle = (assetId) => {
    setProjectData(prev => ({
      ...prev,
      selectedBrandAssets: prev.selectedBrandAssets.includes(assetId)
        ? prev.selectedBrandAssets.filter(id => id !== assetId)
        : [...prev.selectedBrandAssets, assetId]
    }))
  }

  const handleCustomizationChange = (key, value) => {
    setProjectData(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [key]: value
      }
    }))
  }

  const validateStep = (step) => {
    const errors = {}
    
    switch (step) {
      case 1:
        if (!projectData.projectName.trim()) {
          errors.projectName = 'Project name is required'
        }
        if (projectData.uploadedFiles.length === 0) {
          errors.files = 'At least one file is required'
        }
        break
      case 2:
        if (!projectData.template) {
          errors.template = 'Please select a template'
        }
        break
      case 3:
        // Layout customizations are optional
        break
    }
    
    setProjectData(prev => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleGenerateVideo = async () => {
    if (!validateStep(3)) return
    
    try {
      setProjectData(prev => ({ ...prev, isGenerating: true, progress: 0 }))
      
      // Create project first
      const newProject = await createProject({
        projectName: projectData.projectName,
        description: projectData.description,
        templateId: projectData.template.templateId,
        inputContentUrls: projectData.uploadedFiles.map(file => file.url),
        brandAssetIds: projectData.selectedBrandAssets,
        customizations: projectData.customizations,
        settings: {
          duration: projectData.template.layoutConfig.duration,
          resolution: projectData.template.layoutConfig.resolution,
          fps: projectData.template.layoutConfig.fps || 30,
          quality: 'high'
        }
      })
      
      toast.success('Project created successfully!')
      
      // Start video generation
      await generateVideo(newProject)
      
      toast.success('Video generation started!')
      
      // Navigate to projects page to monitor progress
      setTimeout(() => {
        navigate('/projects')
      }, 2000)
      
    } catch (error) {
      console.error('Video generation failed:', error)
      toast.error('Failed to generate video: ' + error.message)
      setProjectData(prev => ({ ...prev, isGenerating: false, progress: 0 }))
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return projectData.projectName.trim() && projectData.uploadedFiles.length > 0
      case 2:
        return projectData.template !== null
      case 3:
        return true
      default:
        return false
    }
  }

  const isLoading = projectLoading || generationLoading || Object.keys(uploadProgress).some(
    key => uploadProgress[key].status === 'uploading'
  )

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-5xl font-bold text-gray-900">Create New Video</h1>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3 min-w-0">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-px bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Project Details - Only show on step 1 */}
        {currentStep === 1 && (
          <div className="mb-8">
            <div className="bg-surface rounded-lg shadow-card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectData.projectName}
                  onChange={(e) => setProjectData(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Enter project name..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    projectData.errors.projectName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {projectData.errors.projectName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {projectData.errors.projectName}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your video project..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <VideoUploader
              variant="multiFile"
              onFilesChange={handleFilesChange}
            />
          )}

          {currentStep === 2 && (
            <TemplateSelector
              variant="grid"
              onSelectTemplate={handleTemplateSelect}
            />
          )}

          {currentStep === 3 && (
            <LayoutEditor variant="stage" project={projectData} />
          )}

          {currentStep === 4 && !projectData.isGenerating && (
            <div className="bg-surface rounded-lg shadow-card p-8 text-center">
              <Wand2 className="h-16 w-16 mx-auto text-primary mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Ready to Generate Your Video?
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Our AI will now process your content using the selected template and your brand assets 
                to create a professional video.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium">Content Files</span>
                  <span className="text-sm text-gray-600">{projectData.files.length} files</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium">Template</span>
                  <span className="text-sm text-gray-600">{projectData.template?.name}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium">Brand Assets</span>
                  <span className="text-sm text-gray-600">{state.brandAssets.length} assets</span>
                </div>
              </div>

              <button
                onClick={handleGenerateVideo}
                className="px-8 py-3 bg-primary text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Generate Video
              </button>
            </div>
          )}

          {projectData.isGenerating && (
            <ProgressTracker
              variant="bar"
              progress={projectData.progress}
              status="generating"
              steps={[
                { title: 'Analyzing content', status: 'completed' },
                { title: 'Applying brand assets', status: 'completed' },
                { title: 'Assembling video', status: 'processing' },
                { title: 'Rendering final output', status: 'pending' }
              ]}
            />
          )}
        </div>

        {/* Navigation */}
        {!projectData.isGenerating && (
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isLoading}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <button
              onClick={() => {
                if (currentStep === 4) {
                  handleGenerateVideo()
                } else {
                  handleNextStep()
                }
              }}
              disabled={!canProceed() || isLoading}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : currentStep === 4 ? 'Generate Video' : 'Next'}
              {currentStep !== 4 && !isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
              {currentStep === 4 && !isLoading && <Wand2 className="h-4 w-4 ml-2" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
