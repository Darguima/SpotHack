import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LoginPage from '../pages/LoginPage'

const { Navigator, Screen } = createStackNavigator()

const AuthRoutes: React.FC = () => (
	<NavigationContainer>
		<Navigator screenOptions={{ headerShown: false }}>
			<Screen name="LoginPage" component={LoginPage}/>
		</Navigator>
	</NavigationContainer>
)

export default AuthRoutes
