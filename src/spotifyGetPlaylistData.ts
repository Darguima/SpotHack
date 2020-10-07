/* eslint-disable camelcase */
import spotifyApi from '../services/spotifyApi'
import { spotifyApiForMusicResponseItems } from './spotifyGetMusicData'

/*

* https://open.spotify.com/playlist/1KMED7A9s0tsRy8UMAAY0Y?si=bepyJxvfSgyv5XVnwL2loA
* PlaylistId: 1KMED7A9s0tsRy8UMAAY0Y

*/

import { exit } from 'process'

// spotifyApi interfaces

interface spotifyApiForPlaylistResponseTracksArrayItems {
  added_at: string,
  added_by: {
    external_urls: {
      spotify: string,
    },
    href: string,
    id: string,
    type: string,
    uri: string,
  },
  is_local: false,
  primary_color: null,
  track: spotifyApiForMusicResponseItems,
  video_thumbnail: {
    url: null
  }
}

interface spotifyApiForPlaylistResponseTracksArray extends Array<spotifyApiForPlaylistResponseTracksArrayItems> {}

interface spotifyApiForPlaylistResponseItems {
  collaborative: false,
  description: string,
  external_urls: {
    spotify: string
  },
  followers: {
    href: null,
    total: number
  },
  href: string,
  id: string,
  images: [
    {
      height: null,
      url: string,
      width: null
    }
  ],
  name: string,
  owner: {
    display_name: string,
    external_urls: {
      spotify: string
    },
    href: string,
    id: string,
    type: string,
    uri: string
  },
  primary_color: null,
  public: false,
  snapshot_id: string,

  tracks: {
    href: string,
    items: spotifyApiForPlaylistResponseTracksArray,
    limit: number,
    next: null,
    offset: number,
    previous: null,
    total: number
  },

  type: string,
  uri: string
}

interface spotifyApiForPlaylistResponse {
  data: spotifyApiForPlaylistResponseItems,
}

// return object interfaces

interface musicDataSchemaArtistsArrayItems {
  id: string,
  name: string,
}

interface musicDataSchemaArtistsArray extends Array<musicDataSchemaArtistsArrayItems> {}

interface musicsDataSchemaItems {
  artists: musicDataSchemaArtistsArray,
  name: string
  id: string
}

export interface musicsDataSchema extends Array<musicsDataSchemaItems> {}

const spotifyGetPlaylistData = async (playlistId: string) => {
  try {
    const { data }: spotifyApiForPlaylistResponse = await spotifyApi.get(`/v1/playlists/${playlistId}`)

    const musicsData: musicsDataSchema = []

    data.tracks.items.map(item => {
      const musicData: musicsDataSchemaItems = {
        name: item.track.name,
        id: item.track.id,
        artists: []
      }

      item.track.artists.map(item => (
        musicData.artists.push({ name: item.name, id: item.id })
      ))

      return musicsData.push(musicData)
    })

    return musicsData
  } catch (err) {
    console.log('\n\n\n*** spotifyGetPlaylistData Error ***\n\n===\n')
    console.warn(err)
    if (err.response) {
      console.log('\n\n\nResponse: \n')
      console.log(err.response)
    }
    console.log('\n\n\n')

    exit()
  }
}

export default spotifyGetPlaylistData
