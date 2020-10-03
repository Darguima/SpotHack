import spotifyGetMusicData from './spotifyGetMusicData'
import { spotifyApiKey } from './SpotifyApiKey.json'

const main = async () => {
  const musicData = await spotifyGetMusicData('6y6jbcPG4Yn3Du4moXaenr', spotifyApiKey)
  console.log(musicData)
}

console.log('\n\n\n\n\n\n\n\n\n\n')
main()
