import db from './database/connection'

import { musicYoutubeDataSchema } from './searchVideoOnYoutube'

const recordMusicDataInDB = async (musicYoutubeData: musicYoutubeDataSchema) => {
  try {
    await db('musics')
      .insert({
        musicSpotifyId: musicYoutubeData.spotifyId,
        name: musicYoutubeData.name,
        artists: JSON.stringify(musicYoutubeData.artists),
        youtubeId: musicYoutubeData.youtubeVideoId,
        youtubeQuerySearch: musicYoutubeData.youtubeQuerySearch
      })

    return 1
  } catch (err) {
    console.log('\n\n\n*** recordMusicDataInDB Error ***\n\n===\n')
    console.warn(err)
    console.log('\n\n\n')

    return 0
  }
}

export default recordMusicDataInDB
