import youtubeIdsStorage from './youtubeIdsStorage'
import firebase from '../../services/firebase'
import youtubeApi, { searchYoutubeVideo, youtubeApiResponseItemsArrayItems } from '../../services/youtubeApi'
import { scrapeFromYoutubeVideo } from '../../services/youtubeScrape'

import createYoutubeQuery from '../../utils/createYoutubeQuery'

export interface getYoutubeUrlReturn {
  youtubeId: string,
  youtubeUrl: string,
  youtubeQuery: string,
  success: number
}

const main = async (spotifyId: string, title: string, artists: string) => {
	const youtubeQuery = createYoutubeQuery(artists, title)

	const storedYoutubeId = youtubeIdsStorage.getYoutubeId(spotifyId)

	if (storedYoutubeId) {
		return {
			youtubeId: storedYoutubeId,
			youtubeUrl: 'https://www.youtube.com/watch?v=' + storedYoutubeId,
			youtubeQuery: youtubeQuery,
			success: 1
		}
	}

	try {
		/*
     * Search the youtubeId on Firebase
    */

		const firebaseResponse = await firebase.getYoutubeId(spotifyId)

		if (firebaseResponse.val()) {
			youtubeIdsStorage.storeYoutubeId(spotifyId, firebaseResponse.val())

			return {
				youtubeId: firebaseResponse.val() as string,
				youtubeUrl: 'https://www.youtube.com/watch?v=' + firebaseResponse.val(),
				youtubeQuery: youtubeQuery,
				success: 1
			} as getYoutubeUrlReturn
		}

		/*
		 * Search for the video on internet
		*/

		let youtubeInfo: getYoutubeUrlReturn = {
			youtubeId: '',
			youtubeUrl: '',
			youtubeQuery: '',
			success: 0
		} as getYoutubeUrlReturn

		/*
		 * Search the youtubeQuery on Youtube (with scrape-youtube)
		*/

		try {
			const youtubeResponse = await scrapeFromYoutubeVideo(youtubeQuery)

			if (youtubeResponse.success === 1) {
				youtubeInfo = {
					youtubeId: youtubeResponse.video.id,
					youtubeQuery: youtubeQuery,
					youtubeUrl: 'https://www.youtube.com/watch?v=' + youtubeResponse.video.id,
					success: 1
				}
			}
		} catch (err) {
		}

		/*
     * Search the youtubeQuery on Youtube Api
    */

		if (!youtubeInfo.success) {
			const youtubeApiResponse = await searchYoutubeVideo(youtubeQuery)

			if (youtubeApiResponse.success === 1) {
				youtubeInfo = {
					youtubeId: youtubeApiResponse.id.videoId,
					youtubeQuery: youtubeQuery,
					youtubeUrl: 'https://www.youtube.com/watch?v=' + youtubeApiResponse.id.videoId,
					success: 1
				}
			}
		}

		/*
     * Save the youtubeId on Firebase
    */
		if (youtubeInfo.success === 1) {
			firebase.storeYoutubeId(spotifyId, youtubeInfo.youtubeId)
			youtubeIdsStorage.storeYoutubeId(spotifyId, youtubeInfo.youtubeId)
		}

		/*
		 * Return (error or success)
		*/

		return youtubeInfo
	} catch (err) {
		return {
			youtubeId: '',
			youtubeUrl: '',
			youtubeQuery: '',
			success: 0
		}
	}
}

export default main
