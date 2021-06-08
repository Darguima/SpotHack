import AsyncStorage from '@react-native-community/async-storage'

import updateDownloadedPlaylists from './updateDownloadedPlaylists'

import spotifyApi from '../../services/spotify/spotifyApi'

import convertArtistsArrayToString from '../../utils/convertArtistsArrayToString'
import createYoutubeQuery from '../../utils/createYoutubeQuery'

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
				this.updateAlreadyDownloadedPlaylistsIds().then(() => {
					this.updateDownloadsInfo().then(() => {
						this.updateDownloadedPlaylists(newRootPath)
					})
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

		await Promise.all(
			Object.keys(updatedDownloadedPlaylistsInfo)
				.map(rootPath => {
					return Object.keys(updatedDownloadedPlaylistsInfo[rootPath])
				})
				.reduce((prevArrayStrings, currentArrayStrings) => {
					return [...prevArrayStrings, ...currentArrayStrings]
				})
				.map(async playlistId => {
					await this.addAlreadyDownloadedPlaylistId(playlistId)
				})
		)

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

		await this.addAlreadyDownloadedPlaylistId(playlistId)
	}

	protected apiUpdatedPlaylists: downloadedPlaylistsInfoSchema = {}
	protected async getApiUpdatedPlaylist (playlistId: string): Promise<downloadedPlaylistInfoSchema | undefined> {
		if (!this.apiUpdatedPlaylists[playlistId]) {
			const apiPlaylist: SpotifyApi.PlaylistObjectFull = (await spotifyApi.get(`playlists/${playlistId}`)).data

			if (!apiPlaylist) return

			this.apiUpdatedPlaylists[playlistId] = {
				playlistName: apiPlaylist.name,
				tracks: apiPlaylist.tracks.items.map(({ track }) => ({
					spotifyId: track.id,
					title: track.name,
					artists: convertArtistsArrayToString(track.artists),
					youtubeQuery: createYoutubeQuery(convertArtistsArrayToString(track.artists), track.name)
				}))
			}
		}

		return JSON.parse(JSON.stringify(this.apiUpdatedPlaylists[playlistId]))
	}

	protected alreadyDownloadedPlaylistsIds: string[] = []
	protected async updateAlreadyDownloadedPlaylistsIds () {
		const storedAlreadyDownloadedPlaylistsIds = await AsyncStorage.getItem('@SpotHackDlManager:alreadyDownloadedPlaylistsIds')

		if (storedAlreadyDownloadedPlaylistsIds) {
			const updatedAlreadyDownloadedPlaylistsIds: string[] = JSON.parse(storedAlreadyDownloadedPlaylistsIds)

			const apiSuccessPlaylistsRequests = (
				await Promise.all(
					updatedAlreadyDownloadedPlaylistsIds
						.map(async (playlistId: string) => {
							if (await this.getApiUpdatedPlaylist(playlistId)) {
								return playlistId
							}
						})
				)
			).filter(possibleUndefined => possibleUndefined !== undefined) as string[]

			this.alreadyDownloadedPlaylistsIds = apiSuccessPlaylistsRequests
		}

		let userPlaylistsUrl = 'me/playlists'
		while (1) {
			const userPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse = (await spotifyApi.get(
				userPlaylistsUrl,
				{
					params: {
						limit: 50
					}
				}
			)).data

			if (userPlaylists) {
				const playlistsIds = userPlaylists.items.map(playlist => playlist.id)

				await Promise.all(
					playlistsIds
						.map(async (playlistId: string) => {
							await this.getApiUpdatedPlaylist(playlistId)
						})
				)

				this.alreadyDownloadedPlaylistsIds = [...this.alreadyDownloadedPlaylistsIds, ...playlistsIds]

				if (!userPlaylists.next) break
				userPlaylistsUrl = userPlaylists.next.replace(spotifyApi.defaults.baseURL || '', '')
			} else break
		}

		// Remove repeated Ids
		this.alreadyDownloadedPlaylistsIds = [...new Set(this.alreadyDownloadedPlaylistsIds)]
		await AsyncStorage.setItem(
			'@SpotHackDlManager:alreadyDownloadedPlaylistsIds',
			JSON.stringify(this.alreadyDownloadedPlaylistsIds)
		)
	}

	protected async addAlreadyDownloadedPlaylistId (playlistId: string) {
		if (playlistId === '0') return
		if (this.alreadyDownloadedPlaylistsIds.indexOf(playlistId) !== -1) return

		if (await this.getApiUpdatedPlaylist(playlistId)) {
			this.alreadyDownloadedPlaylistsIds.push(playlistId)
			await AsyncStorage.setItem(
				'@SpotHackDlManager:alreadyDownloadedPlaylistsIds',
				JSON.stringify(this.alreadyDownloadedPlaylistsIds)
			)
		}
	}

	protected updateDownloadedPlaylists = updateDownloadedPlaylists
}

const downloadManager = new DownloadManager()

export default downloadManager

// examinar todas as pastas ao mesmo tempo (n deve ser preciso analisar as tracks)
// Adicionar os ids das playlists favoritadas
