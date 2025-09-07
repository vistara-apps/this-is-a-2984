import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    userId: '1',
    email: 'user@example.com',
    subscriptionTier: 'Pro',
    profile: {
      firstName: 'Demo',
      lastName: 'User',
      company: 'BrandSync Demo',
      avatar: null
    },
    preferences: {
      defaultTemplate: null,
      autoApplyBranding: true,
      notifications: {
        email: true,
        videoComplete: true,
        subscriptionUpdates: true
      }
    }
  },
  brandAssets: [],
  projects: [],
  templates: [
    {
      templateId: '1',
      name: 'Social Media Ad',
      description: 'Perfect for Instagram and Facebook ads',
      category: 'social',
      layoutConfig: { 
        duration: 15, 
        format: 'square',
        resolution: '1080x1080',
        aspectRatio: '1:1'
      },
      thumbnailUrl: '/templates/social-ad-thumb.jpg',
      tags: ['social', 'advertising', 'square'],
      isPremium: false,
      aiServicePreference: 'pictory'
    },
    {
      templateId: '2',
      name: 'Product Demo',
      description: 'Showcase your product features',
      category: 'product',
      layoutConfig: { 
        duration: 30, 
        format: 'landscape',
        resolution: '1920x1080',
        aspectRatio: '16:9'
      },
      thumbnailUrl: '/templates/product-demo-thumb.jpg',
      tags: ['product', 'demo', 'landscape'],
      isPremium: false,
      aiServicePreference: 'runway'
    },
    {
      templateId: '3',
      name: 'Tutorial Video',
      description: 'Step-by-step instructional content',
      category: 'tutorial',
      layoutConfig: { 
        duration: 60, 
        format: 'landscape',
        resolution: '1920x1080',
        aspectRatio: '16:9'
      },
      thumbnailUrl: '/templates/tutorial-thumb.jpg',
      tags: ['tutorial', 'education', 'landscape'],
      isPremium: true,
      aiServicePreference: 'runway'
    },
    {
      templateId: '4',
      name: 'Brand Story',
      description: 'Tell your brand story with impact',
      category: 'marketing',
      layoutConfig: { 
        duration: 45, 
        format: 'landscape',
        resolution: '1920x1080',
        aspectRatio: '16:9'
      },
      thumbnailUrl: '/templates/brand-story-thumb.jpg',
      tags: ['branding', 'story', 'marketing'],
      isPremium: true,
      aiServicePreference: 'runway'
    },
    {
      templateId: '5',
      name: 'Instagram Story',
      description: 'Vertical format for Instagram Stories',
      category: 'social',
      layoutConfig: { 
        duration: 10, 
        format: 'portrait',
        resolution: '1080x1920',
        aspectRatio: '9:16'
      },
      thumbnailUrl: '/templates/instagram-story-thumb.jpg',
      tags: ['instagram', 'story', 'vertical'],
      isPremium: false,
      aiServicePreference: 'pictory'
    }
  ],
  currentProject: null,
  loading: {},
  errors: {},
  notifications: []
}

function appReducer(state, action) {
  switch (action.type) {
    // User actions
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    
    // Brand Assets actions
    case 'SET_BRAND_ASSETS':
      return { ...state, brandAssets: action.payload }
    case 'ADD_BRAND_ASSET':
      return { ...state, brandAssets: [...state.brandAssets, action.payload] }
    case 'UPDATE_BRAND_ASSET':
      return {
        ...state,
        brandAssets: state.brandAssets.map(asset =>
          asset.assetId === action.payload.assetId ? action.payload : asset
        )
      }
    case 'REMOVE_BRAND_ASSET':
      return { 
        ...state, 
        brandAssets: state.brandAssets.filter(asset => asset.assetId !== action.payload) 
      }
    
    // Projects actions
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload }
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.projectId === action.payload.projectId ? action.payload : project
        ),
        currentProject: state.currentProject?.projectId === action.payload.projectId 
          ? action.payload 
          : state.currentProject
      }
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.projectId !== action.payload),
        currentProject: state.currentProject?.projectId === action.payload 
          ? null 
          : state.currentProject
      }
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload }
    
    // Templates actions
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload }
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] }
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.templateId === action.payload.templateId ? action.payload : template
        )
      }
    
    // UI state actions
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.key]: action.payload } }
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.key]: action.payload } }
    case 'CLEAR_ERROR':
      return { 
        ...state, 
        errors: Object.keys(state.errors).reduce((acc, key) => {
          if (key !== action.key) acc[key] = state.errors[key]
          return acc
        }, {})
      }
    case 'CLEAR_ALL_ERRORS':
      return { ...state, errors: {} }
    
    // Notification actions
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      }
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    
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
