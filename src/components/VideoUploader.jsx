import React, { useState, useRef } from 'react'
import { Upload, X, File, Image as ImageIcon, FileText } from 'lucide-react'

export default function VideoUploader({ 
  variant = 'multiFile', 
  onFilesChange,
  acceptedTypes = '.mp4,.mov,.avi,.jpg,.jpeg,.png,.gif,.txt,.md'
}) {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles)
    if (variant === 'singleFile') {
      setFiles([fileArray[0]])
      onFilesChange?.([fileArray[0]])
    } else {
      setFiles(prev => [...prev, ...fileArray])
      onFilesChange?.(files.concat(fileArray))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e) => {
    handleFiles(e.target.files)
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange?.(newFiles)
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('video/')) return <File className="h-5 w-5 text-purple-500" />
    if (file.type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-500" />
    if (file.type.startsWith('text/')) return <FileText className="h-5 w-5 text-green-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={variant !== 'singleFile'}
          accept={acceptedTypes}
          onChange={handleChange}
          className="hidden"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {variant === 'singleFile' ? 'Upload a file' : 'Upload your content'}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop files here, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-primary hover:text-blue-700 font-medium"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Supported: Videos (MP4, MOV, AVI), Images (JPG, PNG, GIF), Text files
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center">
                  {getFileIcon(file)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}