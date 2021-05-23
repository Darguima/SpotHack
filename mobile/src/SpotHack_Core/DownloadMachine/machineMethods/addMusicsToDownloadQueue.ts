import { DownloadMachine, musicForQueueSchema, musicOnQueueSchema } from '../index'

import downloadManager from '../../DownloadManager'

import createQueueId from '../../../utils/createQueueId'
import { getExternalStoragePermissions } from '../../../utils/getStoragePermissions'

export default async function addMusicsToDownloadQueue (this: DownloadMachine, playlist: Array<musicForQueueSchema>) {
	if (!this.storagePermissions) {
		this.storagePermissions = await getExternalStoragePermissions()

		if (!this.storagePermissions) return 0
	}

	const downloadedPlaylistsInfo = downloadManager.getDownloadedPlaylistsInfo()

	playlist.forEach(item => {
		// Ignore repeated downloads
		if (this.queueIds.indexOf(createQueueId(item.spotifyId, item.playlistId)) !== -1) {
			return
		}

		let alreadyDownloaded = false

		if (downloadedPlaylistsInfo[item.playlistId]) {
			if (downloadedPlaylistsInfo[item.playlistId].tracks.some(track => track.spotifyId === item.spotifyId)) {
				alreadyDownloaded = true
			}
		}

		const musicInfo: musicOnQueueSchema = {
			...item,
			downloadUrl: '',
			approxDurationMs: 0,
			stageProgress: 0,

			queueIndex: this.queue.length,
			queueId: createQueueId(item.spotifyId, item.playlistId),

			stage: !alreadyDownloaded ? 'start' : 'alreadyDownloaded',
			progress: !alreadyDownloaded ? 1 : 6
		}

		if (!alreadyDownloaded) {
			this.youtubeIdsQueue.push(musicInfo.queueIndex)
		} else {
			// downloadsStatistics
			this.downloadsStatistics.alreadyDownloadedMusics += 1
			// =
		}

		// downloadsStatistics
		this.downloadsStatistics.queueLength += 1
		// =

		this.queue.push(musicInfo)
		this.queueIds.push(musicInfo.queueId)
	})

	if (this.isGetYoutubeIdsActive === false) this.getYoutubeIds()
	return 1
}
