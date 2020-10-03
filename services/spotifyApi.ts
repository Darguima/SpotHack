import axios from 'axios'

const spotifyApi = axios.create({ baseURL: 'https://api.spotify.com' })

export default spotifyApi

// https://developer.spotify.com/console/
