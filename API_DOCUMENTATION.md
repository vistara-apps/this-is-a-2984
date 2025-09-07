# BrandSync AI Video - API Documentation

## Overview

BrandSync AI Video provides a comprehensive API for automated video generation with brand consistency. The API integrates with multiple AI services (Runway AI, Pictory AI) and provides subscription management through Stripe.

## Base URL

```
Production: https://api.brandsync.ai/v1
Development: http://localhost:3001/api
```

## Authentication

All API requests require authentication using JWT tokens in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Acme Corp"
}
```

**Response:**
```json
{
  "user": {
    "userId": "user_123",
    "email": "user@example.com",
    "subscriptionTier": "Basic",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "company": "Acme Corp"
    }
  },
  "token": "jwt_token_here"
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### POST /auth/google
Login with Google OAuth token.

**Request Body:**
```json
{
  "token": "google_oauth_token"
}
```

#### POST /auth/logout
Logout and invalidate token.

#### GET /auth/verify
Verify current token validity.

## User Management

#### GET /users/{userId}
Get user profile information.

#### PUT /users/{userId}
Update user profile.

**Request Body:**
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "company": "Updated Corp",
    "avatar": "https://example.com/avatar.jpg"
  },
  "preferences": {
    "defaultTemplate": "template_123",
    "autoApplyBranding": true,
    "notifications": {
      "email": true,
      "videoComplete": true
    }
  }
}
```

## Brand Assets

#### GET /users/{userId}/brand-assets
Get all brand assets for a user.

**Response:**
```json
[
  {
    "assetId": "asset_123",
    "userId": "user_123",
    "type": "logo",
    "name": "Company Logo",
    "url": "https://storage.example.com/logo.png",
    "details": {
      "width": 200,
      "height": 100,
      "format": "png",
      "placement": "bottom-right",
      "opacity": 1
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /users/{userId}/brand-assets
Create a new brand asset.

**Request Body:**
```json
{
  "type": "color",
  "name": "Primary Brand Color",
  "url": "",
  "details": {
    "hex": "#FF6B35",
    "rgb": "rgb(255, 107, 53)",
    "hsl": "hsl(20, 100%, 60%)",
    "name": "Brand Orange",
    "usage": "primary"
  }
}
```

#### PUT /brand-assets/{assetId}
Update a brand asset.

#### DELETE /brand-assets/{assetId}
Delete a brand asset.

## Projects

#### GET /users/{userId}/projects
Get all projects for a user.

**Query Parameters:**
- `status` (optional): Filter by status (draft, generating, ready, failed)
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset

**Response:**
```json
[
  {
    "projectId": "project_123",
    "userId": "user_123",
    "projectName": "Product Launch Video",
    "description": "Marketing video for new product",
    "inputContentUrls": [
      "https://storage.example.com/input1.mp4",
      "https://storage.example.com/input2.jpg"
    ],
    "templateId": "template_123",
    "status": "ready",
    "outputVideoUrl": "https://storage.example.com/output.mp4",
    "progress": 100,
    "settings": {
      "duration": 30,
      "resolution": "1920x1080",
      "fps": 30,
      "quality": "high"
    },
    "brandAssetIds": ["asset_123", "asset_456"],
    "metadata": {
      "fileSize": 15728640,
      "duration": 30.5,
      "thumbnailUrl": "https://storage.example.com/thumb.jpg"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T01:00:00Z"
  }
]
```

#### POST /users/{userId}/projects
Create a new project.

**Request Body:**
```json
{
  "projectName": "New Marketing Video",
  "description": "Q1 marketing campaign video",
  "templateId": "template_123",
  "inputContentUrls": [
    "https://storage.example.com/content1.mp4"
  ],
  "brandAssetIds": ["asset_123"],
  "settings": {
    "duration": 30,
    "resolution": "1920x1080",
    "quality": "high"
  },
  "customizations": {
    "logoPlacement": "bottom-right",
    "colorScheme": "brand"
  }
}
```

#### PUT /projects/{projectId}
Update a project.

#### DELETE /projects/{projectId}
Delete a project.

## Video Templates

#### GET /templates
Get all available video templates.

**Query Parameters:**
- `category` (optional): Filter by category (social, marketing, tutorial, product)
- `isPremium` (optional): Filter by premium status (true/false)
- `format` (optional): Filter by format (landscape, portrait, square)

**Response:**
```json
[
  {
    "templateId": "template_123",
    "name": "Social Media Ad",
    "description": "Perfect for Instagram and Facebook ads",
    "category": "social",
    "layoutConfig": {
      "duration": 15,
      "format": "square",
      "resolution": "1080x1080",
      "aspectRatio": "1:1",
      "logoPlacement": "bottom-right",
      "textPlacement": "center"
    },
    "thumbnailUrl": "https://storage.example.com/template-thumb.jpg",
    "previewVideoUrl": "https://storage.example.com/template-preview.mp4",
    "tags": ["social", "advertising", "square"],
    "isPremium": false,
    "aiServicePreference": "pictory",
    "rating": 4.5,
    "usageCount": 1250
  }
]
```

#### GET /templates/{templateId}
Get a specific template by ID.

## File Upload

#### POST /upload
Upload a file for use in projects or as brand assets.

**Request:** Multipart form data
- `file`: The file to upload
- `type`: File type (content, brand-asset, avatar)
- `projectId` (optional): Associate with a project

**Response:**
```json
{
  "fileId": "file_123",
  "originalName": "video.mp4",
  "fileName": "processed_video_123.mp4",
  "url": "https://storage.example.com/processed_video_123.mp4",
  "thumbnailUrl": "https://storage.example.com/thumb_123.jpg",
  "fileSize": 15728640,
  "mimeType": "video/mp4",
  "fileType": "video",
  "duration": 30.5,
  "dimensions": {
    "width": 1920,
    "height": 1080
  }
}
```

## Video Generation

#### POST /video/generate
Start video generation for a project.

**Request Body:**
```json
{
  "projectId": "project_123",
  "templateId": "template_123",
  "inputFiles": [
    {
      "url": "https://storage.example.com/input.mp4",
      "type": "video"
    }
  ],
  "brandAssets": [
    {
      "assetId": "asset_123",
      "type": "logo",
      "url": "https://storage.example.com/logo.png"
    }
  ],
  "customizations": {
    "logoPlacement": "bottom-right",
    "colorScheme": "brand",
    "duration": 30
  }
}
```

**Response:**
```json
{
  "taskId": "task_123",
  "service": "runway",
  "status": "queued",
  "estimatedDuration": 300
}
```

#### GET /video/status/{taskId}
Check video generation status.

**Response:**
```json
{
  "taskId": "task_123",
  "status": "completed",
  "progress": 100,
  "videoUrl": "https://storage.example.com/generated_video.mp4",
  "thumbnailUrl": "https://storage.example.com/generated_thumb.jpg",
  "duration": 30.5,
  "fileSize": 25165824,
  "metadata": {
    "resolution": "1920x1080",
    "fps": 30,
    "codec": "h264"
  }
}
```

## Subscription Management

#### GET /subscriptions/{subscriptionId}
Get subscription details.

**Response:**
```json
{
  "subscriptionId": "sub_123",
  "userId": "user_123",
  "tier": "Pro",
  "status": "active",
  "stripeSubscriptionId": "sub_stripe_123",
  "currentPeriodStart": "2024-01-01T00:00:00Z",
  "currentPeriodEnd": "2024-02-01T00:00:00Z",
  "usage": {
    "videosGenerated": 15,
    "videosLimit": 50,
    "storageUsed": 1073741824,
    "storageLimit": 5368709120
  },
  "billing": {
    "amount": 9900,
    "currency": "usd",
    "interval": "month"
  }
}
```

#### POST /subscriptions/create
Create a new subscription.

**Request Body:**
```json
{
  "priceId": "price_stripe_123",
  "customerId": "cus_stripe_123"
}
```

#### PUT /subscriptions/{subscriptionId}
Update subscription (upgrade/downgrade).

**Request Body:**
```json
{
  "priceId": "price_stripe_456"
}
```

#### POST /subscriptions/{subscriptionId}/cancel
Cancel a subscription.

## Payment Processing

#### POST /payments/create-intent
Create a Stripe payment intent.

**Request Body:**
```json
{
  "amount": 9900,
  "currency": "usd",
  "metadata": {
    "userId": "user_123",
    "subscriptionTier": "Pro"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_123_secret_456",
  "paymentIntentId": "pi_123"
}
```

## Webhooks

### Stripe Webhooks

#### POST /webhooks/stripe
Handle Stripe webhook events.

**Events Handled:**
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### AI Service Webhooks

#### POST /webhooks/runway
Handle Runway AI completion webhooks.

#### POST /webhooks/pictory
Handle Pictory AI completion webhooks.

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes

- `AUTHENTICATION_REQUIRED` (401)
- `INSUFFICIENT_PERMISSIONS` (403)
- `RESOURCE_NOT_FOUND` (404)
- `VALIDATION_ERROR` (400)
- `RATE_LIMIT_EXCEEDED` (429)
- `SUBSCRIPTION_REQUIRED` (402)
- `INTERNAL_SERVER_ERROR` (500)

## Rate Limits

API requests are rate-limited based on subscription tier:

- **Basic**: 100 requests/hour
- **Pro**: 1000 requests/hour  
- **Premium**: 5000 requests/hour

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Request limit per hour
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install @brandsync/api-client
```

### Python
```bash
pip install brandsync-api
```

### cURL Examples

#### Create a project
```bash
curl -X POST https://api.brandsync.ai/v1/users/user_123/projects \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Marketing Video",
    "templateId": "template_123",
    "inputContentUrls": ["https://example.com/video.mp4"]
  }'
```

#### Generate video
```bash
curl -X POST https://api.brandsync.ai/v1/video/generate \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "project_123",
    "templateId": "template_123"
  }'
```

## Support

For API support and questions:
- Email: api-support@brandsync.ai
- Documentation: https://docs.brandsync.ai
- Status Page: https://status.brandsync.ai
