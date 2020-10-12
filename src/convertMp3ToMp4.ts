import ffmpeg from 'fluent-ffmpeg'
import { ffmpegPath, ffprobePath } from './SpotHackVariables.json'

import { musicDataSchema } from './index'

const convertMp3ToMp4 = (musicData: musicDataSchema, pathToSaveFile: string, musicFilename: string) => {
  ffmpeg()
    .setFfmpegPath(ffmpegPath)
    .setFfprobePath(ffprobePath)
    .input(musicData.video)
    .output(`${pathToSaveFile}/${musicFilename}.mp3`)

    .on('end', () => {
      console.log('\n\n\nConversion Successful: ' + musicData.youtubeQuerySearch)
    })
    .on('error', err => {
      console.log('\n\n\n*** convertMp3ToMp4 Error ***\n\n===\n')
      console.warn(err)
      console.log('\n\n****************\n\n\n')
    })

    .run()
}

export default convertMp3ToMp4
