import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    userId: '1',
    email: 'user@example.com',
    subscriptionTier: 'Pro'
  },
  brandAssets: [],
  projects: [],
  templates: [
    {
      templateId: '1',
      name: 'Social Media Ad',
      description: 'Perfect for Instagram and Facebook ads',
      layoutConfig: { duration: 15, format: 'square' }
    },
    {
      templateId: '2',
      name: 'Product Demo',
      description: 'Showcase your product features',
      layoutConfig: { duration: 30, format: 'landscape' }
    },
    {
      templateId: '3',
      name: 'Tutorial Video',
      description: 'Step-by-step instructional content',
      layoutConfig: { duration: 60, format: 'landscape' }
    }
  ],
  currentProject: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_BRAND_ASSETS':
      return { ...state, brandAssets: action.payload }
    case 'ADD_BRAND_ASSET':
      return { ...state, brandAssets: [...state.brandAssets, action.payload] }
    case 'REMOVE_BRAND_ASSET':
      return { 
        ...state, 
        brandAssets: state.brandAssets.filter(asset => asset.assetId !== action.payload) 
      }
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload }
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.projectId === action.payload.projectId ? action.payload : project
        )
      }
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}