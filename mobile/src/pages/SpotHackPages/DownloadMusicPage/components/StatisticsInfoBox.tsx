import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { statisticsSchema } from '../../../../SpotHack_Core/DownloadMachine'

interface StatisticsInfoBoxProps {
	downloadStatistics: statisticsSchema
}

const StatisticsInfoBox:React.FC<StatisticsInfoBoxProps> = ({ downloadStatistics }) => {
	return (
		<View
			style={styles.container}
		>
			<Text>musics on queue: {downloadStatistics.queueLength}</Text>

			<Text>{'\n'}youtube Ids: {downloadStatistics.musicsWithYoutubeId}</Text>
			<Text>youtube Ids Sources:</Text>
			<View style={styles.objectContainer}>
				{Object.keys(downloadStatistics.youtubeIdsSources).map(key => {
					const value = downloadStatistics.youtubeIdsSources[key]

					return (
						<Text key={key} >
							{key} - {value}
						</Text>
					)
				})}
			</View>

			<Text>{'\n'}download urls: {downloadStatistics.musicsWithDownloadUrl}</Text>

			<Text>{'\n'}downloaded videos: {downloadStatistics.downloadedMusicVideos}</Text>
			<Text>converted videos: {downloadStatistics.convertedVideos}</Text>

			<Text>{'\n'}number of not errors: {downloadStatistics.queueLength - downloadStatistics.errors.length}</Text>
			<Text>number of errors: {downloadStatistics.errors.length}</Text>
			<Text>errors:</Text>
			<View style={styles.objectContainer}>
				{downloadStatistics.errors.map(youtubeQuery => (
					<Text key={youtubeQuery} >
						{youtubeQuery}
					</Text>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#555',
		marginVertical: 20
	},

	objectContainer: {
		paddingLeft: '5%',
		backgroundColor: '#333'
	}
})

export default StatisticsInfoBox
