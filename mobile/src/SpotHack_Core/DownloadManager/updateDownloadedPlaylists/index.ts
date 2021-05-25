import { DownloadManager } from '../index'

import { ToastAndroid } from 'react-native'

import updatePlaylistsNames from './updatePlaylistsNames'
import verifyFileTree from './verifyFileTree'

import spotifyApi from '../../../services/spotify/spotifyApi'

import convertArtistsArrayToString from '../../../utils/convertArtistsArrayToString'
import createYoutubeQuery from '../../../utils/createYoutubeQuery'

export default async function (this: DownloadManager, currentRootPath: string) {
	const downloadedPlaylistsInfo = this.getDownloadedPlaylistsInfo()
	delete downloadedPlaylistsInfo['0']

	if (currentRootPath !== this.rootPath) return

	await Promise.all(
		Object.keys(downloadedPlaylistsInfo).map(async playlistId => {
			if (Object.keys(this.apiUpdatedPlaylists).includes(playlistId)) return
			const updatedPlaylist: SpotifyApi.PlaylistObjectFull = (await spotifyApi.get(`playlists/${playlistId}`)).data

			if (currentRootPath !== this.rootPath) return
			this.apiUpdatedPlaylists[playlistId] = {
				playlistName: updatedPlaylist.name,
				tracks: updatedPlaylist.tracks.items.map(({ track }) => ({
					spotifyId: track.id,
					title: track.name,
					artists: convertArtistsArrayToString(track.artists),
					youtubeQuery: createYoutubeQuery(convertArtistsArrayToString(track.artists), track.name)
				}))
			}
		}))

	if (currentRootPath !== this.rootPath) return

	await updatePlaylistsNames(downloadedPlaylistsInfo, this.apiUpdatedPlaylists, currentRootPath)

	if (currentRootPath !== this.rootPath) return

	const downloadedPlaylistInfoOnDevice = await verifyFileTree(downloadedPlaylistsInfo, this.apiUpdatedPlaylists, currentRootPath)

	await this.setDownloadedPlaylistsInfo(downloadedPlaylistInfoOnDevice, currentRootPath)

	if (currentRootPath !== this.rootPath) return

	this.arePlaylistsUpdatedValue = true
	ToastAndroid.show('Playlists Updated', ToastAndroid.SHORT)
}
