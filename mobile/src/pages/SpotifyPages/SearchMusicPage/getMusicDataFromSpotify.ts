import spotifyApi from '../../../services/spotify/spotifyApi'
import convertArtistsArrayToString from '../../../utils/convertArtistsArrayToString'

export default async (query: string, offset: number, offsetAccount: number) => {
	try {
		const response: SpotifyApi.TrackSearchResponse = (await spotifyApi.get('search', {
			params: {
				q: encodeURI(query),
				type: 'track',
				offset,
				limit: offsetAccount
			}
		})).data

		const musicsData = response.tracks.items.map(item => {
			return {
				spotifyId: item.id,

				image: item.album.images.length > 0
					? { uri: (item.album.images[1] || item.album.images[0]).url }
					: require('../../../assets/graySquare.jpg'),

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
	} catch (err: any) {
		const errors = ['Something went wrong!']

		if (err && err.response && err.response.data && err.response.data.error && err.response.data.error.message) {
			errors.push(`Spotify Api - ${err.response.data.error.message}`)
		}

		return {
			response: [],
			err: errors
		}
	}
}
