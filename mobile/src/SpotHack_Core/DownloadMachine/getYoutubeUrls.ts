import { DownloadMachine } from './index'
import getYoutubeUrl from '../GetYoutubeUrl'

export default async function getYoutubeUrls (this: DownloadMachine) {
	if (this.isGetYoutubeUrlsActive === true) return 0
	this.isGetYoutubeUrlsActive = true

	while (this.youtubeUrlQueue.length > 0) {
		const queueIndex = this.youtubeUrlQueue[0]

		if (this.queue[queueIndex].youtubeId === '') {
			const { youtubeId, infoSourceIcon, success } = await getYoutubeUrl(this.queue[queueIndex].spotifyId, '', '', this.queue[queueIndex].youtubeQuery)
			const queue = this.queue

			if (!this.urlsSourcesCount.counts[infoSourceIcon]) {
				this.urlsSourcesCount.counts[infoSourceIcon] = 1
			} else {
				this.urlsSourcesCount.counts[infoSourceIcon] += 1
			}
			this.urlsSourcesCount.totalRequests += 1

			if (success !== 0) {
				queue[queueIndex] = {
					...queue[queueIndex],
					youtubeId: youtubeId[queue[queueIndex].downloadSource],
					progress: 2,
					stage: 'gotten_youtubeUrl'
				}
			} else {
				queue[queueIndex] = {
					...queue[queueIndex],
					progress: 0,
					stage: 'error'
				}
			}
		}

		this.youtubeUrlQueue.shift()
	}

	this.isGetYoutubeUrlsActive = false

	return 1
}
