import React from 'react'

import { Text, StyleSheet, View } from 'react-native'

import useDownloadsInfo from '../../../../contexts/downloadsInfo'
import ContentBox from '../../../Components/ContentBox'

const PlaylistsChanges: React.FC = () => {
	const { playlistsChanges, playlistsChecked } = useDownloadsInfo()

	const playlistsNames = playlistsChanges.length > 0
		?	playlistsChanges.map(playlist => playlist.playlistName)
		:	[]

	const numberOfMusicsToDownload = playlistsChanges.length > 0
		?	playlistsChanges
			.map(playlist => playlist.added.length)
			.reduce((prev, current) => { return current + prev })
		:	0

	const numberOfMusicsToDelete = playlistsChanges.length > 0
		?	playlistsChanges
			.map(playlist => playlist.removed.length)
			.reduce((prev, current) => { return current + prev })
		:	0

	return (
		<ContentBox
			style={styles.contentBox}
			contentStyle={styles.contentBoxContentStyle}

			title={
				<Text style={styles.title}>
					{!playlistsChecked &&
					<Text style={styles.title}>
						Checking your playlists!
					</Text>
					}
					{playlistsChecked &&
					<Text style={styles.title}>
						<Text style={styles.titlePlaylistsNumber}>
							{playlistsChanges.length}
						</Text> Outdated Playlist{playlistsChanges.length !== 1 ? 's' : ''}
					</Text>
					}

				</Text>
			}
		>

			{!playlistsChecked &&
						<>
							<Text style={styles.waitingForThePlaylistsScan}>
								We are checking your playlists.
								{'\n'}
								Wait a moment please!
							</Text>
						</>
			}

			{playlistsChanges.length === 0 && playlistsChecked &&
						<>
							<Text style={styles.noMusicsToDownloadText}>
								Awesome!!!
								{'\n'}
								All playlists are up to date
							</Text>
						</>
			}

			{playlistsChanges.length > 0 && playlistsChecked &&
						<>
							<Text numberOfLines={2} style={styles.whiteText}>
								<Text style={styles.highlightedText}>
								Outdated Playlist{playlistsChanges.length !== 1 ? 's' : ''}:
								</Text> {playlistsNames.join(', ')}
							</Text>

							<View>
								{numberOfMusicsToDownload !== 0 &&
									<Text style={styles.whiteText}>
										You have {' '}
										<Text style={styles.highlightedText}>
											{numberOfMusicsToDownload} music{numberOfMusicsToDownload === 1 ? '' : 's'}
										</Text>
										{' '} to download.
									</Text>
								}

								{numberOfMusicsToDelete !== 0 &&
									<Text style={styles.whiteText}>
									You have {' '}
										<Text style={styles.highlightedText}>
											{numberOfMusicsToDelete} music{numberOfMusicsToDelete === 1 ? '' : 's'}
										</Text>
										{' '} to delete.
									</Text>
								}
							</View>

							<Text style={styles.clickForMoreInfoText}>
								What you need to do?
								{'\n'}
								Click on me
							</Text>
						</>
			}
		</ContentBox>
	)
}

const styles = StyleSheet.create({
	contentBox: {
		width: '100%',
		height: '100%',
		marginVertical: 0,
		paddingBottom: 0
	},

	contentBoxContentStyle: {
		flex: 1,
		marginTop: 0,
		justifyContent: 'space-evenly'
	},

	title: {
		color: '#fff',
		fontSize: 19
	},

	titlePlaylistsNumber: {
		color: '#fff',
		fontSize: 26,
		fontWeight: 'bold'
	},

	waitingForThePlaylistsScan: {
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'center'
	},

	noMusicsToDownloadText: {
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'center'
	},

	whiteText: {
		color: '#fff'
	},

	highlightedText: {
		fontWeight: 'bold',
		textDecorationLine: 'underline',
		fontSize: 15
	},

	clickForMoreInfoText: {
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'center'
	}
})

export default PlaylistsChanges
