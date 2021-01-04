import firebase from 'firebase'
import 'firebase/database'
import { LogBox } from 'react-native'

import firebaseConfig from './firebaseConfig.json'

class Firebase {
  database: firebase.database.Database

  constructor () {
    firebase.initializeApp(firebaseConfig)

    this.database = firebase.database()

    LogBox.ignoreLogs(['Setting a timer'])
  }

  // Get Youtube Id
  async getYoutubeId (spotifyId: string) {
    return firebase.database().ref(spotifyId).once('value').then(snapshot => snapshot)
  }

  async storeYoutubeId (spotifyId: string, youtubeId: string) {
    return firebase.database().ref(spotifyId).set(youtubeId).then(snapshot => snapshot)
  }
}

const fire = new Firebase()

export default fire
