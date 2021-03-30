import youtubeIdsStorage from './youtubeIdsStorage'
import firebase from '../../services/firebase'
import { searchYoutubeVideo } from '../../services/youtubeApi'
import { scrapeFromYoutubeVideo } from '../../services/youtubeScrape'

import createYoutubeQuery from '../../utils/createYoutubeQuery'

export interface youtubeIdsSchema {
	ytFirstVideoOnSearch: string,
	ytLyricsVideo: string
}

export interface getYoutubeUrlReturn {
	youtubeId: youtubeIdsSchema,
	youtubeQuery: string,
	success: number,
	infoSourceIcon: 'error' | 'asyncStorage' | 'firebase' | 'ytScrape' | 'ytApi'
}

const main = async (spotifyId: string, title: string, artists: string) => {
	const youtubeQuery = createYoutubeQuery(artists, title)

	const storedYoutubeIds = youtubeIdsStorage.getYoutubeId(spotifyId)

	if (storedYoutubeIds) {
		return {
			youtubeId: storedYoutubeIds,
			youtubeQuery: youtubeQuery,
			success: 1,
			infoSourceIcon: 'asyncStorage'
		} as getYoutubeUrlReturn
	}

	/*
	* Search the youtubeId on Firebase
	*/

	try {
		const firebaseResponse = await firebase.getYoutubeId(spotifyId)

		if (firebaseResponse.val()) {
			const firebaseMusicInfo = JSON.parse(firebaseResponse.val()) as youtubeIdsSchema

			youtubeIdsStorage.storeYoutubeId(spotifyId, firebaseMusicInfo)

			return {
				youtubeId: firebaseMusicInfo,
				youtubeQuery: youtubeQuery,
				success: 1,
				infoSourceIcon: 'firebase'
			} as getYoutubeUrlReturn
		}

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

		/*
		 * Search the youtubeQuery on Youtube (with scrape-youtube)
		*/

		try {
			const ytResponse1stVideoOnSearch = await scrapeFromYoutubeVideo(youtubeQuery)
			const ytResponseLyricsVideo = await scrapeFromYoutubeVideo(youtubeQuery + ' lyrics', ytResponse1stVideoOnSearch.video.id || '')

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
		 * Save the youtubeId on Firebase and Async Storage
		*/
		if (youtubeInfo.success === 1) {
			firebase.storeYoutubeId(spotifyId, JSON.stringify(youtubeInfo.youtubeId))
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
