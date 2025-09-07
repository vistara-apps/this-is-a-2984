import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Play, Clock, Square, Monitor } from 'lucide-react'

export default function TemplateSelector({ variant = 'grid', onSelectTemplate }) {
  const { state } = useApp()
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const handleSelect = (template) => {
    setSelectedTemplate(template)
    onSelectTemplate?.(template)
  }

  const getFormatIcon = (format) => {
    switch (format) {
      case 'square':
        return <Square className="h-4 w-4" />
      case 'landscape':
        return <Monitor className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  if (variant === 'carousel') {
    return (
      <div className="bg-surface rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {state.templates.map((template) => (
            <div
              key={template.templateId}
              onClick={() => handleSelect(template)}
              className={`flex-shrink-0 w-64 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedTemplate?.templateId === template.templateId
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-md mb-3 flex items-center justify-center">
                <Play className="h-8 w-8 text-gray-500" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {template.layoutConfig.duration}s
                </div>
                <div className="flex items-center">
                  {getFormatIcon(template.layoutConfig.format)}
                  <span className="ml-1 capitalize">{template.layoutConfig.format}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg shadow-card p-6">
      <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.templates.map((template) => (
          <div
            key={template.templateId}
            onClick={() => handleSelect(template)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedTemplate?.templateId === template.templateId
                ? 'border-primary bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-md mb-4 flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-500" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {template.layoutConfig.duration}s
              </div>
              <div className="flex items-center">
                {getFormatIcon(template.layoutConfig.format)}
                <span className="ml-1 capitalize">{template.layoutConfig.format}</span>
              </div>
            </div>
            {selectedTemplate?.templateId === template.templateId && (
              <div className="mt-3 text-center">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary bg-blue-100 rounded-full">
                  Selected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}