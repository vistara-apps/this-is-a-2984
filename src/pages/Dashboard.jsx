import React from 'react'
import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { Video, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default function Dashboard() {
  const { state } = useApp()

  const stats = [
    {
      name: 'Videos Created',
      value: state.projects.length,
      icon: Video,
      color: 'text-blue-600'
    },
    {
      name: 'Processing',
      value: state.projects.filter(p => p.status === 'generating').length,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      name: 'Completed',
      value: state.projects.filter(p => p.status === 'ready').length,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      name: 'This Month',
      value: state.projects.length,
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ]

  const recentProjects = state.projects.slice(-3)

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to BrandSync AI
          </h1>
          <p className="text-base font-normal leading-7 text-gray-600 max-w-2xl">
            Create professional, on-brand videos with AI automation. Upload your content, 
            choose a template, and let our AI handle the rest.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-lg p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-semibold mb-2">Ready to create your next video?</h2>
                <p className="text-blue-100">Get started in just a few clicks</p>
              </div>
              <Link
                to="/create"
                className="inline-flex items-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Video
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-surface rounded-lg shadow-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Projects */}
        <div className="bg-surface rounded-lg shadow-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-primary hover:text-blue-700 font-medium transition-colors"
            >
              View all
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first AI-generated video to get started
              </p>
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <div key={project.projectId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{project.projectName}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'ready' 
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'generating'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-gray-500">2 days ago</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Assets</h3>
            <p className="text-gray-600 mb-4">
              Manage your logos, colors, and fonts to ensure brand consistency across all videos.
            </p>
            <Link
              to="/brand-assets"
              className="inline-flex items-center text-primary hover:text-blue-700 font-medium transition-colors"
            >
              Manage Assets →
            </Link>
          </div>

          <div className="bg-surface rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
            <p className="text-gray-600 mb-4">
              You're on the <span className="font-medium">{state.user.subscriptionTier}</span> plan. 
              Upgrade for more features and video generation capacity.
            </p>
            <Link
              to="/subscription"
              className="inline-flex items-center text-primary hover:text-blue-700 font-medium transition-colors"
            >
              View Plans →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}