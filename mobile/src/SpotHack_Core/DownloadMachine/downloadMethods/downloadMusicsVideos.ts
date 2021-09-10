import * as RNFS from 'react-native-fs'

import { DownloadMachine, queueSchema } from '../index'
import { createAssetsOnPath, deleteAssetsOnPath } from '../utils'
import removeSpecialChars from '../../../utils/removeSpecialChars'

export default async function downloadMusicsVideos (this: DownloadMachine) {
	if (this.isDownloadMusicsVideosActive === true) return 0
	this.isDownloadMusicsVideosActive = true

	while (this.downloadMusicsVideosQueue.length > 0) {
		const queue = this.queue
		const queueIndex = this.downloadMusicsVideosQueue[0]
		const temporaryPathWithFile = this.temporaryPath + queue[queueIndex].playlistId + removeSpecialChars(queue[queueIndex].youtubeQuery) + '.mp4'
		const { approxDurationMs, downloadUrl } = queue[queueIndex]

		try {
			const assetsCreation = await createAssetsOnPath(temporaryPathWithFile)
			if (assetsCreation === 0) throw new Error('error creating asset on temp path')

			const downloadSuccess = await downloadVideo(downloadUrl, temporaryPathWithFile, queue, queueIndex)
			if (downloadSuccess.statusCode !== 200) throw new Error(`error on downloading video - ${downloadSuccess.statusCode}`)

			// downloadsStatistics
			this.downloadsStatistics.downloadedMusicVideos += 1
			// =

			queue[queueIndex] = {
				...queue[queueIndex],

				approxDurationMs: Number(approxDurationMs),
				downloadUrl: downloadUrl,

				progress: 4,
				stage: 'downloadedMusicsVideos'
			}

			this.convertVideosToMusicsQueue.push(queueIndex)
			if (this.isConvertVideosToMusicsActive === false) this.convertVideosToMusics()
		} catch (err) {
			// downloadsStatistics
			this.downloadsStatistics.errors.push(queue[queueIndex].youtubeQuery)
			// =

			queue[queueIndex] = {
				...queue[queueIndex],

				progress: 0,
				stage: `downloadedMusicVideo - ${err}`
			}

			deleteAssetsOnPath(temporaryPathWithFile)
		}

		this.downloadMusicsVideosQueue.shift()
	}

	this.isDownloadMusicsVideosActive = false
	return 1
}

const downloadVideo = async (url: string, temporaryPathWithFile: string, queue: queueSchema, queueIndex: number
) => {
	const download = RNFS.downloadFile({
		fromUrl: url,
		toFile: temporaryPathWithFile,
		progress: (progress) => {
			queue[queueIndex] = {
				...queue[queueIndex],
				stageProgress: (progress.bytesWritten / progress.contentLength) * 100
			}
		},
		progressDivider: 5
	})

	const downloadStatus = await download.promise

	queue[queueIndex] = {
		...queue[queueIndex],
		stageProgress: 100
	}

	return downloadStatus
}
