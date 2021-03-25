import React from 'react'
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import ContentBox from '../../../Components/ContentBox'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import downloadMachine, { musicForQueueSchema } from '../../../../SpotHack_Core/DownloadMachine'
import createYoutubeQuery from '../../../../utils/createYoutubeQuery'
import convertArtistsArrayToString from '../../../../utils/convertArtistsArrayToString'

interface PlaylistOptionsProps {
  musicsArray: Array<SpotifyApi.PlaylistTrackObject>,
  playlistName: string,
	playlistId: string
}

const PlaylistOptions:React.FC<PlaylistOptionsProps> = ({ musicsArray, playlistName, playlistId }) => {
	const { navigate } = useNavigation()

	return (
		<ContentBox
			title="Playlist Options"

			contentStyle={{
				marginTop: 0,
				flexDirection: 'row',
				justifyContent: 'space-between'
			}}
		>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					activeOpacity={0.6}
					onPress={() => { navigate('FlatListMusics', { musicsArray: musicsArray }) }}
				>
					<Text style={styles.buttonText}>Songs</Text>
					<MaterialCommunityIcons name="playlist-music" style={styles.downloadIcon} size={17}/>

				</TouchableOpacity>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					activeOpacity={0.6}
					onPress={() => {
						const playlistInfo = musicsArray.map(item => {
							return ({
								spotifyId: item.track.id,
								youtubeId: '',

								playlistName: playlistName,
								playlistId: playlistId,
								youtubeQuery: createYoutubeQuery(convertArtistsArrayToString(item.track.artists), item.track.name)
							})
						}) as Array<musicForQueueSchema>

						downloadMachine.addMusicsToDownloadQueue(playlistInfo)
						ToastAndroid.show('Downloading Playlist', ToastAndroid.LONG)
					}}
				>
					<Text style={styles.buttonText}>Download</Text>
					<MaterialCommunityIcons name="download" style={styles.downloadIcon} size={17}/>

				</TouchableOpacity>
			</View>
		</ContentBox>
	)
}

const styles = StyleSheet.create({
	buttonContainer: {
		width: '45%',
		marginTop: '10%',

		borderColor: '#1c5ed6',
		borderWidth: 1,
		borderRadius: 10
	},

	button: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',

		width: '100%',

		marginVertical: '10%'

	},

	buttonText: {
		textAlign: 'center',
		color: '#1c5ed6',
		fontSize: 17,
		fontWeight: 'bold'
	},

	downloadIcon: {
		color: '#1c5ed6',
		marginLeft: '5%'
	}
})

export default PlaylistOptions
