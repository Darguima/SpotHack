import axios from 'axios'
import youtubeApiCredentials from './youtubeApiCredentials.json'

export interface youtubeApiResponseItemsArrayItems {
  kind: string,
  etag: string,
  id: { kind: string, videoId: string }
}

export interface youtubeApiResponseItems {
  kind: string,
  etag: string,
  nextPageToken: string,
  regionCode: string,
  pageInfo: { totalResults: number, resultsPerPage: number },
  items: Array<youtubeApiResponseItemsArrayItems>
}

export interface youtubeApiResponse {
  data: youtubeApiResponseItems
}

export interface searchYoutubeVideoSchema extends youtubeApiResponseItemsArrayItems {
  success: number
}

const youtubeApi = axios.create(
	{
		baseURL: 'https://www.googleapis.com/youtube/v3/',
		params: {
			key: youtubeApiCredentials.key
		}
	}
)

export const searchYoutubeVideo = async (q: string) => {
	const youtubeApiResponse: Array<youtubeApiResponseItemsArrayItems> = (await youtubeApi.get('/search', {
		params: {
			q,
			maxResults: 1
		}
	})).data.items

	if (youtubeApiResponse.length === 0) {
		return {
			success: 0
		} as searchYoutubeVideoSchema
	} else {
		return {
			...youtubeApiResponse[0],
			success: 1
		} as searchYoutubeVideoSchema
	}
}

export default youtubeApi

// https://developers.google.com/youtube/v3/docs
// https://developers.google.com/youtube/v3/docs/search/list#usage
