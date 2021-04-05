import createQueueId from '../../utils/createQueueId'

import getYoutubeUrls from './getYoutubeUrls'

export interface queueSchema extends Array<musicOnQueueSchema> {}

export interface musicOnQueueSchema {
	spotifyId: string,
	youtubeId: string,

	playlistName: string,
	youtubeQuery: string,

	queueIndex: number,
	queueId: string,

	downloadSource: string,

	stage: string,
	progress: number,
	// progress - stage:
	// 0 - error
	// 1 - start
}

export interface musicForQueueSchema {
	spotifyId: string,
	youtubeId: string,

	playlistName: string,
	playlistId: string,
	youtubeQuery: string,

	downloadSource: string
}

export interface urlsSourcesCountSchema {
	totalRequests: number,
	counts: {
		[key: string]: number
	}
}

export class DownloadMachine {
	protected queue = [] as queueSchema
	protected queueIds = [] as Array<string>

	addMusicsToDownloadQueue (playlist: Array<musicForQueueSchema>) {
		playlist.map(item => {
			// Ignore repeated downloads
			if (this.queueIds.indexOf(createQueueId(item.spotifyId, item.playlistId)) !== -1) {
				return 0
			}

			const musicInfo: musicOnQueueSchema = {
				...item,

				queueIndex: this.queue.length,
				queueId: createQueueId(item.spotifyId, item.playlistId),

				stage: 'start',
				progress: 1
			}

			this.queue.push(musicInfo)
			this.queueIds.push(musicInfo.queueId)
			this.youtubeUrlQueue.push(musicInfo.queueIndex)

			return 1
		})

		if (this.isGetYoutubeUrlsActive === false) this.getYoutubeUrls()
	}

	protected youtubeUrlQueue = [] as Array<number>
	protected isGetYoutubeUrlsActive = false
	protected urlsSourcesCount: urlsSourcesCountSchema = { totalRequests: 0, counts: {} }
	getUrlsSourcesCount () { return { ...this.urlsSourcesCount } }
	protected getYoutubeUrls = getYoutubeUrls

	getDownloadsStatus () {
		return [...this.queue]
	}
}

const downloadMachine = new DownloadMachine()

export default downloadMachine
