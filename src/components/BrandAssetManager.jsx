import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Palette, Upload, X, Edit, Save, Plus } from 'lucide-react'

export default function BrandAssetManager({ variant = 'list' }) {
  const { state, dispatch } = useApp()
  const [editingAsset, setEditingAsset] = useState(null)
  const [newAsset, setNewAsset] = useState({ type: 'logo', details: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  const addAsset = () => {
    const asset = {
      assetId: Date.now().toString(),
      userId: state.user.userId,
      type: newAsset.type,
      url: newAsset.url || '',
      details: newAsset.details
    }
    dispatch({ type: 'ADD_BRAND_ASSET', payload: asset })
    setNewAsset({ type: 'logo', details: '' })
    setShowAddForm(false)
  }

  const removeAsset = (assetId) => {
    dispatch({ type: 'REMOVE_BRAND_ASSET', payload: assetId })
  }

  const getAssetIcon = (type) => {
    switch (type) {
      case 'logo':
        return '🎨'
      case 'font':
        return '📝'
      case 'color':
        return '🎨'
      default:
        return '📁'
    }
  }

  if (variant === 'editForm' && editingAsset) {
    return (
      <div className="bg-surface rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Brand Asset</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Type
            </label>
            <select
              value={editingAsset.type}
              onChange={(e) => setEditingAsset({ ...editingAsset, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="logo">Logo</option>
              <option value="font">Font</option>
              <option value="color">Color</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Details
            </label>
            <input
              type="text"
              value={editingAsset.details}
              onChange={(e) => setEditingAsset({ ...editingAsset, details: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter asset details (e.g., #FF5733 for colors, font family names)"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                // Save logic here
                setEditingAsset(null)
              }}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={() => setEditingAsset(null)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Palette className="h-5 w-5 mr-2 text-primary" />
          Brand Assets
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="font-medium mb-3">Add New Brand Asset</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={newAsset.type}
              onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="logo">Logo</option>
              <option value="font">Font</option>
              <option value="color">Color</option>
            </select>
            <input
              type="text"
              value={newAsset.details}
              onChange={(e) => setNewAsset({ ...newAsset, details: e.target.value })}
              placeholder="Details (e.g., #FF5733, Arial, etc.)"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex space-x-2">
              <button
                onClick={addAsset}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {state.brandAssets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No brand assets uploaded yet.</p>
            <p className="text-sm">Add your logo, colors, and fonts to get started.</p>
          </div>
        ) : (
          state.brandAssets.map((asset) => (
            <div
              key={asset.assetId}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getAssetIcon(asset.type)}</span>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{asset.type}</p>
                  <p className="text-sm text-gray-600">{asset.details}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingAsset(asset)}
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeAsset(asset.assetId)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}