import React from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'

import { playlistInfoSchema } from '../pages/ReferencePlaylistPage'

import spotifyApi from '../../../../services/spotify/spotifyApi'

interface PlaylistIdInputProps {
	playlistId: string,
	setPlaylistId: React.Dispatch<React.SetStateAction<string>>,

	setPlaylistInfo: React.Dispatch<React.SetStateAction<playlistInfoSchema | undefined>>

	referenceStatus: 'editing id' | 'not founded' | 'founded' | 'referenced',
	setReferenceStatus: React.Dispatch<React.SetStateAction<'editing id' | 'not founded' | 'founded' | 'referenced'>>,
}

const PlaylistIdInput:React.FC<PlaylistIdInputProps> = ({
	playlistId, setPlaylistId,
	setPlaylistInfo,
	referenceStatus, setReferenceStatus
}) => {
	const searchPlaylistButtonPress = async () => {
		const response: SpotifyApi.PlaylistObjectFull = (await spotifyApi.get(`playlists/${playlistId}`)).data

		if (response) {
			setPlaylistInfo({
				coverImage: { uri: response.images[0].url },
				title: response.name,
				owner: response.owner.display_name || 'Owner'
			})
			setReferenceStatus('founded')
		} else {
			setPlaylistInfo(undefined)
			setReferenceStatus('not founded')
		}
	}

	return (
		<>
			<View style={styles.textContainer}>
				<Text style={styles.titleText}>Add a Playlist</Text>

				<Text style={styles.descriptionText}>
					Enter the Playlist Id - you can find it here on SpotHack on the Playlist Page
				</Text>
			</View>

			<View style={styles.inputContainer}>

				<Text style={styles.inputDescriptionText}>Playlist Id:</Text>

				<TextInput
					style={styles.input}
					value={playlistId}
					onChangeText={setPlaylistId}
					onChange={() => setReferenceStatus('editing id')}
				/>

				<View style={styles.searchButtonContainer}>
					<TouchableOpacity
						disabled={referenceStatus !== 'editing id' || playlistId === ''}
						onPress={searchPlaylistButtonPress}
						style={styles.buttons}
						activeOpacity={0.5}
					>
						<Text style={styles.buttonsText}>Search Playlist</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	textContainer: {
		marginBottom: 25
	},

	titleText: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 24,

		marginVertical: '5%'
	},

	descriptionText: {
		color: '#fff',
		fontSize: 17,
		textAlign: 'center',

		marginHorizontal: '3%'
	},

	inputContainer: {
		flex: 1,
		marginTop: '5%',
		alignItems: 'center'
	},

	inputDescriptionText: {
		color: '#fff',
		fontSize: 18,
		marginBottom: 16
	},

	input: {
		width: '80%',
		height: 48,
		borderRadius: 25,
		marginBottom: 16,

		backgroundColor: '#fff',

		textAlign: 'center'
	},

	searchButtonContainer: {
		width: '80%',
		height: 48,
		borderRadius: 25,

		marginBottom: '5%'
	},

	buttons: {
		justifyContent: 'center',
		alignItems: 'center',

		width: '100%',
		height: '100%',
		borderRadius: 25,

		backgroundColor: '#1c5ed6'
	},

	buttonsText: {
		color: '#fff',
		fontWeight: 'bold'
	}
})

export default PlaylistIdInput
