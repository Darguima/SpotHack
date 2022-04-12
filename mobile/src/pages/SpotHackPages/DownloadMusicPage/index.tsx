import React, { useEffect, useState, useCallback } from 'react'
import { Text, View, StyleSheet, FlatList, ActivityIndicator, AppState } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import downloadMachine, { queueSchema, defaultStatistics, musicOnQueueSchema, playlistsOnQueueSchema } from '../../../SpotHack_Core/DownloadMachine'
import StatisticsInfoBox from './components/StatisticsInfoBox'
import DownloadProgressView from './components/DownloadProgressView'
import Filters from './components/Filters'

import useSpotHackSettings from '../../../contexts/spotHackSettings'

const DownloadMusicPage:React.FC<StackScreenProps<any>> = ({ navigation }) => {
	const [flatListEndReached, setFlatListEndReached] = useState(false)

	// Filters
	const { spotHackSettings: { downloadsPage: { showAlreadyDownloadedMusics }, slowRender } } = useSpotHackSettings()
	const [playlistIdToFilter, setPlaylistIdToFilter] = useState('all')

	const [downloadsStatus, setDownloadsStatus] = useState([] as queueSchema)
	const [playlistsOnQueue, setPlaylistsOnQueue] = useState([] as playlistsOnQueueSchema)
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
			setPlaylistsOnQueue(downloadsStatusReturn.playlistsOnQueue)
			setDownloadStatistics(downloadsStatusReturn.statistics)
		} catch (err) {
			setErrorMessage(JSON.stringify(err))
			setDownloadsStatus([])
			setPlaylistsOnQueue([])
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
		AppState.addEventListener('focus', onFocus)
		AppState.addEventListener('blur', onBlur)

		return () => {
			navigation.removeListener('focus', onFocus)
			navigation.removeListener('blur', onBlur)
			AppState.removeEventListener('focus', onFocus)
			AppState.removeEventListener('blur', onBlur)
		}
	}, [])

	const renderDownloadProgressView = ({ item, index }: {item: musicOnQueueSchema, index: number}) => (
		<DownloadProgressView
			musicInfo={item}
			style={{
				marginTop: index === 0 ? 0 : '2%',
				marginBottom: index === downloadsStatus.length - 1 ? 0 : '2%'
			}}
		/>
	)

	const keyExtractor = (item: musicOnQueueSchema) => item.queueIndex.toString()

	// Filtering Musics
	const getFilteredData = (data: musicOnQueueSchema[]) => data.filter(music => {
		if (
			(!showAlreadyDownloadedMusics && music.stage === 'alreadyDownloaded')	||
				(playlistIdToFilter !== 'all' && music.playlistId !== playlistIdToFilter)
		) return false
		else return true
	})

	return (
		<View style={styles.container}>
			{errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

			{!errorMessage &&

				<FlatList
					style={{ width: '100%' }}

					ListHeaderComponent={
						<>
							<StatisticsInfoBox downloadStatistics={downloadStatistics}/>
							<Filters
								playlistsOnQueue={playlistsOnQueue}
								setPlaylistIdToFilter={setPlaylistIdToFilter}
								playlistIdToFilter={playlistIdToFilter}
							/>

						</>
					}
					ListFooterComponent={(flatListEndReached || downloadStatistics.queueLength - downloadStatistics.alreadyDownloadedMusics === 0)
						? <Text style={styles.noMoreMusicsText}>No More Musics</Text>
						: <ActivityIndicator color={'#1c5ed6'} size={'large'}/>
					}

					data={getFilteredData(downloadsStatus)}
					renderItem={renderDownloadProgressView}
					keyExtractor={keyExtractor}

					onScrollBeginDrag={() => { setFlatListEndReached(false) }}
					onEndReached={() => { setFlatListEndReached(true) }}
					onEndReachedThreshold={0.4}

					// Performance settings
					removeClippedSubviews={slowRender ? true : undefined} // Unmount components when outside of window
					initialNumToRender={slowRender ? 6 : undefined} // Reduce initial render amount
					maxToRenderPerBatch={slowRender ? 1 : undefined} // Reduce number in each render batch
					updateCellsBatchingPeriod={slowRender ? 100 : undefined} // Increase time between renders
					windowSize={slowRender ? 7 : undefined} // Reduce the window size

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
	},

	noMoreMusicsText: {
		width: '100%',
		color: '#fff',
		textAlign: 'center',
		marginVertical: '3%'
	}
})

export default DownloadMusicPage
