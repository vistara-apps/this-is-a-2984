/**
 * Data Models for BrandSync AI Video
 * Complete implementation of the PRD data model specifications
 */

/**
 * User Entity
 */
export class User {
  constructor(data = {}) {
    this.userId = data.userId || this.generateId()
    this.email = data.email || ''
    this.subscriptionTier = data.subscriptionTier || 'Basic'
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    this.profile = data.profile || {
      firstName: '',
      lastName: '',
      company: '',
      avatar: null
    }
    this.preferences = data.preferences || {
      defaultTemplate: null,
      autoApplyBranding: true,
      notifications: {
        email: true,
        videoComplete: true,
        subscriptionUpdates: true
      }
    }
  }

  generateId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      subscriptionTier: this.subscriptionTier,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      profile: this.profile,
      preferences: this.preferences
    }
  }

  static fromJSON(data) {
    return new User(data)
  }
}

/**
 * BrandAssets Entity
 */
export class BrandAsset {
  constructor(data = {}) {
    this.assetId = data.assetId || this.generateId()
    this.userId = data.userId || ''
    this.type = data.type || 'logo' // 'logo', 'font', 'color'
    this.name = data.name || ''
    this.url = data.url || ''
    this.details = data.details || {}
    this.isActive = data.isActive !== undefined ? data.isActive : true
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    
    // Type-specific validation and defaults
    this.validateAndSetDefaults()
  }

  generateId() {
    return 'asset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  validateAndSetDefaults() {
    switch (this.type) {
      case 'logo':
        this.details = {
          width: this.details.width || null,
          height: this.details.height || null,
          format: this.details.format || 'png',
          placement: this.details.placement || 'bottom-right',
          opacity: this.details.opacity || 1,
          ...this.details
        }
        break
      
      case 'color':
        this.details = {
          hex: this.details.hex || '#000000',
          rgb: this.details.rgb || 'rgb(0, 0, 0)',
          hsl: this.details.hsl || 'hsl(0, 0%, 0%)',
          name: this.details.name || 'Primary Color',
          usage: this.details.usage || 'primary', // 'primary', 'secondary', 'accent', 'background'
          ...this.details
        }
        break
      
      case 'font':
        this.details = {
          fontFamily: this.details.fontFamily || 'Arial',
          fontWeight: this.details.fontWeight || 'normal',
          fontSize: this.details.fontSize || '16px',
          lineHeight: this.details.lineHeight || '1.5',
          usage: this.details.usage || 'body', // 'heading', 'body', 'caption'
          webfontUrl: this.details.webfontUrl || null,
          ...this.details
        }
        break
    }
  }

