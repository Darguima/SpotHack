import React, { useEffect } from 'react'
import { StatusBar, LogBox } from 'react-native'

import { AuthProvider } from './src/contexts/auth'
import Routes from './src/routes/index'

const mobile:React.FC = () => {
	useEffect(() => {
		LogBox.ignoreLogs([
			'react-native-ytdl is out of date! If the latest port is available, update with "npm install react-native-ytdl@latest".'
		])
	}, [])

	return (
		<AuthProvider>
			<StatusBar barStyle={'light-content'} translucent={false} backgroundColor={'#1c5ed6'}/>

			<Routes />
		</ AuthProvider>
	)
}

export default mobile
