import * as RNFS from 'react-native-fs'
import onChange from 'on-change'

import addMusicsToDownloadQueue from './machineMethods/addMusicsToDownloadQueue'
import setFinalPath from './machineMethods/setFinalPath'
import getDownloadsStatus from './machineMethods/getDownloadsStatus'

import getYoutubeIds from './downloadMethods/getYoutubeIds'
import getDownloadUrls from './downloadMethods/getDownloadUrls'
import downloadMusicsVideos from './downloadMethods/downloadMusicsVideos'
import convertVideosToMusics from './downloadMethods/convertVideosToMusics'
import finishDownload from './downloadMethods/finishDownload'

export interface queueSchema extends Array<musicOnQueueSchema> {}

export interface musicForQueueSchema {
	spotifyId: string, // metadata
	youtubeId: string, // metadata

	musicName: string, // metadata
	artists: string, // metadata
	albumName: string, // thumbnail
	thumbnail: string, // thumbnail

	playlistName: string,
	playlistId: string, // metadata
	youtubeQuery: string,

	downloadSource: string, // metadata
}

export interface musicOnQueueSchema extends musicForQueueSchema {
	downloadUrl: string,
	approxDurationMs: number, // metadata
	stageProgress: number,

	youtubeQuery: string,

	queueIndex: number,
	queueId: string,

	stage: string,
	progress: number,
	// progress - stage:
	// 0 - error - ${stage where error ocurred}
	// 1 - start
	// 2 - gotten_youtubeId
	// 3 - gotten_downloadUrl
	// 4 - downloadedMusicVideo
	// 5 - convertedVideoToMusic
	// 6 - downloadedMusic / alreadyDownloaded
}

type queueChangesListenerFunction = (index: string, newMusicInfo: musicOnQueueSchema, prevMusicInfo: unknown, name: string) => void;
type queueChangesListenerFunctionsSchema = Array<queueChangesListenerFunction>

export interface statisticsSchema {
	queueLength: number
	musicsWithYoutubeId: number,
	youtubeIdsSources: {
		[key: string]: number
	},
	musicsWithDownloadUrl: number,
	downloadedMusicVideos: number,
	convertedVideos: number,
	downloadedMusics: number,
	alreadyDownloadedMusics: number,
	errors: Array<string>
}

export const defaultStatistics: statisticsSchema = {
	queueLength: 0,
	musicsWithYoutubeId: 0,
	youtubeIdsSources: {},
	musicsWithDownloadUrl: 0,
	downloadedMusicVideos: 0,
	convertedVideos: 0,
	downloadedMusics: 0,
	alreadyDownloadedMusics: 0,
	errors: []
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
	protected storagePermissions = false
	// End the path with "/"
	protected temporaryPath = `${RNFS.CachesDirectoryPath}/musicsVideos/`
	protected finalPath = `${RNFS.DownloadDirectoryPath}/`
	public setFinalPath = setFinalPath

	public defaultDownloadSource = 'ytFirstVideoOnSearch'

	public addMusicsToDownloadQueue = addMusicsToDownloadQueue

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

	protected finishDownload = finishDownload

	protected downloadsStatistics = defaultStatistics

	public getDownloadsStatus = getDownloadsStatus
}

const downloadMachine = new DownloadMachine()

export default downloadMachine
