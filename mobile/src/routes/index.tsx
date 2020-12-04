import React from 'react'

import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'

import LoadingPage from '../pages/LoadingPage'

import useAuth from '../contexts/auth'

const Routes: React.FC = () => {
  const { loading, signed } = useAuth()

  if (loading) {
    return <LoadingPage />
  } else {
    if (!signed) {
      return <AuthRoutes />
    } else {
      return <AppRoutes />
    }
  }
}

export default Routes
