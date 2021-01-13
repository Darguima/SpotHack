import ytdl from 'react-native-ytdl'
import * as RNFS from 'react-native-fs'
import { RNFFmpeg, RNFFmpegConfig } from 'react-native-ffmpeg'
import { ImageSourcePropType, PermissionsAndroid, PermissionStatus } from 'react-native'

interface musicInfo {
  spotifyId: string;
  youtubeQuery: string;
  youtubeId: string;
  title: string;
  artists: string;
  imageSource: ImageSourcePropType,
}

export interface downloadStatusSchema {
  code: number
  message: string,
  index: number,
  jsonErr?: Object

  progress: number

  spotifyInfo?: {
    spotifyId: string
    title: string
    artists: string,
    imageSource: ImageSourcePropType,
  }
}

interface queueSchema extends musicInfo {
  temporaryPath?: string,
  finalPath?: string,

  videoFormats?: ytdl.videoInfo
  video?: ytdl.videoFormat

  permissionGranted?: PermissionStatus

  videoDownloadStatus?: {
    jobId: number;
    promise: Promise<RNFS.DownloadResult>;
  }

  status: downloadStatusSchema
}

class DownloadMachine {
  queue: { [key: string]: queueSchema} = {}
  private finalPath: string = RNFS.DownloadDirectoryPath

  setFinalPath (newFinalPath: string) {
    this.finalPath = newFinalPath
  }

  getFinalPath () { return this.finalPath }

  addTrackToQueue (spotifyId: string, youtubeId: string, title: string, artists: string, youtubeQuery: string, imageSource: ImageSourcePropType) {
    this.queue[spotifyId] = {
      spotifyId,
      youtubeId,
      title,
      artists,
      youtubeQuery,
      imageSource: imageSource,
      status: {
        code: 1,
        message: '',
        progress: 0,
        index: Object.keys(this.queue).length
      }
    }
    this.downloadMusic(spotifyId)
  }

  private async downloadMusic (spotifyId: string) {
    const musicInfo = this.queue[spotifyId]
    musicInfo.temporaryPath = `${RNFS.CachesDirectoryPath}/${musicInfo.youtubeQuery}.mp4`
    musicInfo.finalPath = `${this.finalPath}/${musicInfo.youtubeQuery}.mp3`

    // get permission from the user
    try {
      musicInfo.permissionGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

        {
          title: 'SpotHack Storage Permission',
          message: 'Give access to your Storage to save the music.',
          buttonNegative: 'Cancel',
          buttonPositive: 'Ok'
        }
      )

      if (musicInfo.permissionGranted === PermissionsAndroid.RESULTS.GRANTED) {
        musicInfo.status = {
          ...musicInfo.status,
          code: 1,
          message: 'PermissionsAndroid success'
        }
      } else {
        musicInfo.status = {
          ...musicInfo.status,
          code: 0,
          message: 'PermissionsAndroid canceled'
        }
        return
      }
    } catch (err) {
      musicInfo.status = {
        ...musicInfo.status,
        code: 0,
        message: 'PermissionsAndroid error',
        jsonErr: JSON.stringify(err)
      }
      return
    }

    // get video url (on google videos)
    try {
      musicInfo.videoFormats = await ytdl.getInfo(musicInfo.youtubeId)
      musicInfo.video = ytdl.chooseFormat(musicInfo.videoFormats.formats, { quality: 'highestaudio' })

      musicInfo.status = {
        ...musicInfo.status,
        code: 2,
        message: 'react-native-ytdl success'
      }
    } catch (err) {
      musicInfo.status = {
        ...musicInfo.status,
        code: 0,
        message: 'react-native-ytdl error',
        jsonErr: JSON.stringify(err)
      }

      return
    }

