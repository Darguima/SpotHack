import ytdl from 'ytdl-core'
// https://github.com/fent/node-ytdl-core

import { musicDataSchema } from './index'

const downloadMusicFromYoutube = (musicYoutubeData: musicDataSchema) => {
  try {
    console.log(musicYoutubeData)
    return ytdl(
      musicYoutubeData.youtubeId,
      {
        filter: 'audioonly'
      }
    )
  } catch (err) {
    console.log('\n\n\n*** downloadMusicFromYoutube Error ***\n\n===\n')
    console.warn(err)
    console.log('\n\n****************\n\n\n')

    return 0
  }
}

export default downloadMusicFromYoutube
