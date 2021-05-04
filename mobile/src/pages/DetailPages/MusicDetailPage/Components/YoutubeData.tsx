import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Linking, ToastAndroid } from 'react-native'

import ContentBox from '../../../Components/ContentBox'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'

import getYoutubeInfo, { getYoutubeUrlReturn } from '../../../../SpotHack_Core/GetYoutubeUrl'
import downloadMachine from '../../../../SpotHack_Core/DownloadMachine'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { youtubeBaseUrl } from '../../../../services/youtubeApi'

interface YoutubeDataProps {
	spotifyId: string
	title: string,
	artists: string
	thumbnail: string
	albumName: string
}

const statusIcons: {[key: string]: React.ReactNode} = {
	loading: <MaterialCommunityIcons name="clock-time-three-outline" size={17} color="#aaa" />,
	asyncStorage: <MaterialCommunityIcons name="safe" size={20} color="green" />,
	firebase: <MaterialCommunityIcons name="firebase" size={17} color="yellow" />,
	ytScrape: <MaterialCommunityIcons name="web" size={18} color="blue" />,
	ytApi: <MaterialCommunityIcons name="youtube" size={17} color="red" />,
	error: <Entypo name="cross" size={20} color="red" />
}

const YoutubeData: React.FC<YoutubeDataProps> = ({ spotifyId, title, artists, thumbnail, albumName }) => {
	const [youtubeInfo, setYoutubeInfo] = useState({ success: 0 } as getYoutubeUrlReturn)
	const [ytFirstVideoOnSearch, setYtFirstVideoOnSearch] = useState({ url: 'Loading ...', id: '' })
	const [ytLyricsVideo, setYtLyricsVideo] = useState({ url: 'Loading ...', id: '' })

	useEffect(() => {
		(async () => {
			const youtubeInfo = await getYoutubeInfo(spotifyId, title, artists)
			setYoutubeInfo(youtubeInfo)

			if (youtubeInfo.success === 1) {
				setYtFirstVideoOnSearch({
					url: youtubeBaseUrl + youtubeInfo.youtubeId.ytFirstVideoOnSearch,
					id: youtubeInfo.youtubeId.ytFirstVideoOnSearch
				})

				setYtLyricsVideo({
					url: youtubeBaseUrl + youtubeInfo.youtubeId.ytLyricsVideo,
					id: youtubeInfo.youtubeId.ytLyricsVideo
				})
			} else {
				setYtFirstVideoOnSearch({
					url: 'Error getting Youtube Url',
					id: ''
				})

				setYtLyricsVideo({
					url: 'Error getting Youtube Url',
					id: ''
				})
			}
		})()
	}, [])

	const onDownloadButtonPress = (youtubeId: string, youtubeQuery: string, downloadSource: string) => {
		downloadMachine.addMusicsToDownloadQueue([{
			spotifyId: spotifyId,
			youtubeId: youtubeId,

			musicName: title,
			artists: artists,
			thumbnail: thumbnail,
			albumName: albumName,

			playlistName: 'SpotHack_Music',
			playlistId: '0',
			youtubeQuery: youtubeQuery,

			downloadSource: downloadSource
		}])
		ToastAndroid.show('Downloading Music', ToastAndroid.LONG)
	}

	return (
		<ContentBox
			title={'Youtube'}
			titleIcon={statusIcons[youtubeInfo.infoSourceIcon]}
		>
			<View style={[styles.downloadOption, { borderBottomWidth: 0 }]}>
				<Text style={styles.youtubeUrlTitleText}>Youtube - First Video on Search</Text>
				<Text
					style={styles.youtubeUrlText}
					numberOfLines={1}
					onPress={() => {
						if (youtubeInfo.success !== 0) {
							Linking.openURL(ytFirstVideoOnSearch.url)
						}
					}}
				>
					{ytFirstVideoOnSearch.url}
				</Text>
				<View style={styles.downloadButtonContainer}>
					<TouchableOpacity
						style={styles.downloadButton}
						activeOpacity={0.6}
						onPress={() => {
							onDownloadButtonPress(
								youtubeInfo.youtubeId.ytFirstVideoOnSearch,
								youtubeInfo.youtubeQuery,
								'ytFirstVideoOnSearch'
							)
						}}
					>
						<Text style={styles.downloadText}>Download</Text>

						<MaterialCommunityIcons name="download" style={styles.downloadIcon} size={17}/>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.downloadOption}>
				<Text style={styles.youtubeUrlTitleText}>Youtube - Lyrics Video</Text>
				<Text
					style={styles.youtubeUrlText}
					numberOfLines={1}
					onPress={() => {
						if (youtubeInfo.success !== 0) {
							Linking.openURL(ytLyricsVideo.url)
						}
					}}
				>
					{ytLyricsVideo.url}
				</Text>
				<View style={styles.downloadButtonContainer}>
					<TouchableOpacity
						style={styles.downloadButton}
						activeOpacity={0.6}
						onPress={() => {
							onDownloadButtonPress(
								youtubeInfo.youtubeId.ytLyricsVideo,
								youtubeInfo.youtubeQuery,
								'ytLyricsVideo'
							)
						}}
					>
						<Text style={styles.downloadText}>Download</Text>

						<MaterialCommunityIcons name="download" style={styles.downloadIcon} size={17}/>
					</TouchableOpacity>
				</View>
			</View>
		</ContentBox>
	)
}

const styles = StyleSheet.create({

	downloadOption: {
		justifyContent: 'center',
		alignItems: 'center',

		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#333',

		paddingVertical: '7%'
	},

	youtubeUrlTitleText: {
		width: '100%',
		color: '#fff',

		fontSize: 17
	},

	youtubeUrlText: {
		color: '#1c5ed6',

		marginTop: 6,

		fontSize: 16
	},

	downloadButtonContainer: {
		width: '80%',
		marginTop: '7%',

		borderColor: '#1c5ed6',
		borderWidth: 1,
		borderRadius: 10
	},

	downloadButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',

		width: '100%',

		marginVertical: '5%'

	},

	downloadText: {
		color: '#1c5ed6',

		fontSize: 16
	},

	downloadIcon: {
		color: '#1c5ed6',
		marginLeft: '5%'
	}
})

export default YoutubeData
