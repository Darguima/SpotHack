import React from 'react'
import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar'

import Routes from './src/routes/index'

import { AuthProvider } from './src/contexts/auth'

export default function App () {
  setStatusBarBackgroundColor('#1c5ed6', false)

  /* Also is used the `UserDataProvider` but is defined in the src/routes/app.routes.tsx */
  return (
    <AuthProvider>
      <StatusBar style="light" translucent={false} />

      <Routes />
    </AuthProvider>
  )
}
