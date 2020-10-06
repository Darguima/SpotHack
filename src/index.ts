import spotifyGetMusicData from './spotifyGetMusicData'
import { spotifyApiKey } from './SpotifyApiKey.json'

import searchVideoOnYoutube from './searchVideoOnYoutube'

import downloadMusicFromYoutube from './downloadMusicFromYoutube'

const main = async () => {
  const musicData = await spotifyGetMusicData('1sviDBcAqVOxMXq4xITVEs', spotifyApiKey)
  console.log('\n\n\nmusicData (Spotify): ')
  console.log(musicData)

  const musicYoutubeData = await searchVideoOnYoutube(musicData)
  console.log('\n\n\nmusicYoutubeData (Youtube Search): ')
  console.log(musicYoutubeData)

  const downloadStatus = downloadMusicFromYoutube(musicYoutubeData, './////')

  if (downloadStatus === 1) {
    console.log('\n\n\nDownload Successful')
  }
}

console.log('\n\n\n\n\n\n\n\n\n\n')
main()
