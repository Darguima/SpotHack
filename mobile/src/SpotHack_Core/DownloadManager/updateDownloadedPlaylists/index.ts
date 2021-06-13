import { DownloadManager } from '../index'

import { ToastAndroid } from 'react-native'

import updatePlaylistsNames from './updatePlaylistsNames'
import verifyFileTree from './verifyFileTree'

export default async function (this: DownloadManager) {
	const downloadsInfo = this.downloadsInfo

	this.apiUpdatedPlaylists[0] = { playlistName: 'SpotHack_Music', tracks: [] }
	Object.keys(downloadsInfo).forEach(path => {
		const playlistsOnPath = downloadsInfo[path]
		if (playlistsOnPath[0]) {
			playlistsOnPath[0].tracks.forEach(trackOnPath => {
				if (!this.apiUpdatedPlaylists[0].tracks.some(apiTrack => apiTrack.spotifyId === trackOnPath.spotifyId)) {
					this.apiUpdatedPlaylists[0].tracks.push(trackOnPath)
				}
			})
		}
	})

	await updatePlaylistsNames(downloadsInfo, this.apiUpdatedPlaylists)

	const downloadedPlaylistInfoOnDevice = await verifyFileTree(downloadsInfo, this.apiUpdatedPlaylists)

	this.downloadsInfo = downloadedPlaylistInfoOnDevice

	this.arePlaylistsUpdated = true
	ToastAndroid.show('Playlists Updated', ToastAndroid.SHORT)
}
