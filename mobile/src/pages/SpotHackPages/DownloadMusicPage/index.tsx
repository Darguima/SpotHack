import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import downloadMachine, { urlsSourcesCountSchema } from '../../../SpotHack_Core/DownloadMachine'

const DownloadMusicPage:React.FC = () => {
	const [urlsSourcesCount, setUrlsSourcesCount] = useState({ totalRequests: 0, counts: {} } as urlsSourcesCountSchema)

	useEffect(() => {
		const getUrlsSourcesCount = setInterval(() => {
			try {
				const urlsSourcesCountReturn = downloadMachine.getUrlsSourcesCount()

				setUrlsSourcesCount(urlsSourcesCountReturn)
			} catch (err) {
				setUrlsSourcesCount({ totalRequests: 0, counts: {} })
			}
		}, 3000)

		return () => {
			clearInterval(getUrlsSourcesCount)
		}
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
