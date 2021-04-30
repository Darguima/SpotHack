import * as RNFS from 'react-native-fs'
import onChange from 'on-change'

import createQueueId from '../../utils/createQueueId'

import getYoutubeIds from './getYoutubeIds'
import getDownloadUrls from './getDownloadUrls'
import downloadMusicsVideos from './downloadMusicsVideos'
import convertVideosToMusics from './convertVideosToMusics'

import { getExternalStoragePermissions } from '../../utils/getStoragePermissions'

export interface queueSchema extends Array<musicOnQueueSchema> {}

export interface musicOnQueueSchema {
	spotifyId: string,
	youtubeId: string,

	downloadUrl: string,
	approxDurationMs: number,
	stageProgress: number,

	playlistName: string,
	youtubeQuery: string,

	queueIndex: number,
	queueId: string,

	downloadSource: string,

	stage: string,
	progress: number,
	// progress - stage:
	// 0 - error - ${stage where error ocurred}
	// 1 - start
	// 2 - gotten_youtubeId
	// 3 - gotten_downloadUrl
	// 4 - downloadedMusicVideo
	// 5 - convertedVideoToMusic
}

export interface musicForQueueSchema {
	spotifyId: string,
	youtubeId: string,

	playlistName: string,
	playlistId: string,
	youtubeQuery: string,

	downloadSource: string
}

type queueChangesListenerFunction = (index: string, newMusicInfo: musicOnQueueSchema, prevMusicInfo: unknown, name: string) => void;
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
	private storagePermissions = false
	// End the path with "/"
	protected temporaryPath = `${RNFS.CachesDirectoryPath}/musicsVideos/`
	protected finalPath = `${RNFS.DownloadDirectoryPath}/spothack/`
	setFinalPath (newFinalPath: string) {
		if (!newFinalPath.endsWith('/')) newFinalPath += '/'

		this.finalPath = newFinalPath
	}

	async addMusicsToDownloadQueue (playlist: Array<musicForQueueSchema>) {
		if (!this.storagePermissions) {
			this.storagePermissions = await getExternalStoragePermissions()

			if (!this.storagePermissions) return 0
		}

		playlist.forEach(item => {
			// Ignore repeated downloads
			if (this.queueIds.indexOf(createQueueId(item.spotifyId, item.playlistId)) !== -1) {
				return 0
			}

			const musicInfo: musicOnQueueSchema = {
				...item,
				downloadUrl: '',
				approxDurationMs: 0,
				stageProgress: 0,

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
			this.youtubeIdsQueue.push(musicInfo.queueIndex)
		})

		if (this.isGetYoutubeIdsActive === false) this.getYoutubeIds()
		return 1
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

	protected youtubeIdsQueue = [] as Array<number>
	protected isGetYoutubeIdsActive = false
	protected getYoutubeIds = getYoutubeIds

	protected downloadUrlsQueue = [] as Array<number>
	protected isGetDownloadUrlsActive = false
	protected getDownloadUrls = getDownloadUrls

	protected downloadMusicsVideosQueue = [] as Array<number>
	protected isDownloadMusicsVideosActive = false
	protected downloadMusicsVideos = downloadMusicsVideos

	protected convertVideosToMusicsQueue = [] as Array<number>
	protected isConvertVideosToMusicsActive = false
	protected convertVideosToMusics = convertVideosToMusics

	protected urlsSourcesCount: urlsSourcesCountSchema = { totalRequests: 0, counts: {} }
	getUrlsSourcesCount () { return { ...this.urlsSourcesCount } }

	getDownloadsStatus () {
		return [...this.queue]
	}
}

const downloadMachine = new DownloadMachine()

export default downloadMachine
