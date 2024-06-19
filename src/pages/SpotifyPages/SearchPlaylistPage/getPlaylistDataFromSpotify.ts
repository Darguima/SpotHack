import spotifyApi from '../../../services/spotify/spotifyApi';

export default async (
  query: string,
  offset: number,
  offsetIncrease: number,
) => {
  try {
    const response: SpotifyApi.PlaylistSearchResponse = (
      await spotifyApi.get('search', {
        params: {
          q: encodeURI(query),
          type: 'playlist',
          offset,
          limit: offsetIncrease,
        },
      })
    ).data;

    const playlistData = response.playlists.items.map(item => {
      return {
        spotifyId: item.id,

        image:
          item.images.length > 0
            ? {uri: (item.images[1] || item.images[0]).url}
            : require('../../../assets/graySquare.jpg'),

        name: item.name,
        owner: item.owner.display_name || 'Owner',
      };
    });

    if (playlistData.length === 0) {
      return {
        response: [],
        err: ['No playlists found'],
      };
    } else {
      return {
        response: playlistData,
        err: [],
      };
    }
  } catch (err: any) {
    const errors = ['Something went wrong!'];

    if (
      err &&
      err.response &&
      err.response.data &&
      err.response.data.error &&
      err.response.data.error.message
    ) {
      errors.push(`Spotify Api - ${err.response.data.error.message}`);
    }

    return {
      response: [],
      err: errors,
    };
  }
};
