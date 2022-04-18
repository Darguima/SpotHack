import React from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, ToastAndroid, Text } from 'react-native'
import { RouteProp, useNavigation } from '@react-navigation/native'

import MusicPlaylistView from '../../../Components/MusicPlaylistView'

import Entypo from 'react-native-vector-icons/Entypo'

import useDownloadsInfo from '../../../../contexts/downloadsInfo'

import { unlink as deleteFile } from 'react-native-fs'

import { removedMusicToPlaylistInfoSchema } from '../../../../SpotHack_Core/DownloadManager'

interface Props {
	route:
		RouteProp<
			{
				params: {
					playlistId: string,
				}
			},
			'params'
		>
}

const FlatListRemovedMusicsPage:React.FC<Props> = ({ route: { params: { playlistId } } }) => {
	const { navigate, goBack } = useNavigation()

	const { playlistsChangesObject, updatePlaylistsChanges } = useDownloadsInfo()

	const removedMusics = (playlistsChangesObject[playlistId] || { removed: [] }).removed

	const deleteMusic = async (musicPath: string, index: number) => {
		await deleteFile(musicPath)

		playlistsChangesObject[playlistId].removed.splice(index, 1)

		updatePlaylistsChanges(Object.keys(playlistsChangesObject)
			.map(playlistId => playlistsChangesObject[playlistId]))
	}

	const deleteAllMusics = async () => {
		await Promise.all(removedMusics.map(async music => (
			await deleteFile(music.path)
		)))

		playlistsChangesObject[playlistId].removed = []

		if (playlistsChangesObject[playlistId].added.length === 0 && playlistsChangesObject[playlistId].removed.length === 0) {
			delete playlistsChangesObject[playlistId]
		}

		updatePlaylistsChanges(Object.keys(playlistsChangesObject)
			.map(playlistId => playlistsChangesObject[playlistId]))
	}

	const renderItem = ({ item, index }: {item: removedMusicToPlaylistInfoSchema, index: number}) => (
		<MusicPlaylistView
			key={index}

			style={{
				marginTop: '2%',
				marginBottom: index === removedMusics.length - 1 ? '4%' : '2%'
			}}

			imageSource={item.thumbnail}
			title={item.musicName}
			artists={item.artists}

			viewPressAction={() => {
				if (item.spotifyId) {
					navigate('MusicDetailPage', {
						spotifyId: item.spotifyId,
						image: item.thumbnail,
						title: item.musicName,
						artists: item.artists
					})
				} else {
					ToastAndroid.show('Not a Spotify Music', ToastAndroid.SHORT)
				}
			}}

			entypoIconName="trash"
			iconSize={22}
			iconPressAction={() => deleteMusic(item.path, index)}
		/>
	)

	return (
		<View style={styles.container}>
			<FlatList
				ListHeaderComponent={
					<>
						<View style={styles.header}>
							<TouchableOpacity style={styles.goBackIconContainer} onPress={goBack}>
								<Entypo name="chevron-left" style={styles.goBackIcon} size={30}/>
							</TouchableOpacity>

							<Text style={styles.title}>
								{removedMusics.length} Removed Music{removedMusics.length !== 1 ? 's' : ''}
							</Text>
						</View>

						{removedMusics.length === 0 &&
							<Text style={styles.noMusicsText}>
								This playlist has no songs to delete
							</Text>
						}

						{removedMusics.length > 0 &&
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.button}
									onPress={deleteAllMusics}
								>
									<Entypo
										name={'trash'}
										style={styles.buttonIcon}
										size={20}
									/>

									<View style={styles.textContainer}>

										<Text style={styles.text} >
											Delete
										</Text>

										<Text style={styles.text} >
											{removedMusics.length} Music{removedMusics.length === 1 ? '' : 's'}
										</Text>

									</View>
								</TouchableOpacity>
							</View>
						}
					</>
				}

				style={{ width: '100%' }}

				data={removedMusics}
				renderItem={renderItem}
				keyExtractor={(_, index) => `${index}`}
			/>

		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		alignItems: 'center',

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

	title: {
		flex: 1,

		color: '#fff',
		fontSize: 19,

		textAlign: 'center'
	},

	noMusicsText: {
		color: '#fff',
		fontSize: 17,
		textAlign: 'center',

		marginTop: '5%'
	},

	buttonContainer: {
		alignItems: 'center',
		height: 75,

		backgroundColor: '#111',

		marginTop: '4%',
		marginBottom: '2%'
	},

	button: {
		justifyContent: 'space-evenly',
		alignItems: 'center',
		flexDirection: 'row',

		backgroundColor: '#212121',

		height: '100%',
		width: '50%'
	},

	buttonIcon: {
		color: '#fff'
	},

	textContainer: {
	},

	text: {
		color: '#fff',
		textAlign: 'center'
	}
})

export default FlatListRemovedMusicsPage
