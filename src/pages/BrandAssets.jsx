import React from 'react'
import BrandAssetManager from '../components/BrandAssetManager'
import { Palette, Upload } from 'lucide-react'

export default function BrandAssets() {
  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Brand Assets</h1>
          <p className="text-base font-normal leading-7 text-gray-600 max-w-2xl">
            Upload and manage your brand assets to ensure consistent branding across all generated videos.
            Add your logos, define your color palette, and set your preferred fonts.
          </p>
        </div>

        {/* Quick Upload Section */}
        <div className="bg-gradient-to-r from-accent to-green-600 rounded-lg p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-semibold mb-2">Brand Consistency Made Easy</h2>
              <p className="text-green-100">
                Upload your brand assets once and they'll be automatically applied to all your videos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Palette className="h-8 w-8" />
              <Upload className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Brand Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-lg shadow-card p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                🎨
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Logos</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload your brand logos in PNG or SVG format. Transparent backgrounds work best.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Recommended size: 512x512px</li>
              <li>• Formats: PNG, SVG, JPG</li>
              <li>• Transparent background preferred</li>
            </ul>
          </div>

          <div className="bg-surface rounded-lg shadow-card p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                🎨
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Colors</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Define your brand color palette using hex codes for consistent color application.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Use hex format: #FF5733</li>
              <li>• Primary and secondary colors</li>
              <li>• Accent colors for highlights</li>
            </ul>
          </div>

          <div className="bg-surface rounded-lg shadow-card p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                📝
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fonts</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Specify your brand fonts by name. We support Google Fonts and system fonts.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Use font family names</li>
              <li>• Google Fonts supported</li>
              <li>• Fallback fonts recommended</li>
            </ul>
          </div>
        </div>

        {/* Brand Asset Manager */}
        <BrandAssetManager variant="list" />
      </div>
    </div>
  )
}