import React from 'react'
import { StatusBar } from 'react-native'

import { AuthProvider } from './src/contexts/auth'
import Routes from './src/routes/index'

const mobile:React.FC = () => {
  return (
    <AuthProvider>
      <StatusBar barStyle={'light-content'} translucent={false} backgroundColor={'#1c5ed6'}/>

      <Routes />
    </ AuthProvider>
  )
}

export default mobile
