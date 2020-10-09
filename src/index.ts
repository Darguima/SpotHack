import spotifyGetMusicData, { musicsDataSchema } from './spotifyGetMusicData'
import spotifyGetPlaylistData from './spotifyGetPlaylistData'

import searchVideoOnYoutube from './searchVideoOnYoutube'

import downloadMusicFromYoutube from './downloadMusicFromYoutube'

import { exit } from 'process'

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
    exit()
  }

  console.log('\n\n\nspotifyGetMusicData/spotifyGetPlaylistData (SpotifyApi): ')
  console.log(musicsData)

  musicsData.map(async item => {
    const musicName = item.name + ' - ' + item.artists[0].name
    /*
    ==========================================================
    ====================  Youtube Search  ====================
    ==========================================================
    */

    const musicYoutubeData = await searchVideoOnYoutube(item)

    if (!musicYoutubeData) {
      console.log('\n\nERROR on YoutubeApi')
      console.log('Ignoring music: ' + musicName)
      return null
    }

    console.log('\n\n\nmusicYoutubeData (Youtube Search): ')
    console.log(musicYoutubeData)

    /*
    ==========================================================
    ===================  Youtube Download  ===================
    ==========================================================
    */

    const downloadStatus = downloadMusicFromYoutube(musicYoutubeData, pathToSaveFile)

    if (downloadStatus === 1) {
      console.log('\n\n\nDownload Successful: ' + musicName)

      return 1
    } else if (!downloadStatus) {
      console.log('\n\nERROR on Youtube Download')
      console.log('Ignoring music: ' + musicName)

      return null
    }
  })
}

main()
