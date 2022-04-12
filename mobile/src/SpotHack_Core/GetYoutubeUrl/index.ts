import youtubeIdsStorage from './youtubeIdsStorage'
import { searchYoutubeVideo } from '../../services/youtubeApi'
import { scrapeFromYoutubeVideo } from '../../services/youtubeScrape'

import createYoutubeQuery from '../../utils/createYoutubeQuery'

import downloadMachine from '../DownloadMachine'

export interface youtubeIdsSchema {
	[key: string]: string,
	ytFirstVideoOnSearch: string,
	ytLyricsVideo: string
}

export type infoSourceIcon = 'error' | 'asyncStorage' | 'ytScrape' | 'ytApi'

export interface getYoutubeUrlReturn {
	youtubeId: youtubeIdsSchema,
	youtubeQuery: string,
	success: number,
	infoSourceIcon: infoSourceIcon
}

const main = async (
	spotifyId: string, title: string, artists: string, youtubeQuery?: string,
	spotifyDurationSec?: number
) => {
	if (!youtubeQuery) { youtubeQuery = createYoutubeQuery(artists, title) }

	const storedYoutubeIds = youtubeIdsStorage.getYoutubeId(spotifyId)

	if (storedYoutubeIds) {
		return {
			youtubeId: storedYoutubeIds,
			youtubeQuery: youtubeQuery,
			success: 1,
			infoSourceIcon: 'asyncStorage'
		} as getYoutubeUrlReturn
	}

	try {
		/*
		 * Search for the video on internet
		*/

		let youtubeInfo: getYoutubeUrlReturn = {
			youtubeId: {
				ytFirstVideoOnSearch: '',
				ytLyricsVideo: ''
			},
			youtubeQuery: '',
			success: 0,
			infoSourceIcon: 'error'
		}

		let minDuration: number | undefined
		let maxDuration: number | undefined
		if (spotifyDurationSec) {
			minDuration = spotifyDurationSec * (1 - downloadMachine.musicTimeLimit)
			maxDuration = spotifyDurationSec * (1 + downloadMachine.musicTimeLimit)
		}

		/*
		 * Search the youtubeQuery on Youtube (with scrape-youtube)
		*/

		try {
			const ytResponse1stVideoOnSearch = await scrapeFromYoutubeVideo(
				youtubeQuery,
				undefined,
				minDuration,
				maxDuration
			)
			const ytResponseLyricsVideo = await scrapeFromYoutubeVideo(
				youtubeQuery + ' lyrics',
				ytResponse1stVideoOnSearch.video.id || '',
				minDuration,
				maxDuration
			)

			if (ytResponse1stVideoOnSearch.success === 1 && ytResponseLyricsVideo.success === 1) {
				youtubeInfo = {
					youtubeId: {
						ytFirstVideoOnSearch: ytResponse1stVideoOnSearch.video.id,
						ytLyricsVideo: ytResponseLyricsVideo.video.id
					},
					youtubeQuery: youtubeQuery,
					success: 1,
					infoSourceIcon: 'ytScrape'
				}
			}
		} catch (err) {
		}

		/*
		 * Search the youtubeQuery on Youtube Api
		*/

		if (!youtubeInfo.success) {
			const ytApiResponse1stVideoOnSearch = await searchYoutubeVideo(youtubeQuery)
			const ytApiResponseLyricsVideo = await searchYoutubeVideo(youtubeQuery + ' lyrics', ytApiResponse1stVideoOnSearch.id.videoId || '')

			if (ytApiResponse1stVideoOnSearch.success === 1 && ytApiResponseLyricsVideo.success === 1) {
				youtubeInfo = {
					youtubeId: {
						ytFirstVideoOnSearch: ytApiResponse1stVideoOnSearch.id.videoId,
						ytLyricsVideo: ytApiResponseLyricsVideo.id.videoId
					},
					youtubeQuery: youtubeQuery,
					success: 1,
					infoSourceIcon: 'ytApi'
				}
			}
		}

		/*
		 * Save the youtubeId on Async Storage
		*/
		if (youtubeInfo.success === 1) {
			youtubeIdsStorage.storeYoutubeId(spotifyId, youtubeInfo.youtubeId)
		}

		/*
		 * Return (error or success)
		*/

		return youtubeInfo as getYoutubeUrlReturn
	} catch (err) {
		const musicError: getYoutubeUrlReturn = {
			youtubeId: {
				ytFirstVideoOnSearch: '',
				ytLyricsVideo: ''
			},
			youtubeQuery: '',
			success: 0,
			infoSourceIcon: 'error'
		}

		return musicError
	}
}

export default main
