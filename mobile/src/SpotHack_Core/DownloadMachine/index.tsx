import createQueueId from '../../utils/createQueueId'

export interface queueSchema extends Array<musicOnQueueSchema> {}

export interface musicOnQueueSchema {
	spotifyId: string,
	youtubeId: string,

	playlistName: string,
	youtubeQuery: string,

	queueNumber: number,
	queueId: string,

	success: 0 | 1 | 2 | 3;
}

export interface musicForQueueSchema {
	spotifyId: string,
	youtubeId: string,

	playlistName: string,
	playlistId: string,
	youtubeQuery: string,

	downloadSource: string
}

class DownloadMachine {
	private queue = [] as queueSchema
	private queueIds = [] as Array<string>
	private lastQueueNumber = 0

	addMusicsToDownloadQueue (playlist: Array<musicForQueueSchema>) {
		playlist.map(item => {
			// Ignore repeated downloads
			if (this.queueIds.indexOf(createQueueId(item.spotifyId, item.playlistId)) !== -1) {
				return 0
			}

			const musicInfo = {
				...item,

				success: 1,

				queueNumber: this.lastQueueNumber,
				queueId: createQueueId(item.spotifyId, item.playlistId)
			} as musicOnQueueSchema

			this.lastQueueNumber += 1

			this.queue.push(musicInfo)
			this.queueIds.push(musicInfo.queueId)

			return 1
		})
	}

	getDownloadsStatus () {
		return [...this.queue]
	}
}

const downloadMachine = new DownloadMachine()

export default downloadMachine
