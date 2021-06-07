import { DownloadManager } from '../index'

import { ToastAndroid } from 'react-native'

import updatePlaylistsNames from './updatePlaylistsNames'
import verifyFileTree from './verifyFileTree'

export default async function (this: DownloadManager, currentRootPath: string) {
	const downloadedPlaylistsInfo = this.getDownloadedPlaylistsInfo()
	if (downloadedPlaylistsInfo[0]) { this.apiUpdatedPlaylists[0] = downloadedPlaylistsInfo[0] }

	if (currentRootPath !== this.rootPath) return

	await updatePlaylistsNames(downloadedPlaylistsInfo, this.apiUpdatedPlaylists, currentRootPath)

	if (currentRootPath !== this.rootPath) return

	const downloadedPlaylistInfoOnDevice = await verifyFileTree(this.apiUpdatedPlaylists, currentRootPath)

	await this.setDownloadedPlaylistsInfo(downloadedPlaylistInfoOnDevice, currentRootPath)

	if (currentRootPath !== this.rootPath) return

	this.arePlaylistsUpdatedValue = true
	ToastAndroid.show('Playlists Updated', ToastAndroid.SHORT)
}
