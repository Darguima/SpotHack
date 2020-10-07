import axios from 'axios'
import { spotifyApiKey } from '../src/SpotifyApiKey.json'

const spotifyApi = axios.create({ baseURL: 'https://api.spotify.com' })
spotifyApi.defaults.headers.Authorization = `Bearer ${spotifyApiKey}`

export default spotifyApi

// https://developer.spotify.com/console/
