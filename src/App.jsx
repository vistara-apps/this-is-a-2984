import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Dashboard from './pages/Dashboard'
import CreateProject from './pages/CreateProject'
import BrandAssets from './pages/BrandAssets'
import Projects from './pages/Projects'
import Subscription from './pages/Subscription'

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/brand-assets" element={<BrandAssets />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/subscription" element={<Subscription />} />
          </Routes>
        </Layout>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App
