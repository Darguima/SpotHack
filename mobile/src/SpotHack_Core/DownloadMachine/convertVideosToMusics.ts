import { RNFFmpeg, RNFFmpegConfig } from 'react-native-ffmpeg'

import { DownloadMachine } from './index'
import { createAssetsOnPath, deleteAssetsOnPath } from './utils'

export default async function convertVideosToMusics (this: DownloadMachine) {
	if (this.isConvertVideosToMusicsActive === true) return 0
	this.isConvertVideosToMusicsActive = true

	while (this.convertVideosToMusicsQueue.length > 0) {
		const queue = this.queue
		const queueIndex = this.convertVideosToMusicsQueue[0]
		const temporaryPathWithFile = this.temporaryPath + queue[queueIndex].youtubeQuery + '.mp4'
		const finalPathWithFile = this.finalPath + queue[queueIndex].playlistName + '/' + queue[queueIndex].youtubeQuery + '.mp3'
		const { approxDurationMs } = queue[queueIndex]

		try {
			await createAssetsOnPath(finalPathWithFile)

			RNFFmpegConfig.enableStatisticsCallback(async ffmpegStatus => {
				queue[queueIndex] = {
					...queue[queueIndex],
					stageProgress: (ffmpegStatus.time / Number(approxDurationMs)) * 100
				}
			})

			const response = await RNFFmpeg.execute(
				`-i "${temporaryPathWithFile}" "${finalPathWithFile}" -y -loglevel error`
			)

			if (response !== 0) throw new Error('convertVideo')

			queue[queueIndex] = {
				...queue[queueIndex],

				stageProgress: 100,

				progress: 5,
				stage: 'convertedVideoToMusic'
			}
		} catch (err) {
			queue[queueIndex] = {
				...queue[queueIndex],

				progress: 0,
				stage: 'error - convertedVideoToMusic'
			}
		}

		try {
			deleteAssetsOnPath(temporaryPathWithFile)
		} catch (err) {
			deleteAssetsOnPath(finalPathWithFile)
		}

		this.convertVideosToMusicsQueue.shift()
	}

	this.isConvertVideosToMusicsActive = false
	return 1
}
