import { spotifyApiResponseArtistsArray } from '../services/spotifyApi'

export default (artists: spotifyApiResponseArtistsArray) => {
  const artistsArray = artists.map(item => {
    return item.name
  })

  const artistsNumber = artistsArray.length
  let result = ''
  let actualArtist = 0

  if (artistsNumber === 1) {
    result = artists[0].name
  } else if (artistsNumber >= 1) {
    result = artistsArray.reduce((previousReturn, nextItem) => {
      if (actualArtist < artistsNumber) {
        actualArtist++
        return previousReturn + ' ft ' + nextItem
      }

      return previousReturn + nextItem
    })
  }

  return result
}
