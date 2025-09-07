# BrandSync AI Video

**Automate branded video creation with AI customization.**

BrandSync AI Video is a comprehensive web application that allows users to generate custom, on-brand videos automatically using AI, solving the pain of maintaining brand consistency in video content at scale.

## 🚀 Features

### Core Features

- **Brand Asset Upload & Application**: Upload logos, custom fonts, and brand color palettes. AI automatically incorporates these assets into generated videos for perfect brand consistency.

- **AI-Powered Content Assembly**: Leverage AI to automatically select, sequence, and assemble user-provided raw video clips, images, and text into coherent video narratives.

- **Layout Customization Controls**: Intuitive controls (sliders, drag-and-drop presets) for defining element placement, timing, and transitions within video templates.

- **Template-Driven Workflow**: Pre-defined video templates for common use cases (social media ads, tutorials, product demos) that users can populate with their content.

### Additional Features

- **Multi-AI Integration**: Supports both Runway AI and Pictory AI for different video generation needs
- **Subscription Management**: Tiered pricing with Stripe integration
- **Real-time Progress Tracking**: Live updates on video generation status
- **File Management**: Comprehensive upload and storage system
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 18** with modern hooks and context
- **Tailwind CSS** with custom design system
- **React Router** for navigation
- **Framer Motion** for animations
- **React Hook Form** with Zod validation

### Backend Integration
- **RESTful API** design
- **JWT Authentication**
- **Stripe Payments** integration
- **AI Service APIs** (Runway AI, Pictory AI)

### Data Models
- **User Management**: Profiles, preferences, subscriptions
- **Brand Assets**: Logos, colors, fonts with metadata
- **Projects**: Video projects with status tracking
- **Templates**: Reusable video templates
- **File Management**: Upload tracking and metadata

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-2984.git
   cd this-is-a-2984
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys and configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_RUNWAY_API_KEY=your_runway_api_key
   VITE_PICTORY_API_KEY=your_pictory_api_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Usage

### Getting Started

1. **User Registration/Login**
   - Create account or login with existing credentials
   - Google OAuth integration available
   - Demo mode for testing

2. **Brand Setup**
   - Upload your brand logo
   - Define brand colors (hex, RGB, HSL)
   - Set custom fonts and typography
   - Configure brand preferences

3. **Create Video Project**
   - Choose from available templates
   - Upload content (videos, images, text)
   - Customize layout and timing
   - Apply brand assets automatically

4. **Generate Video**
   - AI processes your content and brand assets
   - Real-time progress tracking
   - Download completed video

### Template Categories

- **Social Media**: Instagram posts, Facebook ads, TikTok videos
- **Marketing**: Product demos, brand stories, promotional content
- **Tutorial**: Educational content, how-to videos
- **Product**: Product showcases, feature highlights

## 🔧 API Integration

### AI Services

#### Runway AI
- Advanced video generation and editing
- Complex scene composition
- High-quality output

#### Pictory AI
- Script-to-video conversion
- Automated content assembly
- Fast processing

### Payment Processing

#### Stripe Integration
- Subscription management
- Payment processing
- Webhook handling
- Usage tracking

### Subscription Tiers

- **Basic**: 10 videos/month - $29/month
- **Pro**: 50 videos/month - $99/month
- **Premium**: Unlimited videos - $299/month

## 🎨 Design System

### Colors
- **Primary**: `hsl(220, 86%, 40%)` - Brand blue
- **Accent**: `hsl(140, 56%, 45%)` - Success green
- **Background**: `hsl(220, 16%, 95%)` - Light gray
- **Surface**: `hsl(0, 0%, 100%)` - White

### Typography
- **Display**: Large headings (text-5xl font-bold)
- **Heading**: Section headers (text-2xl font-semibold)
- **Body**: Regular text (text-base font-normal leading-7)

### Components
- **VideoUploader**: File upload with drag-and-drop
- **BrandAssetManager**: Brand asset management
- **TemplateSelector**: Template browsing and selection
- **LayoutEditor**: Visual layout customization
- **ProgressTracker**: Real-time progress indication

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BrandAssetManager.jsx
│   ├── Layout.jsx
│   ├── LayoutEditor.jsx
│   ├── ProgressTracker.jsx
│   ├── TemplateSelector.jsx
│   └── VideoUploader.jsx
├── context/            # React context providers
│   └── AppContext.jsx
├── hooks/              # Custom React hooks
│   └── useApi.js
├── models/             # Data models and types
│   └── index.js
├── pages/              # Page components
│   ├── BrandAssets.jsx
│   ├── CreateProject.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   └── Subscription.jsx
├── services/           # API and external services
│   ├── api.js
│   └── auth.js
├── App.jsx             # Main app component
├── index.css           # Global styles
└── main.jsx            # App entry point
```

## 🔒 Security

- **JWT Authentication**: Secure token-based auth
- **API Key Management**: Environment-based configuration
- **Input Validation**: Zod schema validation
- **File Upload Security**: Type and size restrictions
- **Rate Limiting**: API request throttling

## 🚀 Deployment

### Environment Setup
1. Configure production environment variables
2. Set up API endpoints
3. Configure Stripe webhooks
4. Set up AI service integrations

### Build Process
```bash
npm run build
```

### Docker Support
```bash
docker build -t brandsync-ai-video .
docker run -p 3000:3000 brandsync-ai-video
```

## 📊 Monitoring

- **Error Tracking**: Comprehensive error handling
- **Usage Analytics**: Track video generation metrics
- **Performance Monitoring**: API response times
- **User Behavior**: Feature usage tracking

## 🧪 Testing

### Development Testing
```bash
npm run test
```

### E2E Testing
```bash
npm run test:e2e
```

### API Testing
- Comprehensive API endpoint testing
- Authentication flow testing
- Payment integration testing

## 📚 Documentation

- **API Documentation**: Complete REST API reference
- **Component Documentation**: Storybook integration
- **User Guide**: Step-by-step usage instructions
- **Developer Guide**: Technical implementation details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@brandsync.ai
- **Documentation**: https://docs.brandsync.ai
- **Status Page**: https://status.brandsync.ai
- **Community**: https://community.brandsync.ai

## 🎉 Acknowledgments

- **Runway AI** for advanced video generation capabilities
- **Pictory AI** for script-to-video conversion
- **Stripe** for payment processing
- **Tailwind CSS** for the design system
- **React** ecosystem for the frontend framework

---

**Built with ❤️ by the BrandSync team**
