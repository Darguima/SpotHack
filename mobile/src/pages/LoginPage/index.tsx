import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import SpotifyCredentialsPage from './pages/SpotifyCredentialsPage'
import SpotifyLoginPage from './pages/SpotifyLoginPage'

const LoginPage:React.FC = () => {
	return (
		<ScrollView
			style={styles.container}
			pagingEnabled={true}
			showsVerticalScrollIndicator={false}
		>
			<SpotifyLoginPage />
			<SpotifyCredentialsPage />
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,

		backgroundColor: '#1c5ed6'
	}
})

export default LoginPage
