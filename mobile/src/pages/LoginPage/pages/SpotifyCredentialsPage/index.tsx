import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'

const SpotifyCredentialsPage:React.FC = () => {
	return (
		<View style={styles.container}>
			<Text></Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,

		justifyContent: 'space-around',
		alignItems: 'center'
	}
})

export default SpotifyCredentialsPage
