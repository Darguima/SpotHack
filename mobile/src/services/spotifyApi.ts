/* eslint-disable camelcase */
import axios from 'axios'

// spotifyApi interfaces

export interface spotifyApiUserDataResponseItems {
  country: string,
  display_name: string,
  explicit_content: {
    filter_enabled: boolean,
    filter_locked: boolean,
  },
  external_urls: {
    spotify: string,
  },
  followers: {
    href: null,
    total: 0,
  },
  href: string,
  id: string,
  images: Array<{width: null | any, height: null | any, url: string}>,
  product: string,
  type: string,
  uri: string,

}

export interface spotifyApiUserDataResponse {
  data: spotifyApiUserDataResponseItems
}

export interface spotifyApiResponseArtistsArrayItems {
  external_urls: {
    spotify: string
  },
  href: string,
  id: string,
  name: string,
  type: string,
  uri: string
}

export interface spotifyApiResponseArtistsArray extends Array<spotifyApiResponseArtistsArrayItems> {}

export interface spotifyApiResponseImagesArrayItems {
  height: number,
  url: string,
  width: number
}

export interface spotifyApiResponseImagesArray extends Array<spotifyApiResponseImagesArrayItems> {}

export interface spotifyApiTrackResponseItems {
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

export interface spotifyApiTrackResponse {
  data: spotifyApiTrackResponseItems
}

export interface spotifyApiTrackSearchResponseItems {
  tracks: {
    href: string,
    items: Array<spotifyApiTrackResponseItems>,
    limit: number,
    next: string,
    offset: number,
    previous: any | any,
    total: number,
  }
}

export interface spotifyApiTrackSearchResponse {
  data: spotifyApiTrackSearchResponseItems
}

export interface spotifyApiPlaylistResponseTracksArrayItems {
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
  is_local: boolean,
  primary_color: any,
  track: spotifyApiTrackResponseItems,
  video_thumbnail: {
    url: any
  }
}

export interface spotifyApiPlaylistResponseTracksArray extends Array<spotifyApiPlaylistResponseTracksArrayItems> {}

export interface spotifyApiPlaylistResponseItems {
  collaborative: boolean,
  description: string,
  external_urls: {
    spotify: string
  },
  followers: {
    href: any,
    total: number
  },
  href: string,
  id: string,
  images: Array<{ height: any, url: string, width: any }>,
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
  primary_color: any,
  public: boolean,
  snapshot_id: string,

  tracks: {
    href: string,
    items: spotifyApiPlaylistResponseTracksArray,
    limit: number,
    next: any,
    offset: number,
    previous: any,
    total: number
  },

  type: string,
  uri: string
}

export interface spotifyApiPlaylistResponse {
  data: spotifyApiPlaylistResponseItems,
}

export interface spotifyApiPlaylistsResponseItemsArrayItems {
  collaborative: boolean,
  description: string,
  external_urls: {
    spotify: string,
  },
  href: string,
  id: string,
  images: Array<{
    height: any,
    url: string,
    width: any
  }>,
  name: string,
  owner: {
    display_name: string,
    external_urls: {
      spotify: string,
    },
    href: string,
    id: string,
    type: string,
    uri: string,
  },
  primary_color: any,
  public: boolean,
  snapshot_id: string,
  tracks: {
    href: string,
    total: number,
  },
  type: string,
  uri: string,
}

export interface spotifyApiPlaylistsResponseItems {
  href: string,
  items: Array<spotifyApiPlaylistsResponseItemsArrayItems>,

  limit: number,
  next: any,
  offset: number,
  previous: any,
  total: number,
}

export interface spotifyApiPlaylistsResponse {
  data: spotifyApiPlaylistsResponseItems,
}

export interface spotifyApiArtistsResponseItems {
  external_urls: {
    spotify: string,
  },
  followers: {
    href: any,
    total: number,
  },
  genres: Array <string>,
  href: string,
  id: string,
  images: Array <{ height: number, url: string, width: number}>,
  name: string,
  popularity: number,
  type: string,
  uri: string,
}

export interface spotifyApiArtistsResponse {
  data: spotifyApiArtistsResponseItems,
}

const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1'
})

/*
A spotifyApi.interceptors.response is added on src/contexts/auth.tsx
The interceptor is added to redresh the token every time that it expire

The Authentication Header is added on src/contexts/auth.tsx
*/

export default spotifyApi
