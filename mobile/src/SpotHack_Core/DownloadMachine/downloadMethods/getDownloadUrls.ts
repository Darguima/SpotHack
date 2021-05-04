import { DownloadMachine } from '../index'
import ytdl from 'react-native-ytdl'

export default async function getDownloadUrls (this: DownloadMachine) {
	if (this.isGetDownloadUrlsActive === true) return 0
	this.isGetDownloadUrlsActive = true

	while (this.downloadUrlsQueue.length > 0) {
		const queue = this.queue
		const queueIndex = this.downloadUrlsQueue[0]

		try {
			const videoFormats = await ytdl.getInfo(queue[queueIndex].youtubeId)
			const { approxDurationMs, url } = ytdl.chooseFormat(videoFormats.formats, { quality: 'highestaudio' })

			queue[queueIndex] = {
				...queue[queueIndex],

				approxDurationMs: Number(approxDurationMs),
				downloadUrl: url,

				progress: 3,
				stage: 'gotten_downloadUrl'
			}
		} catch (err) {
			queue[queueIndex] = {
				...queue[queueIndex],

				progress: 0,
				stage: 'error'
			}
		}

		this.downloadMusicsVideosQueue.push(queueIndex)
		if (this.isDownloadMusicsVideosActive === false) this.downloadMusicsVideos()
		this.downloadUrlsQueue.shift()
	}

	this.isGetDownloadUrlsActive = false
	return 1
}
