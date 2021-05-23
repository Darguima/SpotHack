import * as RNFS from 'react-native-fs'

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

interface downloadedMusicInfoSchema {
	title: string,
	artists: string,
	spotifyId: string,
	youtubeQuery: string
}

interface downloadedPlaylistInfoSchema {
	playlistName: string,
	tracks: downloadedMusicInfoSchema[]
}

interface downloadedPlaylistsInfoSchema {
	// PlaylistId
	[key: string]: downloadedPlaylistInfoSchema
}

interface downloadsInfoSchema {
	// rooPath
	[key: string]: downloadedPlaylistsInfoSchema
}

export class DownloadManager {
	private rootPathValue = ''
	get rootPath () { return this.rootPathValue }
	set rootPath (newRootPath) {
		if (this.rootPathValue !== newRootPath) {
			this.rootPathValue = newRootPath
			setTimeout(() => {
				this.updateDownloadsInfo().then(() => {
					if (this.rootPath === newRootPath) {
						console.log(JSON.stringify(this.getDownloadedPlaylistsInfo(), null, 2))
					}
				})
			}, 200)
		}
	}

	private downloadsInfo: downloadsInfoSchema = {}
	private async editDownloadsInfo (newDownloadsInfo: downloadsInfoSchema) {
		const editFileSuccess = await editFile(newDownloadsInfo, downloadsInfoFilePath)
		if (editFileSuccess) this.downloadsInfo = newDownloadsInfo
		return editFileSuccess
	}

	private async updateDownloadsInfo () {
		let downloadedPlaylistsInfoFromFile: downloadsInfoSchema = { [this.rootPath]: {} }

		try {
			downloadedPlaylistsInfoFromFile = {
				...downloadedPlaylistsInfoFromFile, // [this.rootPath]: {}
				...JSON.parse(await RNFS.readFile(downloadsInfoFilePath))
			}
		} catch (err) {}

		this.downloadsInfo = downloadedPlaylistsInfoFromFile
	}

	public getDownloadedPlaylistsInfo () { return this.downloadsInfo[this.rootPath] }
	private async setDownloadedPlaylistsInfo (newDownloadedPlaylistsInfo: downloadedPlaylistsInfoSchema) {
		return await this.editDownloadsInfo({
			...this.downloadsInfo,
			[this.rootPath]: newDownloadedPlaylistsInfo
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
}

const downloadManager = new DownloadManager()

export default downloadManager
