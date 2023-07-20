/* eslint-disable camelcase */
import { youtube, Video } from 'scrape-youtube';
import convertTimerToSeconds from '../../utils/convertTimerToSeconds'
interface searchYoutubeVideoSchema extends Video {
	success: number
}

export const scrapeFromYoutubeVideo = async (query: string, ignoreId?: string, minDuration?: number, maxDuration?: number) => {
	let { videos } = await youtube.search(query, { type: 'video' });
	console.log("videos:")
	console.log(videos)

	if (minDuration && maxDuration) {
		videos = videos.filter(video => {
			if (!video.duration) return false
			const duration = convertTimerToSeconds(`${video.duration}`)

			return minDuration <= duration && duration <= maxDuration
		})
	}

	if (videos.length !== 0) {
		const video = videos[0].id !== ignoreId ? videos[0] : videos[1]

		return {
			...video,
			success: 1
		} as searchYoutubeVideoSchema
	} else {
		return {
			success: 0
		} as searchYoutubeVideoSchema
	}
}

// https://github.com/HermanFassett/youtube-scrape
