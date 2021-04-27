import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { urlsSourcesCountSchema } from '../../../../SpotHack_Core/DownloadMachine'

interface ApiRequestsInfoBoxProps {
	urlsSourcesCount: urlsSourcesCountSchema
}

const ApiRequestsInfoBox:React.FC<ApiRequestsInfoBoxProps> = ({ urlsSourcesCount }) => {
	return (
		<View
			style={styles.container}
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

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#333',
		marginVertical: 20
	}
})

export default ApiRequestsInfoBox
