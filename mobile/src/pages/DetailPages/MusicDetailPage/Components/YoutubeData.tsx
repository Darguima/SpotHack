import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Linking, ToastAndroid } from 'react-native'

import ContentBox from '../../../Components/ContentBox'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import getYoutubeInfo, { getYoutubeUrlReturn } from '../../../../SpotHack_Core/GetYoutubeUrl'
import downloadMachine from '../../../../SpotHack_Core/DownloadMachine'

interface YoutubeDataProps {
  spotifyId: string
  title: string,
  artists: string
}

const YoutubeData:React.FC<YoutubeDataProps> = ({ spotifyId, title, artists }) => {
	const [youtubeInfo, setYoutubeInfo] = useState({ youtubeUrl: 'Loading ...' } as getYoutubeUrlReturn)

	useEffect(() => {
		(async () => {
			const youtubeInfo = await getYoutubeInfo(spotifyId, title, artists)
			if (youtubeInfo.success === 1) {
				setYoutubeInfo(youtubeInfo)
			} else {
				setYoutubeInfo({ ...youtubeInfo, youtubeUrl: 'Error getting Youtube Url', success: 0 } as getYoutubeUrlReturn)
			}
		})()
	}, [])

	return (
		<ContentBox
			title="Youtube"

			buttonText="Download"
			buttonIcon={<MaterialCommunityIcons name="download" style={styles.downloadIcon} size={17}/>}
			buttonStyle={{ width: '45%' }}
			buttonOnPress={() => {
				downloadMachine.addMusicsToDownloadQueue([{
					spotifyId: spotifyId,
					youtubeId: youtubeInfo.youtubeId,

					playlistName: 'SpotHack_Music',
					playlistId: '0',
					youtubeQuery: youtubeInfo.youtubeQuery
				}])
				ToastAndroid.show('Downloading Music', ToastAndroid.LONG)
			}}
		>
			<View style={styles.youtubeUrlContainer}>
				<Text style={styles.youtubeUrlTitleText}>Youtube Url:</Text>
				<Text
					style={styles.youtubeUrlText}
					numberOfLines={1}
					onPress={() => {
						if (youtubeInfo.youtubeUrl !== 'Loading ...' && youtubeInfo.youtubeUrl !== 'Error getting Youtube Url') {
							Linking.openURL(youtubeInfo.youtubeUrl)
						}
					}}
				>
					{youtubeInfo.youtubeUrl}
				</Text>
			</View>
		</ContentBox>
	)
}

const styles = StyleSheet.create({
	youtubeUrlContainer: {
	},

	youtubeUrlTitleText: {
		color: '#fff',

		fontSize: 18
	},

	youtubeUrlText: {
		color: '#1c5ed6',

		marginTop: 6,

		fontSize: 16
	},

	downloadIcon: {
		color: '#1c5ed6',
		marginLeft: '5%'
	}
})

export default YoutubeData
