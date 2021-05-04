import { DownloadMachine, musicForQueueSchema, musicOnQueueSchema } from '../index'
import createQueueId from '../../../utils/createQueueId'
import { getExternalStoragePermissions } from '../../../utils/getStoragePermissions'

export default async function addMusicsToDownloadQueue (this: DownloadMachine, playlist: Array<musicForQueueSchema>) {
	if (!this.storagePermissions) {
		this.storagePermissions = await getExternalStoragePermissions()

		if (!this.storagePermissions) return 0
	}

	playlist.forEach(item => {
		// Ignore repeated downloads
		if (this.queueIds.indexOf(createQueueId(item.spotifyId, item.playlistId)) !== -1) {
			return 0
		}

		const musicInfo: musicOnQueueSchema = {
			...item,
			downloadUrl: '',
			approxDurationMs: 0,
			stageProgress: 0,

			queueIndex: this.queue.length,
			queueId: createQueueId(item.spotifyId, item.playlistId),

			stage: 'start',
			progress: 1
		}

		/*
		* We don't use `this.queue.push(musicInfo)` because in `queue` the proxy is trigged returning all
		* the array instead of only musicInfo
		*/

		this.queue[this.queue.length] = musicInfo
		this.queueIds.push(musicInfo.queueId)
		this.youtubeIdsQueue.push(musicInfo.queueIndex)
		// downloadsStatistics
		this.downloadsStatistics.queueLength += 1
		// =
	})

	if (this.isGetYoutubeIdsActive === false) this.getYoutubeIds()
	return 1
}
