import youtubeApi from './services/youtubeApi'
import { youtubeApiKey } from './SpotHackVariables.json'

// return object interfaces

import { musicDataSchema } from './index'

// youtubeApi interfaces

interface youtubeApiResponseItemsArrayItems {
  kind: string,
  etag: string,
  id: { kind: string, videoId: string }
}

interface youtubeApiResponseItemsArray extends Array<youtubeApiResponseItemsArrayItems> {}

interface youtubeApiResponse {
  data: {
    kind: string,
    etag: string,
    nextPageToken: string,
    regionCode: string,
    pageInfo: { totalResults: number, resultsPerPage: number },
    items: youtubeApiResponseItemsArray
  }
}

const searchVideoOnYoutube = async (musicData: musicDataSchema) => {
  try {
    const { data }: youtubeApiResponse = await youtubeApi(`/search?q=${musicData.youtubeQuerySearch}&maxResults=1&key=${youtubeApiKey}`)

    /* const { data }: youtubeApiResponse = {
      data: {
        kind: 'youtube#searchListResponse',
        etag: '_qJeAABqybSpab4uckr0twuHy-g',
        nextPageToken: 'CAEQAA',
        regionCode: 'PT',
        pageInfo: { totalResults: 396807, resultsPerPage: 1 },
        items: [
          {
            kind: 'youtube#searchResult',
            etag: '_F8ZYdUongVY2ybUEElAolRXavI',
            id: { kind: 'youtube#video', videoId: 'PDeTO26fRVQ' }
          }
        ]
      }
    } */

    const musicYoutubeData: musicDataSchema = {
      ...musicData,

      youtubeId: data.items[0].id.videoId,
      youtubeQuerySearch: musicData.youtubeQuerySearch
    }

    return musicYoutubeData
  } catch (err) {
    console.log('\n\n\n*** searchVideoOnYoutube Error ***\n\n===\n')
    console.warn(err)
    if (err.response) {
      console.log('\n\n\nResponse: \n')
      console.log(err.response)
    }
    console.log('\n\n****************\n\n\n')

    return 0
  }
}

export default searchVideoOnYoutube
