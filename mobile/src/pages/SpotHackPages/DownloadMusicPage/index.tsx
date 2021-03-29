import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import downloadMachine, { queueSchema, musicOnQueueSchema } from '../../../SpotHack_Core/DownloadMachine'

const DownloadMusicPage:React.FC = () => {
	const [downloadsStatus, setDownloadsStatus] = useState([] as queueSchema)
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
		return () => {
			clearInterval(getDownloadsStatus)
		}
	}, [])

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

				data={downloadsStatus}
				renderItem={renderMusicDownloadStatusBox}
				keyExtractor={item => item.queueNumber.toString()}
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
