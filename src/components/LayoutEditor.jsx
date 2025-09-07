import React, { useState } from 'react'
import { Move, RotateCcw, Layers, Settings, Play } from 'lucide-react'

export default function LayoutEditor({ variant = 'stage', project }) {
  const [selectedElement, setSelectedElement] = useState(null)
  const [timeline, setTimeline] = useState({
    duration: 30,
    currentTime: 0,
    elements: [
      { id: 1, type: 'video', start: 0, duration: 15, layer: 1 },
      { id: 2, type: 'text', start: 5, duration: 10, layer: 2 },
      { id: 3, type: 'logo', start: 0, duration: 30, layer: 3 }
    ]
  })

  if (variant === 'timeline') {
    return (
      <div className="bg-surface rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            Timeline Editor
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
              <Play className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Timeline ruler */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm font-medium w-16">Time:</span>
            <div className="flex-1 relative h-8 bg-gray-100 rounded">
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{ left: `${(timeline.currentTime / timeline.duration) * 100}%` }}
              />
              {[...Array(Math.ceil(timeline.duration / 5))].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-gray-300"
                  style={{ left: `${(i * 5 / timeline.duration) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Timeline tracks */}
          {timeline.elements.map((element) => (
            <div key={element.id} className="flex items-center space-x-2">
              <span className="text-sm w-16 capitalize">{element.type}</span>
              <div className="flex-1 relative h-8 bg-gray-100 rounded">
                <div
                  className={`absolute top-1 bottom-1 rounded ${
                    element.type === 'video' ? 'bg-purple-400' :
                    element.type === 'text' ? 'bg-green-400' : 'bg-blue-400'
                  } cursor-pointer hover:opacity-80 transition-opacity`}
                  style={{
                    left: `${(element.start / timeline.duration) * 100}%`,
                    width: `${(element.duration / timeline.duration) * 100}%`
                  }}
                  onClick={() => setSelectedElement(element)}
                />
              </div>
            </div>
          ))}
        </div>

        {selectedElement && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Element Properties</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-gray-600">Start Time</label>
                <span className="font-medium">{selectedElement.start}s</span>
              </div>
              <div>
                <label className="block text-gray-600">Duration</label>
                <span className="font-medium">{selectedElement.duration}s</span>
              </div>
              <div>
                <label className="block text-gray-600">Type</label>
                <span className="font-medium capitalize">{selectedElement.type}</span>
              </div>
              <div>
                <label className="block text-gray-600">Layer</label>
                <span className="font-medium">{selectedElement.layer}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Move className="h-5 w-5 mr-2 text-primary" />
          Layout Editor
        </h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Canvas */}
        <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
          <div className="absolute inset-4 border-2 border-dashed border-gray-400 rounded">
            <div className="absolute top-4 left-4 w-20 h-20 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
              Logo
            </div>
            <div className="absolute bottom-4 left-4 right-4 h-16 bg-purple-500 rounded flex items-center justify-center text-white">
              Video Content
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded">
              Text Overlay
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Position
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Center</option>
              <option>Top</option>
              <option>Bottom</option>
              <option>Left</option>
              <option>Right</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Position
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Top Left</option>
              <option>Top Right</option>
              <option>Bottom Left</option>
              <option>Bottom Right</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transition
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Fade</option>
              <option>Slide</option>
              <option>Zoom</option>
              <option>None</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}