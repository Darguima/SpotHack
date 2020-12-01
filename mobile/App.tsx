import React from 'react'
import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar'

import LoginPage from './src/LoginPage'

export default function App () {
  setStatusBarBackgroundColor('#1c5ed6', false)

  return (
    <>
     <StatusBar style="light" translucent={false} />

      <LoginPage />
    </>
  )
}
