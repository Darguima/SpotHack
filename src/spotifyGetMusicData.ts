/* eslint-disable camelcase */
import spotifyApi from './services/spotifyApi'

/*

* https://open.spotify.com/track/6y6jbcPG4Yn3Du4moXaenr?si=P1uxKL3HQmaPAEiEFUJyMA
* MusicId: 6y6jbcPG4Yn3Du4moXaenr

*/

// spotifyApi interfaces

interface spotifyApiResponseArtistsArrayItems {
  external_urls: {
    spotify: string
  },
  href: string,
  id: string,
  name: string,
  type: string,
  uri: string
}

interface spotifyApiResponseArtistsArray extends Array<spotifyApiResponseArtistsArrayItems> {}

interface spotifyApiResponseImagesArrayItems {
  height: number,
  url: string,
  width: number
}

interface spotifyApiResponseImagesArray extends Array<spotifyApiResponseImagesArrayItems> {}

export interface spotifyApiForMusicResponseItems {
  album: {
    album_type: string,
    artists: spotifyApiResponseArtistsArray,
    available_markets: Array<string>,
    external_urls: {
      spotify: string
    },
    href: string,
    id: string,
    images: spotifyApiResponseImagesArray,
    name: string,
    release_date: string,
    release_date_precision: string,
    total_tracks: number,
    type: string,
    uri: string
  },

  artists: spotifyApiResponseArtistsArray,
  available_markets: Array<string>,
  disc_number: number,
  duration_ms: number,
  explicit: boolean,
  external_ids: {
    isrc: string
  },
  external_urls: {
    spotify: string
  },
  href: string,
  id: string,
  is_local: boolean,
  is_playable: boolean,
  name: string,
  popularity: number,
  preview_url: string,
  track_number: number,
  type: string,
  uri: string,
}

interface spotifyApiForMusicResponse {
  data: spotifyApiForMusicResponseItems
}

// return object interfaces

interface musicDataSchemaArtistsArrayItems {
  id: string,
  name: string,
}

interface musicDataSchemaArtistsArray extends Array<musicDataSchemaArtistsArrayItems> {}

export interface musicDataSchema {
  artists: musicDataSchemaArtistsArray,
  name: string
  id: string
}

export interface musicsDataSchema extends Array<musicDataSchema> {}

const spotifyGetMusicData = async (musicId: string) => {
  try {
    const { data }: spotifyApiForMusicResponse = await spotifyApi.get(`/v1/tracks/${musicId}`)

    const musicData: musicsDataSchema = [{
      name: data.name,
      id: data.id,
      artists: []
    }]

    data.artists.map(item => (
      musicData[0].artists.push({ name: item.name, id: item.id })
    ))

    return musicData
  } catch (err) {
    console.log('\n\n\n*** spotifyGetMusicData Error ***\n\n===\n')
    console.warn(err)
    if (err.response) {
      console.log('\n\n\nResponse: \n')
      console.log(err.response)
    }
    console.log('\n\n\n')

    return 0
  }
}

export default spotifyGetMusicData
