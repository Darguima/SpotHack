import createQueueId from '../../utils/createQueueId'

import getYoutubeUrls from './getYoutubeUrls'

import onChange from 'on-change'

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
	// 2 - gotten_youtubeUrl
}

export interface musicForQueueSchema {
	spotifyId: string,
	youtubeId: string,

	playlistName: string,
	playlistId: string,
	youtubeQuery: string,

	downloadSource: string
}

export type queueChangesListenerFunction = (index: string, newMusicInfo: musicOnQueueSchema, prevMusicInfo: unknown, name: string) => void;
type queueChangesListenerFunctionsSchema = Array<queueChangesListenerFunction>

export interface urlsSourcesCountSchema {
	totalRequests: number,
	counts: {
		[key: string]: number
	}
}

export class DownloadMachine {
	protected queue = onChange(
		[] as queueSchema,
		(path: string, value: unknown, previousValue: unknown, name: string) => {
			this.queueChangesListenerFunctions.forEach(
				eventFunction => eventFunction(path, value as musicOnQueueSchema, previousValue as musicOnQueueSchema, name)
			)
		}
	)

	protected queueIds: Array<string> = []

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

			/*
			* We don't use `this.queue.push(musicInfo)` because in `queue` the proxy is trigged returning all
			* the array instead of only musicInfo
			*/

			this.queue[this.queue.length] = musicInfo
			this.queueIds.push(musicInfo.queueId)
			this.youtubeUrlQueue.push(musicInfo.queueIndex)

			return 1
		})

		if (this.isGetYoutubeUrlsActive === false) this.getYoutubeUrls()
	}

	private queueChangesListenerFunctions: queueChangesListenerFunctionsSchema = []
	public addQueueChangesListener = (eventFunction: queueChangesListenerFunction) => {
		this.queueChangesListenerFunctions.push(eventFunction)
		return this.queueChangesListenerFunctions.length - 1
	}

	public changeQueueChangesListener = (functionIdentifier: number, eventFunction: queueChangesListenerFunction) => {
		this.queueChangesListenerFunctions[functionIdentifier] = eventFunction
	}

	public removeQueueChangesListener = (functionIdentifier: number) => {
		this.queueChangesListenerFunctions[functionIdentifier] = () => {}
	}

	protected youtubeUrlQueue = [] as Array<number>
	protected isGetYoutubeUrlsActive = false
	protected getYoutubeUrls = getYoutubeUrls

	protected urlsSourcesCount: urlsSourcesCountSchema = { totalRequests: 0, counts: {} }
	getUrlsSourcesCount () { return { ...this.urlsSourcesCount } }

	getDownloadsStatus () {
		return [...this.queue]
	}
}

const downloadMachine = new DownloadMachine()

export default downloadMachine
