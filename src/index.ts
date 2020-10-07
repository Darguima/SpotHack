import spotifyGetMusicData from './spotifyGetMusicData'
import spotifyGetPlaylistData from './spotifyGetPlaylistData'

import searchVideoOnYoutube from './searchVideoOnYoutube'

import downloadMusicFromYoutube from './downloadMusicFromYoutube'

const downloadMusic = async (spotifyId: string) => {
  const musicData = await spotifyGetMusicData(spotifyId)
  console.log('\n\n\nmusicData (Spotify): ')
  console.log(musicData)

  const musicYoutubeData = await searchVideoOnYoutube(musicData)
  console.log('\n\n\nmusicYoutubeData (Youtube Search): ')
  console.log(musicYoutubeData)

  const downloadStatus = downloadMusicFromYoutube(musicYoutubeData, './')

  if (downloadStatus === 1) {
    console.log('\n\n\nDownload Successful')
  }
}

const downloadPlaylist = async (spotifyId: string) => {
  const musicsData = await spotifyGetPlaylistData(spotifyId)
  console.log('\n\n\nmusicsData (Spotify): ')
  console.log(musicsData)

  musicsData.map(async item => {
    const musicYoutubeData = await searchVideoOnYoutube(item)
    console.log('\n\n\nmusicYoutubeData (Youtube Search): ')
    console.log(musicYoutubeData)

    const downloadStatus = downloadMusicFromYoutube(musicYoutubeData, './playlist')

    if (downloadStatus === 1) {
      console.log('\n\n\nDownload Successful')
    }
  })
}

console.log('\n\n\n\n\n\n\n\n\n\n')

const args = process.argv
args.shift() // Remove the nodejs path
args.shift() // Remove this file's path

const typeOfSpotifyId = args[0]
const spotifyId = args[1]

if (typeOfSpotifyId === 'music') {
  downloadMusic(spotifyId)
} else if (typeOfSpotifyId === 'playlist') {
  downloadPlaylist(spotifyId)
}
