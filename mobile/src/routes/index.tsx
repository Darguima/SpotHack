import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'

import useAuth from '../contexts/auth'

const Routes: React.FC = () => {
  const { loading, signed } = useAuth()

  if (loading) {
    return <View style={
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1c5ed6'
      }
      }>
        <ActivityIndicator size="large" color="#000" />
    </View>
  }

  return signed ? <AppRoutes /> : <AuthRoutes />
}

export default Routes
