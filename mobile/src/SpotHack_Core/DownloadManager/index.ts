import * as RNFS from 'react-native-fs'

import updateDownloadedPlaylists from './updateDownloadedPlaylists'

const downloadsInfoFilePath = RNFS.CachesDirectoryPath + '/downloadedPlaylistsInfo.json'

const editFile = async (object: any, filePath: string) => {
	try {
		if (await RNFS.exists(filePath)) { await RNFS.unlink(filePath) }
		await RNFS.writeFile(filePath, JSON.stringify(object))
		return 1
	} catch (err) {
		return 0
	}
}

export interface downloadedMusicInfoSchema {
	title: string,
	artists: string,
	spotifyId: string,
	youtubeQuery: string
}

export interface downloadedPlaylistInfoSchema {
	playlistName: string,
	tracks: downloadedMusicInfoSchema[]
}

export interface downloadedPlaylistsInfoSchema {
	// PlaylistId
	[key: string]: downloadedPlaylistInfoSchema
}

export interface downloadsInfoSchema {
	// rooPath
	[key: string]: downloadedPlaylistsInfoSchema
}

export class DownloadManager {
	protected rootPathValue = ''
	get rootPath () { return this.rootPathValue }
	set rootPath (newRootPath) {
		if (this.rootPathValue !== newRootPath) {
			this.rootPathValue = newRootPath

			setTimeout(() => {
				this.updateDownloadsInfo().then(() => {
					this.updateDownloadedPlaylists(newRootPath)
				})
			}, 200)
		}
	}

	protected downloadsInfo: downloadsInfoSchema = {}
	protected async editDownloadsInfo (newDownloadsInfo: downloadsInfoSchema) {
		const editFileSuccess = await editFile(newDownloadsInfo, downloadsInfoFilePath)
		if (editFileSuccess) this.downloadsInfo = newDownloadsInfo
		return editFileSuccess
	}

	protected async updateDownloadsInfo () {
		let downloadedPlaylistsInfoFromFile: downloadsInfoSchema = { [this.rootPath]: {} }

		try {
			downloadedPlaylistsInfoFromFile = {
				...downloadedPlaylistsInfoFromFile, // [this.rootPath]: {}
				...JSON.parse(await RNFS.readFile(downloadsInfoFilePath))
			}
		} catch (err) {}

		this.downloadsInfo = downloadedPlaylistsInfoFromFile
	}

	public getDownloadedPlaylistsInfo (rootPath: string = this.rootPath) {
		return JSON.parse(JSON.stringify(this.downloadsInfo[rootPath])) as downloadedPlaylistsInfoSchema
	}

	protected async setDownloadedPlaylistsInfo (
		newDownloadedPlaylistsInfo: downloadedPlaylistsInfoSchema,
		rootPath: string = this.rootPath
	) {
		return await this.editDownloadsInfo({
			...this.downloadsInfo,
			[rootPath]: newDownloadedPlaylistsInfo
		})
	}

	public async addDownloadedMusicInfo (
		playlistId: string,
		playlistName: string,
		musicInfo: downloadedMusicInfoSchema
	) {
		const currentDownloadedPlaylistsInfo = this.getDownloadedPlaylistsInfo()

		if (!currentDownloadedPlaylistsInfo[playlistId]) {
			currentDownloadedPlaylistsInfo[playlistId] = {
				playlistName: playlistName,
				tracks: []
			}
		}

		return await this.setDownloadedPlaylistsInfo({
			...currentDownloadedPlaylistsInfo,
			[playlistId]: {
				playlistName,
				tracks: [
					...currentDownloadedPlaylistsInfo[playlistId].tracks,
					musicInfo
				]
			}
		})
	}

	protected apiUpdatedPlaylists: downloadedPlaylistsInfoSchema = {}
	protected updateDownloadedPlaylists = updateDownloadedPlaylists
}

const downloadManager = new DownloadManager()

export default downloadManager
