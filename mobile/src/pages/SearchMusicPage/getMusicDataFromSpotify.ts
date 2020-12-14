import spotifyApi, { spotifyApiTrackSearchResponseItems } from '../../services/spotifyApi'
import convertArtistsArrayToString from '../../utils/convertArtistsArrayToString'

export default async (query: string) => {
  try {
    const response: spotifyApiTrackSearchResponseItems = (await spotifyApi.get('search', {
      params: {
        q: encodeURI(query),
        type: 'track'
      }
    })).data

    const musicsData = response.tracks.items.map(item => {
      return {
        spotifyId: item.id,

        image: item.album.images.length > 0
          ? { uri: (item.album.images[1] || item.album.images[0]).url }
          : require('../../assets/graySquare.jpg'),

        title: item.name,
        artists: convertArtistsArrayToString(item.artists)
      }
    })

    if (musicsData.length === 0) {
      return {
        response: [],
        err: ['No tracks found']
      }
    } else {
      return {
        response: musicsData,
        err: []
      }
    }
  } catch (err) {
    try {
      return {
        response: [],
        err: ['Something went wrong!', `Spotify Api - ${err.response.data.error.message}`]
      }
    } catch (err) {
      return {
        response: [],
        err: ['Something went wrong!']
      }
    }
  }
}
