import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Linking, ToastAndroid } from 'react-native'

import ContentBox from '../../../Components/ContentBox'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import getYoutubeInfo, { getYoutubeUrlReturn } from '../../../../SpotHack_Core/GetYoutubeUrl'
import downloadMachine from '../../../../SpotHack_Core/DownloadMachine'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface YoutubeDataProps {
	spotifyId: string
	title: string,
	artists: string
}

const YoutubeData:React.FC<YoutubeDataProps> = ({ spotifyId, title, artists }) => {
	const [youtube1stVideoOnSearchInfo, setYoutube1stVideoOnSearchInfo] = useState({ youtubeUrl: 'Loading ...' } as getYoutubeUrlReturn)
	const [youtubeLyricVideoInfo, setYoutubeLyricVideoInfo] = useState({ youtubeUrl: 'Loading ...' } as getYoutubeUrlReturn)

	useEffect(() => {
		(async () => {
			const youtube1stVideoOnSearchInfo = await getYoutubeInfo(spotifyId, title, artists, 'yt_firstVideoOnSearch')
			if (youtube1stVideoOnSearchInfo.success === 1) {
				setYoutube1stVideoOnSearchInfo(youtube1stVideoOnSearchInfo)
			} else {
				setYoutube1stVideoOnSearchInfo({ ...youtube1stVideoOnSearchInfo, youtubeUrl: 'Error getting Youtube Url', success: 0 } as getYoutubeUrlReturn)
			}
		})()
	}, [])

	useEffect(() => {
		(async () => {
			const youtubeLyricVideoInfo = await getYoutubeInfo(spotifyId, title, artists, 'yt_lyricVideo')
			if (youtubeLyricVideoInfo.success === 1) {
				setYoutubeLyricVideoInfo(youtubeLyricVideoInfo)
			} else {
				setYoutubeLyricVideoInfo({ ...youtubeLyricVideoInfo, youtubeUrl: 'Error getting Youtube Url', success: 0 } as getYoutubeUrlReturn)
			}
		})()
	}, [])

	const onDownloadButtonPress = (youtubeInfo: getYoutubeUrlReturn, downloadSource: string) => {
		downloadMachine.addMusicsToDownloadQueue([{
			spotifyId: spotifyId,
			youtubeId: youtubeInfo.youtubeId,

			playlistName: 'SpotHack_Music',
			playlistId: '0',
			youtubeQuery: youtubeInfo.youtubeQuery,

			downloadSource: downloadSource
		}])
		ToastAndroid.show('Downloading Music', ToastAndroid.LONG)
	}

	return (
		<ContentBox
			title="Youtube"
		>
			<View style={[styles.downloadOption, { borderBottomWidth: 0 }]}>
				<Text style={styles.youtubeUrlTitleText}>Youtube - First Video on Search</Text>
				<Text
					style={styles.youtubeUrlText}
					numberOfLines={1}
					onPress={() => {
						if (youtube1stVideoOnSearchInfo.youtubeUrl !== 'Loading ...' && youtube1stVideoOnSearchInfo.youtubeUrl !== 'Error getting Youtube Url') {
							Linking.openURL(youtube1stVideoOnSearchInfo.youtubeUrl)
						}
					}}
				>
					{youtube1stVideoOnSearchInfo.youtubeUrl}
				</Text>
				<View style={styles.downloadButtonContainer}>
					<TouchableOpacity
						style={styles.downloadButton}
						activeOpacity={0.6}
						onPress={() => { onDownloadButtonPress(youtube1stVideoOnSearchInfo, 'yt_firstVideoOnSearch') }}
					>
						<Text style={styles.downloadText}>Download</Text>

						<MaterialCommunityIcons name="download" style={styles.downloadIcon} size={17}/>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.downloadOption}>
				<Text style={styles.youtubeUrlTitleText}>Youtube - Lyric Video</Text>
				<Text
					style={styles.youtubeUrlText}
					numberOfLines={1}
					onPress={() => {
						if (youtubeLyricVideoInfo.youtubeUrl !== 'Loading ...' && youtubeLyricVideoInfo.youtubeUrl !== 'Error getting Youtube Url') {
							Linking.openURL(youtubeLyricVideoInfo.youtubeUrl)
						}
					}}
				>
					{youtubeLyricVideoInfo.youtubeUrl}
				</Text>
				<View style={styles.downloadButtonContainer}>
					<TouchableOpacity
						style={styles.downloadButton}
						activeOpacity={0.6}
						onPress={() => { onDownloadButtonPress(youtubeLyricVideoInfo, 'yt_lyricVideo') }}
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
