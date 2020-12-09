import React from 'react'

import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'

import useAuth from '../contexts/auth'

import LoadingPage from '../pages/LoadingPage'

const Routes: React.FC = () => {
  const { loading, signed } = useAuth()

  if (loading) {
    return <LoadingPage />
  }

  return signed ? <AppRoutes /> : <AuthRoutes />
}

export default Routes
