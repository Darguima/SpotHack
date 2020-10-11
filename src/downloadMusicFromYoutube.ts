import ytdl from 'ytdl-core'
// https://github.com/fent/node-ytdl-core

import { musicYoutubeDataSchema } from './searchVideoOnYoutube'

const downloadMusicFromYoutube = (musicYoutubeData: musicYoutubeDataSchema) => {
  try {
    return ytdl(
      `https://www.youtube.com/watch?v=${musicYoutubeData.youtubeVideoId}`,
      {
        filter: 'audioonly'
      }
    )
  } catch (err) {
    console.log('\n\n\n*** downloadMusicFromYoutube Error ***\n\n===\n')
    console.warn(err)
    console.log('\n\n\n')

    return 0
  }
}

export default downloadMusicFromYoutube
