import React, { useEffect, useState, useCallback } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import downloadMachine, { queueChangesListenerFunction, urlsSourcesCountSchema } from '../../../SpotHack_Core/DownloadMachine'

const DownloadMusicPage:React.FC<StackScreenProps<any>> = ({ navigation }) => {
	const [urlsSourcesCount, setUrlsSourcesCount] = useState({ totalRequests: 0, counts: {} } as urlsSourcesCountSchema)
	let queueChangesListenerIdentifier: number | undefined

	const onQueueChange: queueChangesListenerFunction = (index, newMusicInfo, prevMusicInfo, name) => {
		console.log(`Updated - ${newMusicInfo.youtubeQuery}`)
		refreshDownloadMachineInfo()
	}

	const refreshDownloadMachineInfo = () => {
		try {
			const urlsSourcesCountReturn = downloadMachine.getUrlsSourcesCount()
			setUrlsSourcesCount(urlsSourcesCountReturn)
		} catch (err) {
			setUrlsSourcesCount({ totalRequests: 0, counts: { 'Unknown error': 1 } })
		}
	}

	const onFocus = useCallback(() => {
		refreshDownloadMachineInfo()
		if (queueChangesListenerIdentifier === undefined) {
			const identifier = downloadMachine.addQueueChangesListener(onQueueChange)

			queueChangesListenerIdentifier = identifier
		} else {
			downloadMachine.changeQueueChangesListener(queueChangesListenerIdentifier, onQueueChange)
		}
	}, [])

	const onBlur = useCallback(() => {
		if (queueChangesListenerIdentifier !== undefined) {
			downloadMachine.changeQueueChangesListener(queueChangesListenerIdentifier, () => {})
		}
	}, [queueChangesListenerIdentifier])

	useEffect(() => {
		navigation.addListener('focus', onFocus)
		navigation.addListener('blur', onBlur)
	}, [])

	return (
		<View style={styles.container}>
			<View
				style={styles.urlsSourcesCountContainer}
			>
				<Text>totalRequests: {urlsSourcesCount.totalRequests}</Text>

				{Object.keys(urlsSourcesCount.counts).map(key => {
					const value = urlsSourcesCount.counts[key]

					return (
						<Text
							key={key}
						>
							{key} - {value}
						</Text>
					)
				})}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-evenly',
		alignItems: 'center',

		backgroundColor: '#000'
	},

	urlsSourcesCountContainer: {
		backgroundColor: '#333',
		marginVertical: 20
	}
})

export default DownloadMusicPage
