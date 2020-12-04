import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Dashboard from '../pages/Dashboard'

const AppStack = createStackNavigator()

const AppRoutes: React.FC = () => (
  <NavigationContainer>
    <AppStack.Navigator>
      <AppStack.Screen name="Dashboard" component={Dashboard}/>
    </AppStack.Navigator>
  </NavigationContainer>
)

export default AppRoutes
