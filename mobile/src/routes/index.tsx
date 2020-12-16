import React from 'react'

import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'

import useAuth from '../contexts/auth'
import { AppUtilsProvider } from '../contexts/appUtils'
import { UserDataProvider } from '../contexts/userData'
import { UserHistoryProvider } from '../contexts/userHistory'

import LoadingPage from '../pages/OtherPages/LoadingPage'

const Routes: React.FC = () => {
  const { loading, signed } = useAuth()

  if (loading) {
    return <LoadingPage />
  }

  return signed
    ? <AppUtilsProvider>
        <UserDataProvider>
          <UserHistoryProvider>
            <AppRoutes />
         </UserHistoryProvider>
       </UserDataProvider>
      </AppUtilsProvider>
    : <AuthRoutes />
}

export default Routes
