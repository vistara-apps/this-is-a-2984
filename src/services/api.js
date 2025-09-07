/**
 * API Service Layer for BrandSync AI Video
 * Handles all external API integrations and internal API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
const RUNWAY_API_URL = 'https://api.runwayml.com/v1'
const PICTORY_API_URL = 'https://api.pictory.ai/v1'

// API Configuration
const apiConfig = {
  runwayApiKey: import.meta.env.VITE_RUNWAY_API_KEY,
  pictoryApiKey: import.meta.env.VITE_PICTORY_API_KEY,
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
}

/**
 * Generic API request handler
 */
async function apiRequest(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

/**
 * Internal API Services
 */
export const internalApi = {
  // User Management
  async getUser(userId) {
    return apiRequest(`${API_BASE_URL}/users/${userId}`)
  },

  async updateUser(userId, userData) {
    return apiRequest(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  },

  // Brand Assets
  async getBrandAssets(userId) {
    return apiRequest(`${API_BASE_URL}/users/${userId}/brand-assets`)
  },

  async createBrandAsset(userId, assetData) {
    return apiRequest(`${API_BASE_URL}/users/${userId}/brand-assets`, {
      method: 'POST',
      body: JSON.stringify(assetData)
    })
  },

  async updateBrandAsset(assetId, assetData) {
    return apiRequest(`${API_BASE_URL}/brand-assets/${assetId}`, {
      method: 'PUT',
      body: JSON.stringify(assetData)
    })
  },

  async deleteBrandAsset(assetId) {
    return apiRequest(`${API_BASE_URL}/brand-assets/${assetId}`, {
      method: 'DELETE'
    })
  },

  // Projects
  async getProjects(userId) {
    return apiRequest(`${API_BASE_URL}/users/${userId}/projects`)
  },

  async createProject(userId, projectData) {
    return apiRequest(`${API_BASE_URL}/users/${userId}/projects`, {
      method: 'POST',
      body: JSON.stringify(projectData)
    })
  },

  async updateProject(projectId, projectData) {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    })
  },

  async deleteProject(projectId) {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE'
    })
  },

  // Video Templates
  async getTemplates() {
    return apiRequest(`${API_BASE_URL}/templates`)
  },

  async getTemplate(templateId) {
    return apiRequest(`${API_BASE_URL}/templates/${templateId}`)
  },

  // File Upload
  async uploadFile(file, type = 'content') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return apiRequest(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData
    })
  }
}

/**
 * Runway AI Integration
 */
export const runwayApi = {
  async generateVideo(prompt, options = {}) {
    if (!apiConfig.runwayApiKey) {
      throw new Error('Runway API key not configured')
    }

    return apiRequest(`${RUNWAY_API_URL}/video/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.runwayApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        duration: options.duration || 10,
        resolution: options.resolution || '1280x720',
        fps: options.fps || 24,
        ...options
      })
    })
  },

  async editVideo(videoId, editInstructions) {
    if (!apiConfig.runwayApiKey) {
      throw new Error('Runway API key not configured')
    }

    return apiRequest(`${RUNWAY_API_URL}/video/edit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.runwayApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        video_id: videoId,
        instructions: editInstructions
      })
    })
  },

  async getVideoStatus(taskId) {
    if (!apiConfig.runwayApiKey) {
      throw new Error('Runway API key not configured')
    }

    return apiRequest(`${RUNWAY_API_URL}/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiConfig.runwayApiKey}`
      }
    })
  }
}

/**
 * Pictory AI Integration
 */
