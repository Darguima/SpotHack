import React from 'react'
import { Text, StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native'

import Header from './components/Header'
import PlaylistsToUpdate from './components/PlaylistsToUpdate'

import useDownloadsInfo from '../../../contexts/downloadsInfo'

const PlaylistsChangesPage:React.FC = () => {
	const { playlistsChanges, playlistsChecked } = useDownloadsInfo()

	return (
		<ScrollView
			style={styles.scrollView}
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<Header />

			{!playlistsChecked &&
				<View style={styles.waitingForThePlaylistsScanContainer}>
					<View style={styles.infoTextContainer}>
						<Text style={styles.infoText}>
						We are checking your playlists.
						</Text>
						<Text style={styles.infoText}>
						Wait a moment please!
						</Text>

						<Text style={styles.subInfoText}>
							If the check is taking too long time, try restarting the app.
							{'\n'}
							But maybe it{"'"}s normal if you have a lot of music downloaded.
						</Text>
					</View>

					<View style={styles.waitingForThePlaylistsScanActivityIndicatorContainer}>
						<ActivityIndicator size="large" color="#1c5ed6"/>
					</View>
				</View>
			}

			{playlistsChanges.length === 0 && playlistsChecked &&
			<View style={styles.infoTextContainer}>
				<Text style={styles.infoText}>
					Awesome!!!
				</Text>
				<Text style={styles.infoText}>
					All playlists are up to date.
				</Text>
			</View>
			}

			{playlistsChanges.length > 0 && playlistsChecked &&
				<PlaylistsToUpdate />
			}

		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,

		backgroundColor: '#000'
	},

	waitingForThePlaylistsScanContainer: {
		flex: 1
	},

	infoTextContainer: {
		justifyContent: 'space-evenly',
		height: '25%'

	},

	infoText: {
		color: '#fff',
		fontSize: 18,
		textAlign: 'center'
	},

	subInfoText: {
		color: '#fff',
		fontSize: 12,
		textAlign: 'center'
	},

	waitingForThePlaylistsScanActivityIndicatorContainer: {
		flex: 1,
		justifyContent: 'center'
	}
})

export default PlaylistsChangesPage
