import ytdl from 'ytdl-core'
import fs from 'fs'
// https://github.com/fent/node-ytdl-core

import { musicYoutubeDataSchema } from './searchVideoOnYoutube'

const downloadMusicFromYoutube = (musicYoutubeData: musicYoutubeDataSchema, pathToSaveFile: string) => {
  try {
    ytdl(
      `https://www.youtube.com/watch?v=${musicYoutubeData.youtubeVideoId}`,
      {
        filter: 'audioonly'
      }
    ).pipe(fs.createWriteStream(`${pathToSaveFile}/${musicYoutubeData.youtubeQuerySearch}.mp3`))

    return 1
  } catch (err) {
    console.log('\n\n\n*** downloadMusicFromYoutube Error ***\n\n===\n')
    console.warn(err)
    console.log('\n\n\n')

    return 0
  }
}

export default downloadMusicFromYoutube
