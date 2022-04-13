import React from 'react'
import { Text, View, TextInput, StyleSheet, Dimensions, Linking } from 'react-native'

const SpotifyCredentialsPage:React.FC = () => {
	return (
		<View style={styles.container}>

			<View style={styles.infoTextContainer}>

				<Text style={styles.infoTextTitle}>Spotify Credentials</Text>

				<Text style={styles.infoText}>
					How to get Spotify Developer Credentials:
					{'\n\n'}
					1. Access <Text style={{ color: '#00f' }} onPress={() => Linking.openURL('https://developer.spotify.com/dashboard/login')} >Spotify For Developers</Text>.
					{'\n'}
					2. Login with your Spotify Account.
					{'\n'}
					3. Create An App.
					{'\n'}
					4. Copy the credentials.
					{'\n\n'}
					Watch our <Text style={{ color: '#00f' }} onPress={() => Linking.openURL('https://github.com/Darguima/SpotHack')} >GitHub tutorial video</Text>.
				</Text>

			</View>

			<View style={styles.inputArea}>

				<View style={styles.inputContainer}>
					<Text style={styles.inputInfoText}>Client Id:</Text>
					<TextInput style={styles.input} />
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.inputInfoText}>Client Secret:</Text>
					<TextInput style={styles.input} />
				</View>

			</View>

		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height
	},

	infoTextContainer: {
		width: '100%',
		height: '40%',

		justifyContent: 'space-between',
		alignItems: 'center'
	},

	infoTextTitle: {
		textAlign: 'center',
		fontSize: 22,
		fontWeight: 'bold'
	},

	infoText: {
		width: '95%',
		fontSize: 16
	},

	inputArea: {
		justifyContent: 'space-evenly',
		alignItems: 'center',

		width: '100%',
		height: '60%'
	},

	inputContainer: {
		width: '80%'
	},

	inputInfoText: {
		fontSize: 16,
		marginBottom: 8
	},

	input: {
		backgroundColor: '#fff',

		borderRadius: 8,
		borderWidth: 2
	}
})

export default SpotifyCredentialsPage
