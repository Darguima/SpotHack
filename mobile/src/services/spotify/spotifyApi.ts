/* eslint-disable camelcase */
import axios from 'axios'

const spotifyApi = axios.create({
	baseURL: 'https://api.spotify.com/v1'
})

/*
A spotifyApi.interceptors.response is added on src/contexts/auth.tsx
The interceptor is added to redresh the token every time that it expire

The Authentication Header is added on src/contexts/auth.tsx
*/

export default spotifyApi
