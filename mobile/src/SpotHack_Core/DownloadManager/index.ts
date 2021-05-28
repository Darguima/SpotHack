import AsyncStorage from '@react-native-community/async-storage'

import updateDownloadedPlaylists from './updateDownloadedPlaylists'

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
			this.arePlaylistsUpdatedValue = false

			setTimeout(() => {
				this.updateDownloadsInfo().then(() => {
					this.updateDownloadedPlaylists(newRootPath)
				})
			}, 200)
		}
	}

	protected arePlaylistsUpdatedValue = false
	get arePlaylistsUpdated () { return this.arePlaylistsUpdatedValue }

	protected downloadsInfo: downloadsInfoSchema = {}
	protected async editDownloadsInfo (newDownloadsInfo: downloadsInfoSchema) {
		const downloadsInfoWithoutTracks: downloadsInfoSchema = {}

		// Don't is needed store the tracks info
		for (const rootPath in newDownloadsInfo) {
			downloadsInfoWithoutTracks[rootPath] = {}
			for (const playlistId in newDownloadsInfo[rootPath]) {
				downloadsInfoWithoutTracks[rootPath][playlistId] = {
					playlistName: newDownloadsInfo[rootPath][playlistId].playlistName,
					tracks: playlistId !== '0'
						?					[]
						:					newDownloadsInfo[rootPath][playlistId].tracks
				}
			}
		}

		await AsyncStorage.setItem('@SpotHackDlManager:downloadsInfo', JSON.stringify(downloadsInfoWithoutTracks))
		this.downloadsInfo = newDownloadsInfo
	}

	protected async updateDownloadsInfo () {
		let updatedDownloadedPlaylistsInfo: downloadsInfoSchema = { [this.rootPath]: {} }
		const storedDownloadedPlaylistsInfo = await AsyncStorage.getItem('@SpotHackDlManager:downloadsInfo')

		if (storedDownloadedPlaylistsInfo) {
			updatedDownloadedPlaylistsInfo = {
				...updatedDownloadedPlaylistsInfo, // [this.rootPath]: {}
				...JSON.parse(storedDownloadedPlaylistsInfo)
			}
		}

		this.downloadsInfo = updatedDownloadedPlaylistsInfo
	}

	public getDownloadedPlaylistsInfo (rootPath: string = this.rootPath): downloadedPlaylistsInfoSchema {
		return JSON.parse(JSON.stringify(this.downloadsInfo[rootPath]))
	}

	protected async setDownloadedPlaylistsInfo (
		newDownloadedPlaylistsInfo: downloadedPlaylistsInfoSchema,
		rootPath: string = this.rootPath
	) {
		await this.editDownloadsInfo({
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

		await this.setDownloadedPlaylistsInfo({
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
