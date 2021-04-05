import { DownloadMachine } from './index'
import getYoutubeUrl from '../GetYoutubeUrl'

export default async function getYoutubeUrls (this: DownloadMachine) {
	if (this.isGetYoutubeUrlsActive === true) return 0
	this.isGetYoutubeUrlsActive = true

	while (this.youtubeUrlQueue.length > 0) {
		const queueIndex = this.youtubeUrlQueue[0]
		const musicInfo = this.queue[queueIndex]

		if (musicInfo.youtubeId === '') {
			const { youtubeId, infoSourceIcon } = await getYoutubeUrl(musicInfo.spotifyId, '', '', musicInfo.youtubeQuery)

			if (!this.urlsSourcesCount.counts[infoSourceIcon]) {
				this.urlsSourcesCount.counts[infoSourceIcon] = 1
			} else {
				this.urlsSourcesCount.counts[infoSourceIcon] += 1
			}
			this.urlsSourcesCount.totalRequests += 1

			musicInfo.youtubeId = youtubeId[musicInfo.downloadSource]
		}

		this.youtubeUrlQueue.shift()
	}

	this.isGetYoutubeUrlsActive = false

	return 1
}
