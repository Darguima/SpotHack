import { DownloadMachine } from '../index'

import downloadManager from '../../DownloadManager'

export default function convertVideosToMusics (this: DownloadMachine, queueIndex: number) {
	const musicInfo = this.queue[queueIndex]

	downloadManager.addDownloadedMusicInfo(
		musicInfo.playlistId,
		musicInfo.playlistName,
		{
			spotifyId: musicInfo.spotifyId,
			title: musicInfo.musicName,
			artists: musicInfo.artists,
			youtubeQuery: musicInfo.youtubeQuery
		}
	)

	// downloadsStatistics
	this.downloadsStatistics.downloadedMusics += 1
	// =

	this.queue[queueIndex] = {
		...musicInfo,

		progress: 6,
		stage: 'downloadedMusic'
	}
}
