import AsyncStorage from '@react-native-community/async-storage';
import {youtubeIdsSchema} from '.';

class YoutubeIdsStorage {
  private storedYoutubeIds: {
    [key: string]: youtubeIdsSchema;
  } = {};

  constructor() {
    (async () => {
      this.storedYoutubeIds = JSON.parse(
        (await AsyncStorage.getItem('storedYoutubeIds')) || '{}',
      );
    })();
  }

  getYoutubeIds() {
    return this.storedYoutubeIds;
  }

  getYoutubeId(spotifyId: string) {
    return this.storedYoutubeIds[spotifyId] as youtubeIdsSchema | undefined;
  }

  storeYoutubeId(spotifyId: string, youtubeIds: youtubeIdsSchema) {
    AsyncStorage.setItem(
      'storedYoutubeIds',
      JSON.stringify({...this.storedYoutubeIds, [spotifyId]: youtubeIds}),
    );
    this.storedYoutubeIds[spotifyId] = youtubeIds;
  }
}

const youtubeIdsStorage = new YoutubeIdsStorage();

export default youtubeIdsStorage;
