import spotifyApi from '../../../services/spotify/spotifyApi'

export default async (query: string) => {
  try {
    const response: SpotifyApi.PlaylistSearchResponse = (await spotifyApi.get('search', {
      params: {
        q: encodeURI(query),
        type: 'playlist'
      }
    })).data

    const playlistData = response.playlists.items.map(item => {
      return {
        spotifyId: item.id,

        image: item.images.length > 0
          ? { uri: (item.images[1] || item.images[0]).url }
          : require('../../../assets/graySquare.jpg'),

        name: item.name,
        owner: item.owner.display_name || 'Owner'
      }
    })

    if (playlistData.length === 0) {
      return {
        response: [],
        err: ['No playlists found']
      }
    } else {
      return {
        response: playlistData,
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
