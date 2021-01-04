import youtubeApi, { youtubeApiResponseItemsArrayItems } from '../../services/youtube'
import firebase from '../../services/firebase'
import youtubeIdsStorage from './youtubeIdsStorage'

const main = async (spotifyId: string, title: string, artists: string) => {
  const youtubeQuery = artists + ' - ' + title

  const storagedYoutubeId = youtubeIdsStorage.getYoutubeId(spotifyId)

  if (storagedYoutubeId) {
    return {
      youtubeId: storagedYoutubeId,
      youtubeUrl: 'https://www.youtube.com/watch?v=' + storagedYoutubeId,
      youtubeQuery: youtubeQuery,
      success: 1
    }
  }

  try {
    /*
     * Search the youtubeId on Firebase
    */

    const firebaseResponse = await firebase.getYoutubeId(spotifyId)

    if (firebaseResponse.val()) {
      youtubeIdsStorage.storeYoutubeId(spotifyId, firebaseResponse.val())

      return {
        youtubeId: firebaseResponse.val(),
        youtubeUrl: 'https://www.youtube.com/watch?v=' + firebaseResponse.val(),
        youtubeQuery: youtubeQuery,
        success: 1
      }
    }

    /*
     * Search the youtubeId on Youtube Api
    */

    const youtubeApiResponse: Array<youtubeApiResponseItemsArrayItems> = (await youtubeApi.get('/search', {
      params: {
        q: youtubeQuery,
        maxResults: 1
      }
    })).data.items

    if (youtubeApiResponse.length === 0) {
      return {
        youtubeId: '',
        youtubeUrl: '',
        youtubeQuery: '',
        success: 0
      }
    }

    /*
     * Save the youtubeId on Firebase
    */
    firebase.storeYoutubeId(spotifyId, youtubeApiResponse[0].id.videoId)
    youtubeIdsStorage.storeYoutubeId(spotifyId, youtubeApiResponse[0].id.videoId)

    return {
      youtubeId: youtubeApiResponse[0].id.videoId,
      youtubeUrl: 'https://www.youtube.com/watch?v=' + youtubeApiResponse[0].id.videoId,
      youtubeQuery: youtubeQuery,
      success: 1
    }
  } catch (err) {
    return {
      youtubeId: '',
      youtubeUrl: '',
      youtubeQuery: '',
      success: 0
    }
  }
}

export default main