  toJSON() {
    return {
      assetId: this.assetId,
      userId: this.userId,
      type: this.type,
      name: this.name,
      url: this.url,
      details: this.details,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static fromJSON(data) {
    return new BrandAsset(data)
  }
}

/**
 * Project Entity
 */
export class Project {
  constructor(data = {}) {
    this.projectId = data.projectId || this.generateId()
    this.userId = data.userId || ''
    this.projectName = data.projectName || 'Untitled Project'
    this.description = data.description || ''
    this.inputContentUrls = data.inputContentUrls || []
    this.templateId = data.templateId || null
    this.status = data.status || 'draft' // 'draft', 'generating', 'ready', 'failed'
    this.outputVideoUrl = data.outputVideoUrl || null
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    
    // Extended properties
    this.settings = data.settings || {
      duration: 30,
      resolution: '1920x1080',
      fps: 30,
      quality: 'high'
    }
    this.brandAssetIds = data.brandAssetIds || []
    this.customizations = data.customizations || {}
    this.progress = data.progress || 0
    this.errorMessage = data.errorMessage || null
    this.taskId = data.taskId || null // For tracking AI service tasks
    this.aiService = data.aiService || null // 'runway' or 'pictory'
    this.metadata = data.metadata || {
      fileSize: null,
      duration: null,
      thumbnailUrl: null,
      downloadCount: 0
    }
  }

  generateId() {
    return 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  updateStatus(status, additionalData = {}) {
    this.status = status
    this.updatedAt = new Date().toISOString()
    
    if (additionalData.progress !== undefined) {
      this.progress = additionalData.progress
    }
    
    if (additionalData.errorMessage) {
      this.errorMessage = additionalData.errorMessage
    }
    
    if (additionalData.outputVideoUrl) {
      this.outputVideoUrl = additionalData.outputVideoUrl
    }
    
    if (additionalData.metadata) {
      this.metadata = { ...this.metadata, ...additionalData.metadata }
    }
  }

  toJSON() {
    return {
      projectId: this.projectId,
      userId: this.userId,
      projectName: this.projectName,
      description: this.description,
      inputContentUrls: this.inputContentUrls,
      templateId: this.templateId,
      status: this.status,
      outputVideoUrl: this.outputVideoUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      settings: this.settings,
      brandAssetIds: this.brandAssetIds,
      customizations: this.customizations,
      progress: this.progress,
      errorMessage: this.errorMessage,
      taskId: this.taskId,
      aiService: this.aiService,
      metadata: this.metadata
    }
  }

  static fromJSON(data) {
    return new Project(data)
  }
}

/**
 * VideoTemplate Entity
 */
export class VideoTemplate {
  constructor(data = {}) {
    this.templateId = data.templateId || this.generateId()
    this.name = data.name || 'Untitled Template'
    this.description = data.description || ''
    this.category = data.category || 'general' // 'social', 'marketing', 'tutorial', 'product', 'general'
    this.layoutConfig = data.layoutConfig || {}
    this.defaultBrandAssets = data.defaultBrandAssets || []
    this.isActive = data.isActive !== undefined ? data.isActive : true
    this.isPremium = data.isPremium !== undefined ? data.isPremium : false
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    
    // Extended properties
    this.thumbnailUrl = data.thumbnailUrl || null
    this.previewVideoUrl = data.previewVideoUrl || null
    this.tags = data.tags || []
    this.usageCount = data.usageCount || 0
    this.rating = data.rating || 0
    this.aiServicePreference = data.aiServicePreference || 'runway' // 'runway', 'pictory', 'auto'
    
    // Validate and set layout config defaults
    this.validateLayoutConfig()
  }

  generateId() {
    return 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  validateLayoutConfig() {
    this.layoutConfig = {
      duration: this.layoutConfig.duration || 30,
      format: this.layoutConfig.format || 'landscape', // 'landscape', 'portrait', 'square'
      resolution: this.layoutConfig.resolution || '1920x1080',
      fps: this.layoutConfig.fps || 30,
      aspectRatio: this.layoutConfig.aspectRatio || '16:9',
      
      // Layout elements
      elements: this.layoutConfig.elements || [],
      transitions: this.layoutConfig.transitions || [],
      animations: this.layoutConfig.animations || [],
      
      // Brand asset placement
      logoPlacement: this.layoutConfig.logoPlacement || 'bottom-right',
      textPlacement: this.layoutConfig.textPlacement || 'center',
      colorScheme: this.layoutConfig.colorScheme || 'auto',
      
      ...this.layoutConfig
    }
  }

  toJSON() {
    return {
      templateId: this.templateId,
      name: this.name,
      description: this.description,
      category: this.category,
      layoutConfig: this.layoutConfig,
      defaultBrandAssets: this.defaultBrandAssets,
      isActive: this.isActive,
      isPremium: this.isPremium,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      thumbnailUrl: this.thumbnailUrl,
      previewVideoUrl: this.previewVideoUrl,
      tags: this.tags,
      usageCount: this.usageCount,
      rating: this.rating,
      aiServicePreference: this.aiServicePreference
    }
  }

  static fromJSON(data) {
    return new VideoTemplate(data)
  }
}

/**
 * Subscription Entity
 */
export class Subscription {
  constructor(data = {}) {
    this.subscriptionId = data.subscriptionId || this.generateId()
    this.userId = data.userId || ''
    this.tier = data.tier || 'Basic' // 'Basic', 'Pro', 'Premium'
    this.status = data.status || 'active' // 'active', 'canceled', 'past_due', 'unpaid'
    this.stripeSubscriptionId = data.stripeSubscriptionId || null
    this.stripePriceId = data.stripePriceId || null
    this.currentPeriodStart = data.currentPeriodStart || new Date().toISOString()
    this.currentPeriodEnd = data.currentPeriodEnd || null
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    
    // Usage tracking
    this.usage = data.usage || {
      videosGenerated: 0,
      videosLimit: this.getVideoLimit(),
      storageUsed: 0,
      storageLimit: this.getStorageLimit()
    }
    
    // Billing
    this.billing = data.billing || {
      amount: this.getAmount(),
      currency: 'usd',
      interval: 'month'
    }
  }

  generateId() {
    return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  getVideoLimit() {
    const limits = {
      'Basic': 10,
      'Pro': 50,
      'Premium': -1 // Unlimited
    }
    return limits[this.tier] || 10
  }

  getStorageLimit() {
    const limits = {
      'Basic': 1024 * 1024 * 1024, // 1GB
      'Pro': 5 * 1024 * 1024 * 1024, // 5GB
      'Premium': 20 * 1024 * 1024 * 1024 // 20GB
    }
    return limits[this.tier] || 1024 * 1024 * 1024
  }

  getAmount() {
    const amounts = {
      'Basic': 2900, // $29.00 in cents
      'Pro': 9900, // $99.00 in cents
      'Premium': 29900 // $299.00 in cents
    }
    return amounts[this.tier] || 2900
  }

  canGenerateVideo() {
    if (this.status !== 'active') return false
    if (this.usage.videosLimit === -1) return true // Unlimited
    return this.usage.videosGenerated < this.usage.videosLimit
  }

  incrementVideoUsage() {
    this.usage.videosGenerated += 1
    this.updatedAt = new Date().toISOString()
  }

  toJSON() {
    return {
      subscriptionId: this.subscriptionId,
      userId: this.userId,
      tier: this.tier,
      status: this.status,
      stripeSubscriptionId: this.stripeSubscriptionId,
      stripePriceId: this.stripePriceId,
      currentPeriodStart: this.currentPeriodStart,
      currentPeriodEnd: this.currentPeriodEnd,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      usage: this.usage,
      billing: this.billing
    }
  }

  static fromJSON(data) {
    return new Subscription(data)
  }
}

/**
 * File Upload Entity
 */
export class UploadedFile {
  constructor(data = {}) {
    this.fileId = data.fileId || this.generateId()
    this.userId = data.userId || ''
    this.projectId = data.projectId || null
    this.originalName = data.originalName || ''
    this.fileName = data.fileName || ''
    this.fileSize = data.fileSize || 0
    this.mimeType = data.mimeType || ''
    this.fileType = data.fileType || 'unknown' // 'video', 'image', 'audio', 'text', 'document'
    this.url = data.url || ''
    this.thumbnailUrl = data.thumbnailUrl || null
    this.duration = data.duration || null // For video/audio files
    this.dimensions = data.dimensions || null // For image/video files
    this.uploadedAt = data.uploadedAt || new Date().toISOString()
    this.metadata = data.metadata || {}
  }

  generateId() {
    return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  toJSON() {
    return {
      fileId: this.fileId,
      userId: this.userId,
      projectId: this.projectId,
      originalName: this.originalName,
      fileName: this.fileName,
      fileSize: this.fileSize,
      mimeType: this.mimeType,
      fileType: this.fileType,
      url: this.url,
      thumbnailUrl: this.thumbnailUrl,
      duration: this.duration,
      dimensions: this.dimensions,
      uploadedAt: this.uploadedAt,
      metadata: this.metadata
    }
  }

  static fromJSON(data) {
    return new UploadedFile(data)
  }
}

/**
 * Model Factory and Utilities
 */
export const ModelFactory = {
  createUser(data) {
    return new User(data)
  },
  
  createBrandAsset(data) {
    return new BrandAsset(data)
  },
  
  createProject(data) {
    return new Project(data)
  },
  
  createVideoTemplate(data) {
    return new VideoTemplate(data)
  },
  
  createSubscription(data) {
    return new Subscription(data)
  },
  
  createUploadedFile(data) {
    return new UploadedFile(data)
  }
}

export default {
  User,
  BrandAsset,
  Project,
  VideoTemplate,
  Subscription,
  UploadedFile,
  ModelFactory
}
