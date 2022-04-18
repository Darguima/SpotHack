import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

import ContentBox from '../../../Components/ContentBox'

interface PlaylistDataProps {
	totalTracks: number,
	followers: number,
	isPublic: boolean,
	collaborative: boolean,
}

const PlaylistData:React.FC<PlaylistDataProps> = ({ totalTracks, followers, isPublic, collaborative }) => {
	return (
		<ContentBox title="Playlist Info">

			<View style={[styles.InfoContainer, { borderTopWidth: 0, paddingTop: 0 }]}>
				<Text style={styles.InfoTitleText}>Total Tracks:</Text>
				<Text style={styles.infoText}>
					{totalTracks}
				</Text>
			</View>

			<View style={styles.InfoContainer}>
				<Text style={styles.InfoTitleText}>Followers:</Text>
				<Text style={styles.infoText}>
					{followers}
				</Text>
			</View>

			<View style={styles.InfoContainer}>
				<Text style={styles.InfoTitleText}>Public:</Text>
				<Text style={styles.infoText}>
				{isPublic ? 'True' : 'False'}
				</Text>
			</View>

			<View style={styles.InfoContainer}>
				<Text style={styles.InfoTitleText}>Collaborative:</Text>
				<Text style={styles.infoText}>
					{collaborative ? 'True' : 'False'}
				</Text>
			</View>

		</ContentBox>
	)
}

const styles = StyleSheet.create({
	InfoContainer: {
		borderTopColor: '#aaa',
		borderTopWidth: 1,

		paddingVertical: '2%'
	},

	InfoTitleText: {
		color: '#fff',

		fontSize: 18
	},

	infoText: {
		color: '#aaa',

		marginTop: 6,

		fontSize: 16
	}
})

export default PlaylistData
