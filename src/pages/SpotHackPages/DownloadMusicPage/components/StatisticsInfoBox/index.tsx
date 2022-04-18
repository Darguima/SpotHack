import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

import AllStatistics from './AllStatistics'
import MainStatistics from './MainStatistics'

import useSpotHackSettings from '../../../../../contexts/spotHackSettings'

import { statisticsSchema } from '../../../../../SpotHack_Core/DownloadMachine'

interface StatisticsInfoBoxProps {
	downloadStatistics: statisticsSchema
}

const StatisticsInfoBox:React.FC<StatisticsInfoBoxProps> = ({ downloadStatistics: dlStatistics }) => {
	const { spotHackSettings: { downloadsPage: { showAlreadyDownloadedMusics } } } = useSpotHackSettings()
	const [showAllStatistics, setShowAllStatistics] = useState(false)

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => setShowAllStatistics(!showAllStatistics)}
		>
			{!showAllStatistics &&
			<MainStatistics
				downloadStatistics={dlStatistics}
				showAlreadyDownloadedMusics={showAlreadyDownloadedMusics}
			/>
			}

			{showAllStatistics &&
				<AllStatistics
					downloadStatistics={dlStatistics}
					showAlreadyDownloadedMusics={showAlreadyDownloadedMusics}
				/>
			}

			<View style={styles.showAllStatisticsTextContainer}>
				<Text style={styles.showAllStatisticsButtonText}>
					Click to
					{showAllStatistics ? ' Hide ' : ' Show More '}
					<Text style={{ fontWeight: 'bold', color: '#fff' }}>Statistics</Text>
				</Text>
			</View>

		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#212121'

	},

	showAllStatisticsTextContainer: {
		borderTopWidth: 1,
		borderTopColor: '#444',

		paddingVertical: '3%'
	},

	showAllStatisticsButtonText: {
		color: '#aaa',
		textAlign: 'center'
	}
})

export default React.memo(
	StatisticsInfoBox,
	(prevProps, nextProps) => {
		if (
			nextProps.downloadStatistics.alreadyDownloadedMusics !== prevProps.downloadStatistics.alreadyDownloadedMusics ||
			nextProps.downloadStatistics.convertedVideos !== prevProps.downloadStatistics.convertedVideos ||
			nextProps.downloadStatistics.downloadedMusicVideos !== prevProps.downloadStatistics.downloadedMusicVideos ||
			nextProps.downloadStatistics.downloadedMusics !== prevProps.downloadStatistics.downloadedMusics ||
			nextProps.downloadStatistics.errors.length !== prevProps.downloadStatistics.errors.length ||
			nextProps.downloadStatistics.musicsWithDownloadUrl !== prevProps.downloadStatistics.musicsWithDownloadUrl ||
			nextProps.downloadStatistics.musicsWithYoutubeId !== prevProps.downloadStatistics.musicsWithYoutubeId ||
			nextProps.downloadStatistics.queueLength !== prevProps.downloadStatistics.queueLength ||
			nextProps.downloadStatistics.youtubeIdsSources !== prevProps.downloadStatistics.youtubeIdsSources
		) return false
		else return true
	}
)
