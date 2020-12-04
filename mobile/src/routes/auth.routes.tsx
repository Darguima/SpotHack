import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LoginPage from '../pages/LoginPage'

const AuthStack = createStackNavigator()

const AuthRoutes: React.FC = () => (
  <NavigationContainer>
    <AuthStack.Navigator>
      <AuthStack.Screen name="LoginPage" component={LoginPage}/>
    </AuthStack.Navigator>
  </NavigationContainer>
)

export default AuthRoutes
