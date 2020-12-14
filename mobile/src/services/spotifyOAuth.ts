import React from 'react'

import * as Linking from 'expo-linking'
import { openBrowserAsync } from 'expo-web-browser'

import axios from 'axios'

import spotifyApiCredentials from './spotifyApiCredentials.json'

const redirectUri = Linking.makeUrl('oauthredirect')

export const getoAuthCode = async (setOAuthCode: React.Dispatch<React.SetStateAction<string | undefined>>) => {
  const scopes = ['user-read-private', 'playlist-read-private']

  await openBrowserAsync(
    'https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + spotifyApiCredentials.client_id +
    '&scope=' + encodeURIComponent(scopes.join(' ')) +
    '&redirect_uri=' + encodeURIComponent(redirectUri)
  )

  Linking.addEventListener('url', async (url) => {
    const { queryParams, path } = Linking.parse(url.url)
    if (path === 'oauthredirect') {
      if (queryParams) {
        if (queryParams.code) {
          return setOAuthCode(queryParams.code)
        } else {
          return setOAuthCode('error')
        }
      } else {
        return setOAuthCode('error')
      }
    }
  })
}

export const getOauthCredentials = async (oAuthCode: string) => {
  try {
    const oAuthCredentials = await axios.post(
      'https://accounts.spotify.com/api/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code: oAuthCode,
          redirect_uri: redirectUri
        },

        headers: {
          Authorization: `Basic ${spotifyApiCredentials.base64_key}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    if (oAuthCredentials.data.access_token) {
      if (oAuthCredentials.data.refresh_token) {
        return oAuthCredentials.data
      }
    }

    return {
      access_token: 'error',
      refresh_token: 'error'
    }
  } catch (err) {
    return {
      access_token: 'error',
      refresh_token: 'error'
    }
  }
}

export const refreshToken = async (refreshToken: string) => {
  try {
    const oAuthCredentials = await axios.post(
      'https://accounts.spotify.com/api/token',
      null,
      {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: spotifyApiCredentials.client_id
        },

        headers: {
          Authorization: `Basic ${spotifyApiCredentials.base64_key}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    if (oAuthCredentials.data.access_token) {
      return { access_token: oAuthCredentials.data.access_token }
    }

    return {
      access_token: 'error'
    }
  } catch (err) {
    return {
      access_token: 'error'
    }
  }
}

export default {
  getoAuthCode,
  getOauthCredentials,
  refreshToken
}
