import * as RNFS from 'react-native-fs'

import { DownloadMachine, queueSchema } from './index'
import { createAssetsOnPath, deleteAssetsOnPath } from './utils'

export default async function downloadMusicsVideos (this: DownloadMachine) {
	if (this.isDownloadMusicsVideosActive === true) return 0
	this.isDownloadMusicsVideosActive = true

	while (this.downloadMusicsVideosQueue.length > 0) {
		const queue = this.queue
		const queueIndex = this.downloadMusicsVideosQueue[0]
		const temporaryPathWithFile = this.temporaryPath + queue[queueIndex].youtubeQuery + '.mp4'
		const { approxDurationMs, downloadUrl } = queue[queueIndex]

		let downloadSuccess: any = 1

		try {
			downloadSuccess = await createAssetsOnPath(temporaryPathWithFile)
			if (downloadSuccess === 0) throw new Error('downloadVideo')

			downloadSuccess = await downloadVideo(downloadUrl, temporaryPathWithFile, queue, queueIndex)
			if (downloadSuccess === 0) throw new Error('downloadVideo')

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
			queue[queueIndex] = {
				...queue[queueIndex],

				progress: 0,
				stage: 'error - downloadedMusicsVideos'
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
	try {
		const download = RNFS.downloadFile({
			fromUrl: url,
			toFile: temporaryPathWithFile,
			progress: (progress) => {
				queue[queueIndex] = {
					...queue[queueIndex],
					stageProgress: (progress.bytesWritten / progress.contentLength) * 100
				}
			},
			progressInterval: 500
		})

		const downloadStatus = await download.promise

		queue[queueIndex] = {
			...queue[queueIndex],
			stageProgress: 100
		}

		return downloadStatus
	} catch (err) {
		return 0
	}
}
