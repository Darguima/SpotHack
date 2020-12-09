import React from 'react'
import { ActivityIndicator } from 'react-native'

const LoadingPage: React.FC = () => (
  <ActivityIndicator
    size="large"
    color="#000"
    style={
      {
        flex: 1,
        backgroundColor: '#1c5ed6'
      }
    }
  />
)

export default LoadingPage