    // Verify if exists the assets
    try {
      if (!(await RNFS.exists(musicInfo.temporaryPath))) {
        await RNFS.writeFile(musicInfo.temporaryPath, '')

        musicInfo.status = {
          ...musicInfo.status,
          code: 3,
          message: 'RNFS create assets success'
        }
      } else {
        musicInfo.status = {
          ...musicInfo.status,
          code: 3,
          message: 'RNFS create assets not necessary'
        }
      }
    } catch (err) {
      musicInfo.status = {
        ...musicInfo.status,
        code: 0,
        message: 'RNFS create assets error',
        jsonErr: JSON.stringify(err)
      }
      return
    }

    // Download Video
    try {
      musicInfo.videoDownloadStatus = RNFS.downloadFile({
        fromUrl: musicInfo.video.url,
        toFile: musicInfo.temporaryPath,
        progress: progress => {
          musicInfo.status.progress = (progress.bytesWritten / progress.contentLength) * 100
        },
        progressInterval: 500
      })

      if ((await musicInfo.videoDownloadStatus.promise).statusCode) {
        musicInfo.status = {
          ...musicInfo.status,
          code: 4,
          message: 'downloaded success',
          progress: 100
        }
      } else {
        musicInfo.status = {
          ...musicInfo.status,
          code: 0,
          message: 'RNFS download video error'
        }
        return
      }
    } catch (err) {
      musicInfo.status = {
        ...musicInfo.status,
        code: 0,
        message: 'RNFS download video error',
        jsonErr: JSON.stringify(err)
      }

      return
    }

    // Convert Video on Music
    try {
      RNFFmpegConfig.enableStatisticsCallback(async ffmpegStatus => {
        musicInfo.status.progress = (ffmpegStatus.time / Number(musicInfo.video!.approxDurationMs)) * 100
      })

      const response = await RNFFmpeg.execute(
        `-i "${musicInfo.temporaryPath}" "${musicInfo.finalPath}" -y -loglevel error`
      )

      if (response === 0) {
        musicInfo.status = {
          ...musicInfo.status,
          code: 200,
          message: 'conversion success',
          progress: 100
        }
      } else {
        musicInfo.status = {
          ...musicInfo.status,
          code: 0,
          message: 'RNFFmpeg conversion error'
        }
        return
      }
    } catch (err) {
      musicInfo.status = {
        ...musicInfo.status,
        code: 0,
        message: 'RNFFmpeg conversion error',
        jsonErr: JSON.stringify(err)
      }

      return
    }

    // Delete the temporary assets
    try {
      if (await RNFS.exists(musicInfo.temporaryPath)) {
        await RNFS.unlink(musicInfo.temporaryPath)

        musicInfo.status = {
          ...musicInfo.status,
          code: 200,
          message: 'RNFS deleted temporary assets success'
        }
      } else {
        musicInfo.status = {
          ...musicInfo.status,
          code: 200,
          message: 'RNFS deleted temporary assets not necessary'
        }
      }
    } catch (err) {
      musicInfo.status = {
        ...musicInfo.status,
        code: 200,
        message: 'RNFS deleted temporary assets error',
        jsonErr: JSON.stringify(err)
      }
    }
  }

  getDownloadStatus (spotifyId: string, includeSpotifyInfo: boolean = false) {
    const trackInQueue = this.queue[spotifyId]

    if (!trackInQueue) {
      return { code: 0, message: 'spotifyId invalid' }
    }

    if (includeSpotifyInfo) {
      trackInQueue.status.spotifyInfo = {
        spotifyId: this.queue[spotifyId].spotifyId,
        title: this.queue[spotifyId].title,
        artists: this.queue[spotifyId].artists,
        imageSource: this.queue[spotifyId].imageSource
      }
    }

    return trackInQueue.status
  }

  getDownloadsStatus (includeSpotifyInfo: boolean = false) {
    return Object.keys(this.queue).map(item => {
      const tracksInQueue = (this.queue[item].status)

      if (includeSpotifyInfo) {
        tracksInQueue.spotifyInfo = {
          spotifyId: this.queue[item].spotifyId,
          title: this.queue[item].title,
          artists: this.queue[item].artists,
          imageSource: this.queue[item].imageSource
        }
      }

      return tracksInQueue
    })
  }
}

const downloadMachine = new DownloadMachine()

export default downloadMachine
