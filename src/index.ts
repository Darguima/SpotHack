import spotifyGetMusicData from './spotifyGetMusicData'
import spotifyGetPlaylistData from './spotifyGetPlaylistData'

import searchVideoOnDB from './searchVideoOnDB'
import searchVideoOnYoutube from './searchVideoOnYoutube'

import recordMusicDataInDB from './recordMusicDataInDB'

import downloadMusicFromYoutube from './downloadMusicFromYoutube'

import convertMp3ToMp4 from './convertMp3ToMp4'

import { Readable } from 'stream'

interface musicDataSchemaArtistsArrayItems {
  id: string,
  name: string,
}

interface musicDataSchemaArtistsArray extends Array<musicDataSchemaArtistsArrayItems> {}

export interface musicDataSchema {
  artists: musicDataSchemaArtistsArray,
  name: string
  spotifyId: string,
  youtubeId: string,
  youtubeQuerySearch: string,
  video: Readable,
}

export interface musicsDataSchema extends Array<musicDataSchema> {}

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

  musicsData = await Promise.all(musicsData.map(async item => {
    let musicName = item.name + ' - '

    const numberOfArtists = item.artists.length
    var actualArtist = 1

    item.artists.map(item => {
      if (actualArtist === numberOfArtists) {
        musicName += item.name
      } else {
        musicName += item.name + ' ft '
      }

      actualArtist++
    })

    item.youtubeQuerySearch = musicName.replace('/', '|')

    /*
    ==========================================================
    ====================  Database Search  ====================
    ==========================================================
    */

    var musicYoutubeData: musicDataSchema | 0 = await searchVideoOnDB(item.spotifyId)

    if (musicYoutubeData !== 0) { item.youtubeId = musicYoutubeData.youtubeId }

    console.log('\n\n\nmusicYoutubeData (DB Search): ')
    console.log(item)

    if (musicYoutubeData === 0) {
      /*
      ==========================================================
      ====================  Youtube Search  ====================
      ==========================================================
      */

      musicYoutubeData = await searchVideoOnYoutube(item)

      if (!musicYoutubeData) {
        console.log('\n\nERROR on YoutubeApi')
        console.log('Ignoring music: ' + item.youtubeQuerySearch)
        return item
      }

      item.youtubeId = musicYoutubeData.youtubeId

      console.log('\n\n\nmusicYoutubeData (Youtube Search): ')
      console.log(item)

      /*
      ==========================================================
      ===================  Database Record  ====================
      ==========================================================
      */

      const recordMusicDataInDBStatus = await recordMusicDataInDB(musicYoutubeData)

      if (recordMusicDataInDBStatus === 1) {
        console.log('\n\n\nMusic Data Saved on DB: ' + item.youtubeQuerySearch)
      } else if (!recordMusicDataInDBStatus) {
        console.log('\n\nERROR on DB Recording')
        console.log('Ignoring record music on DB: ' + item.youtubeQuerySearch)
      }
    }

    /*
    ==========================================================
    ===================  Youtube Download  ===================
    ==========================================================
    */

    const videoYtdl = downloadMusicFromYoutube(item)

    if (!videoYtdl) {
      console.log('\n\nERROR on Youtube Download')
      console.log('Ignoring music: ' + item.youtubeQuerySearch)

      return {
        ...item
      }
    }

    item.video = videoYtdl

    console.log('\n\n\ndownloadMusicFromYoutube (Youtube Download): ')
    console.log(item)

    return item
  }))

  console.log('\n\nStarting Downloads')

  musicsData.map(item => {
    /*
    ==========================================================
    ==================  Mp3 to Mp4 - ffmpeg  =================
    ==========================================================
    */

    if (!item.video) {
      console.log('\n\nERROR on convert Mp3 to Mp4 - Don\'t exist video')
      console.log('Ignoring music: ' + item.youtubeQuerySearch)

      return 0
    }

    convertMp3ToMp4(item, pathToSaveFile, item.youtubeQuerySearch)
  })
}

main()
