import axios from 'axios'
import youtubeApiCredentials from './youtubeApiCredentials.json'

// spotifyApi interfaces

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

const youtubeApi = axios.create(
  {
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    params: {
      key: youtubeApiCredentials.key
    }
  }
)

export default youtubeApi

// https://developers.google.com/youtube/v3/docs
// https://developers.google.com/youtube/v3/docs/search/list#usage