export const pictoryApi = {
  async createVideoFromScript(script, options = {}) {
    if (!apiConfig.pictoryApiKey) {
      throw new Error('Pictory API key not configured')
    }

    return apiRequest(`${PICTORY_API_URL}/script-to-video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.pictoryApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script,
        template: options.template || 'default',
        voice: options.voice || 'natural',
        music: options.music || true,
        ...options
      })
    })
  },

  async getVideoStatus(jobId) {
    if (!apiConfig.pictoryApiKey) {
      throw new Error('Pictory API key not configured')
    }

    return apiRequest(`${PICTORY_API_URL}/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${apiConfig.pictoryApiKey}`
      }
    })
  }
}

/**
 * Video Generation Service
 * Orchestrates different AI services based on project requirements
 */
export const videoGenerationService = {
  async generateVideo(projectData, brandAssets = []) {
    const { template, files, customizations } = projectData
    
    try {
      // Determine which AI service to use based on template and content
      let result
      
      if (template.type === 'script-based' || files.some(f => f.type === 'text')) {
        // Use Pictory for script-to-video generation
        const script = files.find(f => f.type === 'text')?.content || ''
        result = await pictoryApi.createVideoFromScript(script, {
          template: template.name,
          brandAssets,
          customizations
        })
      } else {
        // Use Runway for more complex video generation and editing
        const prompt = this.buildPromptFromAssets(files, brandAssets, template)
        result = await runwayApi.generateVideo(prompt, {
          duration: template.layoutConfig.duration,
          brandAssets,
          customizations
        })
      }
      
      return result
    } catch (error) {
      console.error('Video generation failed:', error)
      throw error
    }
  },

  buildPromptFromAssets(files, brandAssets, template) {
    // Build a comprehensive prompt for AI video generation
    let prompt = `Create a ${template.description.toLowerCase()} video`
    
    // Add brand context
    if (brandAssets.length > 0) {
      const colors = brandAssets.filter(a => a.type === 'color').map(a => a.details)
      const fonts = brandAssets.filter(a => a.type === 'font').map(a => a.details)
      
      if (colors.length > 0) {
        prompt += ` using brand colors: ${colors.join(', ')}`
      }
      if (fonts.length > 0) {
        prompt += ` with ${fonts.join(', ')} typography`
      }
    }
    
    // Add content context
    if (files.length > 0) {
      prompt += `. Include the provided content: ${files.map(f => f.name).join(', ')}`
    }
    
    // Add template-specific requirements
    prompt += `. Style: ${template.name}. Duration: ${template.layoutConfig.duration} seconds.`
    
    return prompt
  },

  async pollVideoStatus(taskId, service = 'runway') {
    const maxAttempts = 60 // 5 minutes with 5-second intervals
    let attempts = 0
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++
          
          let status
          if (service === 'runway') {
            status = await runwayApi.getVideoStatus(taskId)
          } else if (service === 'pictory') {
            status = await pictoryApi.getVideoStatus(taskId)
          }
          
          if (status.status === 'completed') {
            resolve(status)
          } else if (status.status === 'failed') {
            reject(new Error(`Video generation failed: ${status.error}`))
          } else if (attempts >= maxAttempts) {
            reject(new Error('Video generation timeout'))
          } else {
            // Continue polling
            setTimeout(poll, 5000)
          }
        } catch (error) {
          reject(error)
        }
      }
      
      poll()
    })
  }
}

/**
 * Stripe Payment Integration
 */
export const paymentService = {
  async createPaymentIntent(amount, currency = 'usd') {
    return apiRequest(`${API_BASE_URL}/payments/create-intent`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency })
    })
  },

  async createSubscription(priceId, customerId) {
    return apiRequest(`${API_BASE_URL}/subscriptions/create`, {
      method: 'POST',
      body: JSON.stringify({ priceId, customerId })
    })
  },

  async updateSubscription(subscriptionId, priceId) {
    return apiRequest(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify({ priceId })
    })
  },

  async cancelSubscription(subscriptionId) {
    return apiRequest(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST'
    })
  },

  async getSubscription(subscriptionId) {
    return apiRequest(`${API_BASE_URL}/subscriptions/${subscriptionId}`)
  }
}

export default {
  internalApi,
  runwayApi,
  pictoryApi,
  videoGenerationService,
  paymentService
}
