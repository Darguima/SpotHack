import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ImageSourcePropType, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

import Description from './Components/Description'
import PlaylistOptions from './Components/PlaylistOptions'
import PlaylistData from './Components/PlaylistData'

import Entypo from 'react-native-vector-icons/Entypo'

import spotifyApi from '../../../services/spotify/spotifyApi'
import { useNavigation } from '@react-navigation/native'

interface PlaylistDetailPageProps {
  route: {
    params: {
      spotifyId: string,

      image?: ImageSourcePropType,

      name?: string,
      owner?: string
    }
  }
}

const PlaylistDetailPage:React.FC<PlaylistDetailPageProps> = ({
	route: {
		params:
  { spotifyId, image = require('../../../assets/graySquare.jpg'), name = 'Playlist', owner = 'Owner' }
	}
}) => {
	const [playlistInfo, setPlaylistInfo] = useState({
		spotifyId,
		image,
		name,
		owner,

		description: '',

		totalTracks: 0,
		followers: 0,
		isPublic: false,
		collaborative: false,

		tracks: [] as Array<SpotifyApi.PlaylistTrackObject>
	})

	const { goBack } = useNavigation()

	useEffect(() => {
		(async () => {
			const response: SpotifyApi.PlaylistObjectFull = (await spotifyApi.get(`playlists/${spotifyId}`)).data

			const newPlaylistInfo = {
				spotifyId,

				image: response.images.length > 0
					? { uri: response.images[0].url }
					: require('../../../assets/graySquare.jpg'),

				name: response.name,
				owner: response.owner.display_name || 'Owner',

				description: response.description || '',

				totalTracks: response.tracks.items.length,
				followers: response.followers.total,
				isPublic: response.public || true,
				collaborative: response.collaborative,

				tracks: response.tracks.items
			}

			setPlaylistInfo(newPlaylistInfo)
		})()
	}, [])

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollViewContentContainerStyle}>

				<View style={styles.header}>
					<TouchableOpacity style={styles.goBackIconContainer} onPress={goBack}>
						<Entypo name="chevron-left" style={styles.goBackIcon} size={30}/>
					</TouchableOpacity>
				</View>

				<View style={styles.mainImageContainer}>
					<Image source={playlistInfo.image} style={styles.mainImage} />
				</View>

				<View style={styles.playlistNameOwnerContainer}>
					<Text style={styles.playlistNameText}>{playlistInfo.name}</Text>
					<Text style={styles.playlistOwnerText}>{playlistInfo.owner}</Text>
				</View>

				<Description
					description={playlistInfo.description}
				/>

				<PlaylistOptions
					musicsArray={playlistInfo.tracks}
					playlistName={playlistInfo.name}
					playlistId={playlistInfo.spotifyId}
				/>

				<PlaylistData
					totalTracks={playlistInfo.totalTracks}
					followers={playlistInfo.followers}
					isPublic={playlistInfo.isPublic}
					collaborative={playlistInfo.collaborative}
				/>

			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,

		backgroundColor: '#000'
	},

	header: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',

		width: '100%',
		height: 60,

		backgroundColor: '#1c5ed6'
	},

	goBackIconContainer: {
		justifyContent: 'center',
		alignItems: 'center',

		height: '100%',
		aspectRatio: 1
	},

	goBackIcon: {

		color: '#fff'
	},

	scrollViewContentContainerStyle: {
		flexGrow: 1,
		alignItems: 'center'
	},

	mainImageContainer: {
		width: '50%',
		aspectRatio: 1,

		marginTop: 50
	},

	mainImage: {
		width: '100%',
		height: '100%'
	},

	playlistNameOwnerContainer: {
		alignItems: 'center',

		width: '80%',
		marginTop: '15%'
	},

	playlistNameText: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 25,

		marginBottom: '4%'
	},

	playlistOwnerText: {
		color: '#aaa',
		textAlign: 'center',
		fontSize: 20
	}
})

export default PlaylistDetailPage
