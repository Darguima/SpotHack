import { DownloadMachine } from '../index'
import getYoutubeUrl from '../../GetYoutubeUrl'

export default async function getYoutubeIds (this: DownloadMachine) {
	if (this.isGetYoutubeIdsActive === true) return 0
	this.isGetYoutubeIdsActive = true

	while (this.youtubeIdsQueue.length > 0) {
		const queueIndex = this.youtubeIdsQueue[0]

		if (this.queue[queueIndex].youtubeId === '') {
			const { youtubeId, infoSourceIcon, success } = await getYoutubeUrl(this.queue[queueIndex].spotifyId, '', '', this.queue[queueIndex].youtubeQuery)
			const queue = this.queue

			if (success !== 0) {
				queue[queueIndex] = {
					...queue[queueIndex],
					youtubeId: youtubeId[queue[queueIndex].downloadSource],
					progress: 2,
					stage: 'gotten_youtubeUrl'
				}

				// downloadsStatistics
				this.downloadsStatistics.musicsWithYoutubeId += 1
				if (!this.downloadsStatistics.youtubeIdsSources[infoSourceIcon]) {
					this.downloadsStatistics.youtubeIdsSources[infoSourceIcon] = 1
				} else {
					this.downloadsStatistics.youtubeIdsSources[infoSourceIcon] += 1
				}
				// =

				this.downloadUrlsQueue.push(queueIndex)
				if (this.isGetDownloadUrlsActive === false) this.getDownloadUrls()
			} else {
				queue[queueIndex] = {
					...queue[queueIndex],
					progress: 0,
					stage: 'gotten_youtubeId - error'
				}

				// downloadsStatistics
				this.downloadsStatistics.errors.push(queue[queueIndex].youtubeQuery)
				// =
			}
		} else {
			// downloadsStatistics
			this.downloadsStatistics.musicsWithYoutubeId += 1
			if (!this.downloadsStatistics.youtubeIdsSources.spothack) {
				this.downloadsStatistics.youtubeIdsSources.spothack = 1
			} else {
				this.downloadsStatistics.youtubeIdsSources.spothack += 1
			}
			// =

			this.downloadUrlsQueue.push(queueIndex)
			if (this.isGetDownloadUrlsActive === false) this.getDownloadUrls()
		}

		this.youtubeIdsQueue.shift()
	}

	this.isGetYoutubeIdsActive = false

	return 1
}
