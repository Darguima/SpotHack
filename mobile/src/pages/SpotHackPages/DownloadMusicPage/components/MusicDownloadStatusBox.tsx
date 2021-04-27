import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { musicOnQueueSchema } from '../../../../SpotHack_Core/DownloadMachine'

interface MusicDownloadStatusBoxProps {
	item: musicOnQueueSchema
}

const MusicDownloadStatusBox:React.FC<MusicDownloadStatusBoxProps> = ({ item }) => {
	return (
		<View style={styles.container}>
			{
				Object.keys(item).map(key => {
					const value = item[key]

					return (
						<Text
							key={key + value}
							style={key === 'youtubeQuery' ? { fontWeight: 'bold', color: '#333' } : {}}
						>
							{key} - {value}
						</Text>
					)
				})
			}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#555',
		marginVertical: 20
	}
})

export default React.memo(
	MusicDownloadStatusBox,
	(prevProps, nextProps) => {
		if (nextProps.item.progress !== prevProps.item.progress) return false
		else return true
	}
)
