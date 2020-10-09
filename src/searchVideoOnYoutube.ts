import youtubeApi from './services/youtubeApi'
import { youtubeApiKey } from './YoutubeApiKey.json'

import { musicDataSchema } from './spotifyGetMusicData'

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

// return object interfaces

interface musicYoutubeDataSchemaArtistsArrayItems {
  spotifyId: string,
  name: string,
}

interface musicYoutubeDataSchemaArtistsArray extends Array<musicYoutubeDataSchemaArtistsArrayItems> {}

export interface musicYoutubeDataSchema {
  name: string,
  spotifyId: string,
  artists: musicYoutubeDataSchemaArtistsArray,
  youtubeVideoId: string,
  youtubeQuerySearch: string
}

const searchVideoOnYoutube = async (musicData: musicDataSchema) => {
  try {
    let querySearch = musicData.name + ' - '

    musicData.artists.map(item => (querySearch += item.name))

    // const { data }: youtubeApiResponse = await youtubeApi(`/search?q=${querySearch}&maxResults=1&key=${youtubeApiKey}`)

    const { data }: youtubeApiResponse = {
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
    }

    const musicYoutubeData: musicYoutubeDataSchema = {
      name: musicData.name,
      spotifyId: musicData.id,
      artists: [],
      youtubeVideoId: data.items[0].id.videoId,
      youtubeQuerySearch: querySearch
    }

    musicData.artists.map(item => (
      musicYoutubeData.artists.push({
        name: item.name,
        spotifyId: item.id
      })
    ))

    return musicYoutubeData
  } catch (err) {
    console.log('\n\n\n*** searchVideoOnYoutube Error ***\n\n===\n')
    console.warn(err)
    if (err.response) {
      console.log('\n\n\nResponse: \n')
      console.log(err.response)
    }
    console.log('\n\n\n')

    return 0
  }
}

export default searchVideoOnYoutube
