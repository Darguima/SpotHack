import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import downloadMachine, { queueSchema, musicOnQueueSchema, urlsSourcesCountSchema } from '../../../SpotHack_Core/DownloadMachine'

const DownloadMusicPage:React.FC = () => {
	const [downloadsStatus, setDownloadsStatus] = useState([] as queueSchema)
	const [urlsSourcesCount, setUrlsSourcesCount] = useState({ totalRequests: 0, counts: {} } as urlsSourcesCountSchema)
	const [errorMessage, setErrorMessage] = useState<string | null>('Wait a moment')

	useEffect(() => {
		const getDownloadsStatus = setInterval(() => {
			try {
				const downloadsStatusReturn = downloadMachine.getDownloadsStatus()

				if (downloadsStatusReturn.length === 0) {
					setErrorMessage('No downloads at the moment')
				} else {
					setErrorMessage(null)
				}
				setDownloadsStatus(downloadsStatusReturn)
			} catch (err) {
				setErrorMessage(JSON.stringify(err))
			}
		}, 500)

		const getUrlsSourcesCount = setInterval(() => {
			try {
				const urlsSourcesCountReturn = downloadMachine.getUrlsSourcesCount()

				setUrlsSourcesCount(urlsSourcesCountReturn)
			} catch (err) {
				setUrlsSourcesCount({ totalRequests: 0, counts: {} })
			}
		}, 3000)

		return () => {
			clearInterval(getDownloadsStatus)
			clearInterval(getUrlsSourcesCount)
		}
	}, [])

	const renderHeader = () => {
		return (
			<View
				style={{
					backgroundColor: '#333',
					marginVertical: 20
				}}
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
		)
	}

	const renderMusicDownloadStatusBox = ({ item }: {item: musicOnQueueSchema}) => {
		return (
			<View
				style={{
					backgroundColor: '#555',
					marginVertical: 20
				}}
			>
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

	return (
		<View style={styles.container}>
			{errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

			{!errorMessage &&
			<FlatList
				style={{ width: '100%' }}

				ListHeaderComponent={renderHeader}

				data={downloadsStatus}
				renderItem={renderMusicDownloadStatusBox}
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
