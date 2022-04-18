import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import useAuth from '../../../../contexts/auth'

const SpotifyLoginPage:React.FC = () => {
	const { logIn, errorOnLogin } = useAuth()

	const loginButtonPress = () => {
		logIn()
	}

	return (
		<View style={styles.container}>
			<View style={styles.loginContainer}>
				<View style={styles.topContainer}>
					<Image
						source={require('../../../../assets/icons/spothackHorizontal.png')}
						style={styles.spotHackLogo}
					/>
				</View>

				{!!errorOnLogin &&
				<View style={styles.errorMsgContainer}>
					<Text style={styles.errorMsg}>{errorOnLogin}</Text>
				</View>
				}

				<TouchableOpacity
					style={styles.bottomContainer}
					onPress={loginButtonPress}
					activeOpacity={0.5}
				>
					<View style={styles.spotifyLogoContainer}>
						<Image
							source={require('../../../../assets/icons/spotifyIcon.png')}
							style={styles.spotifyLogo}
						/>
					</View>

					<Text style={styles.buttonText}>Login on Spotify</Text>

				</TouchableOpacity>

			</View>

			<View style={styles.swipeUpContainer}>
				<MaterialCommunityIcons name="gesture-swipe-down" size={24} color="black" />
				<Text style={styles.swipeUpText}>Swipe Up</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height
	},

	loginContainer: {
		flex: 1,

		justifyContent: 'space-around',
		alignItems: 'center'
	},

	topContainer: {
		width: '70%',
		height: '20%'
	},

	spotHackLogo: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain'
	},

	errorMsgContainer: {
		justifyContent: 'center',
		alignItems: 'center',

		width: '70%',
		height: '12%',

		padding: '2%',

		backgroundColor: '#fff',

		borderRadius: 25,
		borderColor: '#ff0000',
		borderWidth: 2
	},

	errorMsg: {
		color: '#ff2020',

		fontSize: 18,
		fontWeight: 'bold',

		textAlign: 'center'
	},

	bottomContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',

		width: '70%',
		height: '14%',
		backgroundColor: '#000',

		padding: '2%',

		borderRadius: 25
	},

	spotifyLogoContainer: {
		width: '21%',
		height: '80%'

	},

	spotifyLogo: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain'
	},

	buttonText: {
		color: '#fff',

		fontSize: 18
	},

	swipeUpContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',

		paddingBottom: 32
	},

	swipeUpText: {
		fontSize: 14
	}
})

export default SpotifyLoginPage
