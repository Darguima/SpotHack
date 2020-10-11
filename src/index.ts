import spotifyGetMusicData, { musicsDataSchema } from './spotifyGetMusicData'
import spotifyGetPlaylistData from './spotifyGetPlaylistData'

import searchVideoOnDB from './searchVideoOnDB'
import searchVideoOnYoutube, { musicYoutubeDataSchema } from './searchVideoOnYoutube'

import recordMusicDataInDB from './recordMusicDataInDB'

import downloadMusicFromYoutube from './downloadMusicFromYoutube'

import convertMp3ToMp4 from './convertMp3ToMp4'

const main = async () => {
  console.log('\n\n\n')
  console.log('================')
  console.log('=== SpotHack ===')
  console.log('================')

  const args = process.argv

  const typeOfSpotifyId = args[2] // "music" or "playlist"
  const spotifyId = args[3] // musicId or playlistId for the spotifyApi
  const pathToSaveFile = args[4] ? args[4] : './' // path of the directory where the user wants the musics

  /*
  ==========================================================
  ======================  SpotifyApi  ======================
  ==========================================================
  */

  let musicsData: musicsDataSchema | 0 = [] as musicsDataSchema

  if (typeOfSpotifyId === 'music') {
    musicsData = await spotifyGetMusicData(spotifyId)
  } else if (typeOfSpotifyId === 'playlist') {
    musicsData = await spotifyGetPlaylistData(spotifyId)
  }

  if (!musicsData) {
    console.log('\n\nERROR on SpotifyApi')
    return 0
  }

  console.log('\n\n\nspotifyGetMusicData/spotifyGetPlaylistData (SpotifyApi): ')
  console.log(musicsData)

  musicsData.map(async item => {
    const musicName = item.name + ' - ' + item.artists[0].name
    /*
    ==========================================================
    ====================  Database Search  ====================
    ==========================================================
    */

    var musicYoutubeData: musicYoutubeDataSchema | 0 = await searchVideoOnDB(item.id)

    console.log('\n\n\nmusicYoutubeData (DB Search): ')
    console.log(musicYoutubeData)

    /*
    ==========================================================
    ====================  Youtube Search  ====================
    ==========================================================
    */

    if (musicYoutubeData === 0) {
      musicYoutubeData = await searchVideoOnYoutube(item)

      if (!musicYoutubeData) {
        console.log('\n\nERROR on YoutubeApi')
        console.log('Ignoring music: ' + musicName)
        return 0
      }

      console.log('\n\n\nmusicYoutubeData (Youtube Search): ')
      console.log(musicYoutubeData)

      /*
      ==========================================================
      ===================  Database Record  ====================
      ==========================================================
      */

      const recordMusicDataInDBStatus = await recordMusicDataInDB(musicYoutubeData as musicYoutubeDataSchema)

      if (recordMusicDataInDBStatus === 1) {
        console.log('\n\n\nMusic Data Saved on DB: ' + musicName)
      } else if (!recordMusicDataInDBStatus) {
        console.log('\n\nERROR on DB Recording')
        console.log('Ignoring record music on DB: ' + musicName)
      }
    }

    /*
    ==========================================================
    ===================  Youtube Download  ===================
    ==========================================================
    */

    const videoYtdl = downloadMusicFromYoutube(musicYoutubeData as musicYoutubeDataSchema)

    if (!videoYtdl) {
      console.log('\n\nERROR on Youtube Download')
      console.log('Ignoring music: ' + musicName)

      return 0
    }

    console.log('\n\n\nDownload Successful: ' + musicName)

    /*
    ==========================================================
    ==================  Mp3 to Mp4 - ffmpeg  =================
    ==========================================================
    */

    const convertMp3ToMp4Status = convertMp3ToMp4(videoYtdl, pathToSaveFile, musicYoutubeData.youtubeQuerySearch)

    if (convertMp3ToMp4Status) {
      console.log('\n\n\nConversion Successful: ' + musicName)
    } else if (!convertMp3ToMp4Status) {
      console.log('\n\nERROR on convert Mp3 to Mp4')
      console.log('Ignoring music: ' + musicName)

      return 0
    }
  })
}

main()
