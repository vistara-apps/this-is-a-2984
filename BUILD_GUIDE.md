# Build Guide - BrandSync AI Video

## Overview

This guide covers the build process, troubleshooting, and deployment for the BrandSync AI Video Next.js Base Mini App.

## Build Process

### Prerequisites

- Node.js 18+ 
- npm 8+
- Git

### Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Build with validation
npm run build:validate

# Preview production build
npm run preview
```

### Build Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build in `dist/` |
| `npm run build:validate` | Build + validate output |
| `npm run build:clean` | Clean dist folder and rebuild |
| `npm run preview` | Preview production build locally |

### Build Configuration

The build is configured in `vite.config.js` with:

- **Code Splitting**: Automatic chunking for optimal loading
- **Minification**: ESBuild for fast, efficient minification
- **Asset Optimization**: Automatic CSS and JS optimization
- **Bundle Analysis**: Built-in bundle size warnings

### Build Output

```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-*.css     # Compiled styles
│   ├── index-*.js      # Main application bundle
│   ├── vendor-*.js     # React and core dependencies
│   ├── ui-*.js         # UI components (Lucide, Framer Motion)
│   ├── forms-*.js      # Form handling libraries
│   └── utils-*.js      # Utility libraries
```

## Build Validation

The build process includes automatic validation:

### Validation Checks

- ✅ Dist directory exists
- ✅ Required files present (index.html, assets/)
- ✅ CSS and JS files generated
- ✅ HTML structure valid
- ✅ Bundle size analysis

### Running Validation

```bash
# Validate existing build
node scripts/validate-build.js

# Build and validate
npm run build:validate
```

## Troubleshooting

### Common Build Issues

#### 1. "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. "Out of memory" errors
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### 3. Build succeeds but validation fails
```bash
# Check for missing dependencies
npm audit
npm run build:clean
```

### Build Performance

- **Cold build**: ~4-6 seconds
- **Incremental build**: ~1-2 seconds
- **Bundle size**: ~260KB total
- **Chunks**: 6 optimized chunks

### Environment Variables

Create `.env` file for configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# AI Services
VITE_RUNWAY_API_KEY=your_runway_key
VITE_PICTORY_API_KEY=your_pictory_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Features
VITE_ENABLE_DEMO_MODE=true
VITE_DEBUG_MODE=false
```

## Deployment

### GitHub Actions

The repository includes automated CI/CD:

1. **Build**: Runs `npm run build`
2. **Validate**: Runs build validation
3. **Deploy**: Deploys to Vercel (if configured)

### Manual Deployment

```bash
# Build for production
npm run build:validate

# Deploy dist/ folder to your hosting provider
# Examples:
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod --dir=dist
# - AWS S3: aws s3 sync dist/ s3://your-bucket
```

### Vercel Configuration

To enable automatic Vercel deployment, add these repository secrets:

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID  
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Check individual chunk sizes
ls -la dist/assets/
```

### Optimization Tips

1. **Code Splitting**: Already configured for optimal chunks
2. **Tree Shaking**: Automatic with Vite
3. **Minification**: ESBuild provides fast minification
4. **Asset Optimization**: Images and fonts optimized automatically

## Development vs Production

### Development Build
- Source maps enabled
- Hot module replacement
- Unminified code
- Development warnings

### Production Build
- Minified and optimized
- Source maps disabled
- Tree shaking applied
- Performance optimized

## Support

### Build Issues

If you encounter build issues:

1. Check Node.js version: `node --version` (should be 18+)
2. Clear cache: `npm run clean`
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Run validation: `npm run build:validate`

### Getting Help

- Check the main [README.md](./README.md) for general setup
- Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Open an issue for build-specific problems

---

**Last Updated**: September 2025  
**Build System**: Vite 5.4.19  
**Node.js**: 18+ Required
