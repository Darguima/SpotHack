/* eslint-disable camelcase */
import axios from 'axios'

interface searchYoutubeVideoResponse {
	uploader: {
		url: string,
		username: string,
		verified: boolean
	},
	video: {
		duration: string,
		id: string,
		snippet: string,
		thumbnail_src: string,
		title: string,
		upload_date: string,
		url: string,
		views: string
	}
}

interface searchYoutubeVideoSchema extends searchYoutubeVideoResponse {
	success: number
}

const youtubeScrape = axios.create(
	{
		baseURL: 'http://youtube-scrape.herokuapp.com/api'
	}
)

export const scrapeFromYoutubeVideo = async (q: string, ignoreId?: string) => {
	const { data } = await youtubeScrape.get('search', {
		params: {
			q
		}
	})

	const { results } : {results: Array<searchYoutubeVideoResponse>} = data

	if (results.length !== 0) {
		const video = results[0].video.id !== ignoreId ? results[0] : results[1]

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

export default youtubeScrape

// https://github.com/HermanFassett/youtube-scrape