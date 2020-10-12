import db from './database/connection'

// return object interfaces

import { musicDataSchema } from './index'

const searchVideoOnDB = async (spotifyId: string) => {
  try {
    const musicDataOnDB = await db('musics')
      .select('*')
      .where('musicSpotifyId', '=', spotifyId)

    if (musicDataOnDB.length > 1) {
      console.log('\n\n\n*** searchVideoOnDB Error ***\n\n===\n')
      console.warn('DB have more than 1 raw with this spotifyId')
      console.log('\n\n\n')

      return 0
    } else if (musicDataOnDB.length === 0) {
      return 0
    }

    const musicYoutubeData: musicDataSchema = {
      name: musicDataOnDB[0].name,
      spotifyId: musicDataOnDB[0].musicSpotifyId,
      artists: JSON.parse(musicDataOnDB[0].artists),
      youtubeId: musicDataOnDB[0].youtubeId,
      youtubeQuerySearch: musicDataOnDB[0].youtubeQuerySearch,
      video: null
    }

    return musicYoutubeData
  } catch (err) {
    console.log('\n\n\n*** searchVideoOnDB Error ***\n\n===\n')
    console.warn(err)
    console.log('\n\n****************\n\n\n')

    return 0
  }
}

export default searchVideoOnDB
