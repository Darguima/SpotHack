import React from 'react'

import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'

import useAuth from '../contexts/auth'
import { UserDataProvider } from '../contexts/userData'
import { UserHistoryProvider } from '../contexts/userHistory'

import LoadingPage from '../pages/LoadingPage'

const Routes: React.FC = () => {
  const { loading, signed } = useAuth()

  if (loading) {
    return <LoadingPage />
  }

  return signed
    ? <UserDataProvider>
        <UserHistoryProvider>
          <AppRoutes />
        </UserHistoryProvider>
      </UserDataProvider>
    : <AuthRoutes />
}

export default Routes
