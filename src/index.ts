import spotifyGetMusicData from './spotifyGetMusicData'
import { spotifyApiKey } from './SpotifyApiKey.json'

import searchVideoOnYoutube from './searchVideoOnYoutube'

const main = async () => {
  const musicData = await spotifyGetMusicData('6y6jbcPG4Yn3Du4moXaenr', spotifyApiKey)
  console.log('\n\n\nmusicData (Spotify): ')
  console.log(musicData)

  const musicYoutubeData = await searchVideoOnYoutube(musicData)
  console.log('\n\n\nmusicYoutubeData (Youtube Search): ')
  console.log(musicYoutubeData)
}

console.log('\n\n\n\n\n\n\n\n\n\n')
main()
