#!/usr/bin/env node

/**
 * Build validation script for BrandSync AI Video
 * Validates that the build output is correct and all required files exist
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.join(__dirname, '..', 'dist')

console.log('🔍 Validating build output...')

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Build failed: dist directory not found')
  process.exit(1)
}

// Required files that should exist after build
const requiredFiles = [
  'index.html',
  'assets'
]

// Check required files
for (const file of requiredFiles) {
  const filePath = path.join(distDir, file)
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Build validation failed: ${file} not found`)
    process.exit(1)
  }
}

// Check if assets directory has files
const assetsDir = path.join(distDir, 'assets')
const assetFiles = fs.readdirSync(assetsDir)

if (assetFiles.length === 0) {
  console.error('❌ Build validation failed: No asset files found')
  process.exit(1)
}

// Check for required asset types
const hasCSS = assetFiles.some(file => file.endsWith('.css'))
const hasJS = assetFiles.some(file => file.endsWith('.js'))

if (!hasCSS) {
  console.error('❌ Build validation failed: No CSS files found')
  process.exit(1)
}

if (!hasJS) {
  console.error('❌ Build validation failed: No JavaScript files found')
  process.exit(1)
}

// Check index.html content
const indexPath = path.join(distDir, 'index.html')
const indexContent = fs.readFileSync(indexPath, 'utf8')

if (!indexContent.includes('<div id="root">')) {
  console.error('❌ Build validation failed: index.html missing root div')
  process.exit(1)
}

// Calculate total build size
let totalSize = 0
function calculateSize(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      calculateSize(filePath)
    } else {
      totalSize += stat.size
    }
  }
}

calculateSize(distDir)
const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2)

console.log('✅ Build validation passed!')
console.log(`📦 Total build size: ${totalSizeMB} MB`)
console.log(`📁 Asset files: ${assetFiles.length}`)
console.log('🚀 Build is ready for deployment')
