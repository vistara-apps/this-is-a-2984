import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import VideoUploader from '../components/VideoUploader'
import TemplateSelector from '../components/TemplateSelector'
import LayoutEditor from '../components/LayoutEditor'
import ProgressTracker from '../components/ProgressTracker'
import { ArrowLeft, ArrowRight, Wand2 } from 'lucide-react'

export default function CreateProject() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState({
    name: '',
    files: [],
    template: null,
    isGenerating: false,
    progress: 0
  })

  const steps = [
    { id: 1, title: 'Upload Content', description: 'Add your videos, images, and text' },
    { id: 2, title: 'Choose Template', description: 'Select a video template' },
    { id: 3, title: 'Customize Layout', description: 'Adjust design and timing' },
    { id: 4, title: 'Generate Video', description: 'AI creates your branded video' }
  ]

  const handleFilesChange = (files) => {
    setProjectData(prev => ({ ...prev, files }))
  }

  const handleTemplateSelect = (template) => {
    setProjectData(prev => ({ ...prev, template }))
  }

  const handleGenerateVideo = () => {
    setProjectData(prev => ({ ...prev, isGenerating: true, progress: 0 }))
    
    // Simulate video generation progress
    const interval = setInterval(() => {
      setProjectData(prev => {
        const newProgress = prev.progress + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          
          // Create project and add to state
          const newProject = {
            projectId: Date.now().toString(),
            userId: state.user.userId,
            projectName: prev.name || 'Untitled Project',
            inputContentUrls: prev.files.map(f => f.name),
            templateId: prev.template?.templateId,
            status: 'ready',
            outputVideoUrl: '/generated-video.mp4'
          }
          
          dispatch({ type: 'ADD_PROJECT', payload: newProject })
          
          setTimeout(() => {
            navigate('/projects')
          }, 1000)
          
          return { ...prev, progress: 100, isGenerating: false }
        }
        return { ...prev, progress: newProgress }
      })
    }, 500)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return projectData.files.length > 0
      case 2:
        return projectData.template !== null
      case 3:
        return true
      default:
        return false
    }
  }

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

        {/* Project Name */}
        <div className="mb-8">
          <div className="bg-surface rounded-lg shadow-card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

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
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
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
                  setCurrentStep(Math.min(4, currentStep + 1))
                }
              }}
              disabled={!canProceed()}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 4 ? 'Generate Video' : 'Next'}
              {currentStep !== 4 && <ArrowRight className="h-4 w-4 ml-2" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}