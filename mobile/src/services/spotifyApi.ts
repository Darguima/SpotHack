import { authAsync, refreshAsync, getDefaultOAuthRedirect } from 'expo-app-auth'
import spotifyApiCredentials from './spotifyApiCredentials.json'

class AuthenticationHandler {
  public spotifyAuthConfig = {
    clientId: spotifyApiCredentials.client_id,
    clientSecret: spotifyApiCredentials.client_secret,
    redirectUrl: getDefaultOAuthRedirect(),
    scopes: [
      'playlist-read-private'
    ],
    issuer: 'https://accounts.spotify.com',
    serviceConfiguration: {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token'
    }
  }

  async login () { return await authAsync(this.spotifyAuthConfig) }

  async refreshLogin (refreshToken: string) {
    const result = await refreshAsync(this.spotifyAuthConfig, refreshToken)

    return result
  }
}

const authHandler = new AuthenticationHandler()

export default authHandler
