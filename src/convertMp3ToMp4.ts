import ffmpeg from 'fluent-ffmpeg'
import { Readable } from 'stream'

import { ffmpegPath, ffprobePath } from './SpotHackVariables.json'

const convertMp3ToMp4 = (video: Readable, pathToSaveFile: string, musicFilename: string) => {
  try {
    ffmpeg()
      .setFfmpegPath(ffmpegPath)
      .setFfprobePath(ffprobePath)
      .input(video)
      .output(`${pathToSaveFile}/${musicFilename}.mp3`)
      .run()

    return 1
  } catch (err) {
    console.log('\n\n\n*** convertMp3ToMp4 Error ***\n\n===\n')
    console.warn(err)
    console.log('\n\n\n')

    return 0
  }
}

export default convertMp3ToMp4
