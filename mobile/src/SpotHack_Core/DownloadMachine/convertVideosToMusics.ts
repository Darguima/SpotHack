import { RNFFmpeg, RNFFmpegConfig } from 'react-native-ffmpeg'

import { DownloadMachine } from './index'
import { createAssetsOnPath, deleteAssetsOnPath } from './utils'
import removeSpecialChars from '../../utils/removeSpecialChars'

export default async function convertVideosToMusics (this: DownloadMachine) {
	if (this.isConvertVideosToMusicsActive === true) return 0
	this.isConvertVideosToMusicsActive = true

	while (this.convertVideosToMusicsQueue.length > 0) {
		const queue = this.queue
		const queueIndex = this.convertVideosToMusicsQueue[0]
		const temporaryPathWithFile = removeSpecialChars(this.temporaryPath + queue[queueIndex].youtubeQuery + '.mp4')
		const finalPathWithFile = removeSpecialChars(this.finalPath + queue[queueIndex].playlistName + '/' + queue[queueIndex].youtubeQuery + '.mp3')
		const { thumbnail, musicName, artists, albumName, spotifyId, youtubeId, approxDurationMs, playlistId, downloadSource } = queue[queueIndex]

		try {
			await createAssetsOnPath(finalPathWithFile)

			RNFFmpegConfig.enableStatisticsCallback(async ffmpegStatus => {
				queue[queueIndex] = {
					...queue[queueIndex],
					stageProgress: (ffmpegStatus.time / Number(approxDurationMs)) * 100
				}
			})

			const response = await RNFFmpeg.execute(
				`-i "${temporaryPathWithFile}" ${thumbnail ? '-i "' + (thumbnail).replace('https', 'http') + '" -c:v copy -map 0:a:0 -map 1:v:0 ' : ''} -acodec libmp3lame -metadata title="${musicName}" -metadata artist="${artists}" -metadata album="${albumName}" -metadata spotifyId="${spotifyId}" -metadata youtubeId="${youtubeId}" -metadata approxDurationMs="${approxDurationMs}" -metadata playlistSpotifyId="${playlistId}" -metadata downloadSource="${downloadSource}" "${finalPathWithFile}" -y -loglevel error`
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

			deleteAssetsOnPath(finalPathWithFile)
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
