import AsyncStorage from '@react-native-community/async-storage'

class YoutubeIdsStorage {
  private storagedYoutubeIds: {[key: string]: string} = {}

  constructor () {
    (async () => { this.storagedYoutubeIds = JSON.parse(await AsyncStorage.getItem('storedYoutubeIds') || '{}') })()
  }

  getYoutubeIds () {
    return this.storagedYoutubeIds
  }

  getYoutubeId (spotifyId: string) {
    return this.storagedYoutubeIds[spotifyId]
  }

  storeYoutubeId (spotifyId: string, youtubeId: string) {
    AsyncStorage.setItem('storedYoutubeIds', JSON.stringify({ ...this.storagedYoutubeIds, [spotifyId]: youtubeId }))
    this.storagedYoutubeIds[spotifyId] = youtubeId
  }
}

const youtubeIdsStorage = new YoutubeIdsStorage()

export default youtubeIdsStorage
