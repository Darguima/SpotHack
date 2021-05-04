import React, { useEffect, useState, useCallback } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import downloadMachine, { queueSchema, defaultStatistics } from '../../../SpotHack_Core/DownloadMachine'
import MusicDownloadStatusBox from './components/MusicDownloadStatusBox'
import StatisticsInfoBox from './components/StatisticsInfoBox'

const DownloadMusicPage:React.FC<StackScreenProps<any>> = ({ navigation }) => {
	const [downloadsStatus, setDownloadsStatus] = useState([] as queueSchema)
	const [downloadStatistics, setDownloadStatistics] = useState(defaultStatistics)
	const [errorMessage, setErrorMessage] = useState<string | null>('Wait a moment')
	let queueChangesListenerIdentifier: number | undefined

	const refreshDownloadMachineInfo = () => {
		try {
			const downloadsStatusReturn = downloadMachine.getDownloadsStatus()

			if (downloadsStatusReturn.musicsStatus.length === 0) {
				setErrorMessage('No downloads at the moment')
			} else {
				setErrorMessage(null)
			}
			setDownloadsStatus(downloadsStatusReturn.musicsStatus)
			setDownloadStatistics(downloadsStatusReturn.statistics)
		} catch (err) {
			setErrorMessage(JSON.stringify(err))
			setDownloadStatistics(defaultStatistics)
		}
	}

	const onFocus = useCallback(() => {
		refreshDownloadMachineInfo()
		if (queueChangesListenerIdentifier === undefined) {
			const identifier = downloadMachine.addQueueChangesListener(refreshDownloadMachineInfo)

			queueChangesListenerIdentifier = identifier
		} else {
			downloadMachine.changeQueueChangesListener(queueChangesListenerIdentifier, refreshDownloadMachineInfo)
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
			{errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

			{!errorMessage &&

				<FlatList
					style={{ width: '100%' }}

					ListHeaderComponent={<StatisticsInfoBox downloadStatistics={downloadStatistics}/>}

					data={downloadsStatus}
					renderItem={({ item }) => <MusicDownloadStatusBox item={item}/>}
					keyExtractor={item => item.queueIndex.toString()}
				/>
			}
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

	errorMessage: {
		color: '#fff'
	}
})

export default DownloadMusicPage
