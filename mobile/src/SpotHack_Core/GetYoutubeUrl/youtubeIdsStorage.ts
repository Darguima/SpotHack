import AsyncStorage from '@react-native-community/async-storage'

class YoutubeIdsStorage {
private storedYoutubeIds: {[key: string]: string} = {}

constructor () {
	(async () => { this.storedYoutubeIds = JSON.parse(await AsyncStorage.getItem('storedYoutubeIds') || '{}') })()
}

getYoutubeIds () {
	return this.storedYoutubeIds
}

getYoutubeId (spotifyId: string) {
	return this.storedYoutubeIds[spotifyId]
}

storeYoutubeId (spotifyId: string, youtubeId: string) {
	AsyncStorage.setItem('storedYoutubeIds', JSON.stringify({ ...this.storedYoutubeIds, [spotifyId]: youtubeId }))
	this.storedYoutubeIds[spotifyId] = youtubeId
}
}

const youtubeIdsStorage = new YoutubeIdsStorage()

export default youtubeIdsStorage
