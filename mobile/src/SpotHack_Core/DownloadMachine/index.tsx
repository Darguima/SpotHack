import ytdl from 'react-native-ytdl'
import * as RNFS from 'react-native-fs'
import { PermissionsAndroid, PermissionStatus } from 'react-native'

interface musicInfo {
  spotifyId: string;
  youtubeQuery: string;
  youtubeId: string;
  title: string;
  artists: string;
}

export interface downloadStatusSchema {
  code: number
  message: string,
  jsonErr?: Object
}

interface queueSchema extends musicInfo {
  temporaryPath?: string,
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

  addTrackToQueue (spotifyId: string, youtubeId: string, title: string, artists: string, youtubeQuery: string) {
    this.queue[spotifyId] = { spotifyId, youtubeQuery, youtubeId, title, artists, status: { code: 1, message: '' } }
    this.downloadMusic(spotifyId)
  }

  private async downloadMusic (spotifyId: string) {
    const musicInfo = this.queue[spotifyId]
    musicInfo.temporaryPath = `${RNFS.DownloadDirectoryPath}/${musicInfo.youtubeQuery}.mp4`

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
          code: 1,
          message: 'PermissionsAndroid success'
        }
      } else {
        musicInfo.status = {
          code: 0,
          message: 'PermissionsAndroid canceled'
        }
        return
      }
    } catch (err) {
      musicInfo.status = {
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
        code: 2,
        message: 'react-native-ytdl success'
      }
    } catch (err) {
      musicInfo.status = {
        code: 0,
        message: 'react-native-ytdl error',
        jsonErr: JSON.stringify(err)
      }

      return
    }

    // Verify if exists the assets
    try {
      if (!(await RNFS.existsAssets(musicInfo.temporaryPath))) {
        await RNFS.writeFile(musicInfo.temporaryPath, '')

        musicInfo.status = {
          code: 3,
          message: 'RNFS create assets success'
        }
      } else {
        musicInfo.status = {
          code: 3,
          message: 'RNFS create assets not necessary'
        }
      }
    } catch (err) {
      musicInfo.status = {
        code: 0,
        message: 'RNFS create assets error',
        jsonErr: JSON.stringify(err)
      }
      return
    }

    // Download Video
    try {
      musicInfo.videoDownloadStatus = RNFS.downloadFile({ fromUrl: musicInfo.video.url, toFile: musicInfo.temporaryPath })

      if ((await musicInfo.videoDownloadStatus.promise).statusCode) {
        musicInfo.status = {
          code: 200,
          message: 'downloaded success'
        }
      } else {
        musicInfo.status = {
          code: 0,
          message: 'RNFS download video error'
        }
        return
      }
    } catch (err) {
      musicInfo.status = {
        code: 0,
        message: 'RNFS download video error',
        jsonErr: JSON.stringify(err)
      }
    }
  }

  getDownloadStatus (spotifyId: string) {
    if (this.queue[spotifyId]) {
      return this.queue[spotifyId].status
    } else {
      return { code: 0, message: 'spotifyId invalid' }
    }
  }
}

const downloadMachine = new DownloadMachine()

export default downloadMachine
