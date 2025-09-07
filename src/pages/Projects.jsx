import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { Video, Download, Eye, Trash2, Plus, Search, Filter } from 'lucide-react'

export default function Projects() {
  const { state, dispatch } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredProjects = state.projects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch({
        type: 'SET_PROJECTS',
        payload: state.projects.filter(p => p.projectId !== projectId)
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'generating':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">Projects</h1>
              <p className="text-base font-normal leading-7 text-gray-600">
                Manage and download your AI-generated videos
              </p>
            </div>
            <Link
              to="/create"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="ready">Ready</option>
                <option value="generating">Generating</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-surface rounded-lg shadow-card p-12 text-center">
            <Video className="h-16 w-16 mx-auto text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {state.projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {state.projects.length === 0
                ? 'Create your first AI-generated video to get started with BrandSync AI.'
                : 'Try adjusting your search terms or filters to find what you\'re looking for.'
              }
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.projectId} className="bg-surface rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow">
                {/* Video Preview */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate mr-2">
                      {project.projectName}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>
                      <span className="font-medium">Files:</span> {project.inputContentUrls?.length || 0} items
                    </p>
                    <p>
                      <span className="font-medium">Created:</span> 2 days ago
                    </p>
                    {project.templateId && (
                      <p>
                        <span className="font-medium">Template:</span> {
                          state.templates.find(t => t.templateId === project.templateId)?.name || 'Unknown'
                        }
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {project.status === 'ready' && (
                      <>
                        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </button>
                        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-accent text-white text-sm rounded-md hover:bg-green-600 transition-colors">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </>
                    )}
                    
                    {project.status === 'generating' && (
                      <div className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-100 text-yellow-800 text-sm rounded-md">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent mr-2" />
                        Processing...
                      </div>
                    )}

                    {project.status === 'failed' && (
                      <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                        Retry
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteProject(project.projectId)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Usage Stats */}
        <div className="mt-12 bg-surface rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{state.projects.length}</div>
              <div className="text-sm text-gray-600">Total Videos Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {state.projects.filter(p => p.status === 'ready').length}
              </div>
              <div className="text-sm text-gray-600">Successfully Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round((state.projects.filter(p => p.status === 'ready').length / Math.max(1, state.projects.length)) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}