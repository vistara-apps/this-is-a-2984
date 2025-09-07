import React from 'react'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function ProgressTracker({ 
  variant = 'bar', 
  progress = 0, 
  status = 'processing',
  steps = []
}) {
  const getStatusIcon = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-accent" />
      case 'processing':
        return <Clock className="h-5 w-5 text-primary animate-spin" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 bg-gray-300 rounded-full" />
    }
  }

  if (variant === 'circular') {
    const circumference = 2 * Math.PI * 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className="flex flex-col items-center p-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-300 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-gray-900 capitalize">{status}</p>
          <p className="text-xs text-gray-500">Processing your video...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg shadow-card p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Video Generation Progress</h3>
          <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {steps.length > 0 && (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              {getStatusIcon(step.status)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{step.title}</p>
                {step.description && (
                  <p className="text-xs text-gray-600">{step.description}</p>
                )}
              </div>
              {step.status === 'processing' && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-75" />
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}