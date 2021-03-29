import React from 'react'
import { StyleSheet, View } from 'react-native'
import DefaultDownloadSource from './components/DefaultDownloadSource'

import RootPathInput from './components/RootPathInput'

const SpotifyAccountSettings:React.FC = () => {
	return (
		<View style={styles.spotHackContainer}>

			<RootPathInput />

			<DefaultDownloadSource />

		</View>
	)
}

const styles = StyleSheet.create({
	spotHackContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%'
	}

})

export default SpotifyAccountSettings
