import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import spotifyOAuth from '../services/spotify/spotifyOAuth'
import spotifyApi from '../services/spotify/spotifyApi'
import Axios from 'axios'

interface AuthContextData {
	loading: boolean,

	errorOnLogin: 0 | string,

	signed: boolean,

	logIn(): void,
	logOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {
	const [loading, setLoading] = useState<boolean>(true)

	const [errorOnLogin, setErrorOnLogin] = useState<0 | string>(0)

	const [oAuthCode, setOAuthCode] = useState<string | undefined>(undefined)

	const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
	const [refreshToken, seRefreshToken] = useState<string | undefined>(undefined)

	// Take the saved data from Asyncstorage
	useEffect(() => {
		(async () => {
			const [[, oAuthCodeStored], [, accessTokenStored], [, refreshTokenStored]] = await AsyncStorage.multiGet(
				[
					'@SpotHackAuth:oAuthCode',
					'@SpotHackAuth:accessToken',
					'@SpotHackAuth:refreshToken'
				]
			)

			if (oAuthCodeStored && accessTokenStored && refreshTokenStored) {
				spotifyApi.defaults.headers.Authorization = `Bearer ${accessTokenStored}`

				setOAuthCode(oAuthCodeStored)
				seRefreshToken(refreshTokenStored)
				setAccessToken(accessTokenStored)

				setErrorOnLogin('')
			}

			setLoading(false)
		})()
	}, [])

	// Add Interceptor to the spotifyApi to every time that the token expire
	useEffect(() => {
		const refreshAccessToken = async () => {
			if (refreshToken) {
				const newAccessToken = await spotifyOAuth.refreshToken(refreshToken)

				if (newAccessToken.access_token === 'error') {
					return { response: 'error on refresh', refresh: 0 }
				}

				spotifyApi.defaults.headers.Authorization = `Bearer ${newAccessToken.access_token}`

				AsyncStorage.setItem('@SpotHackAuth:accessToken', newAccessToken.access_token)

				setAccessToken(newAccessToken.access_token)
				setErrorOnLogin('')
				return { response: newAccessToken.access_token, refresh: 1 }
			} else {
				return { response: 'error on refresh', refresh: 0 }
			}
		}

		const refreshTokenInterceptor = spotifyApi.interceptors.response.use(response => {
			return response
		}, async (error) => {
			if (error.response.data.error.status === 401 && error.response.data.error.message === 'The access token expired') {
				const refreshStatus = await refreshAccessToken()

				if (refreshStatus.refresh === 0) { return error }

				const { config } = error

				config.headers.Authorization = `Bearer ${refreshStatus.response}`

				try {
					return await Axios.request(config)
				} catch (err) {
					return err
				}
			}

			return error
		})

		return () => { spotifyApi.interceptors.response.eject(refreshTokenInterceptor) }
	}, [refreshToken])

	const logIn = async () => {
		await spotifyOAuth.getoAuthCode(setOAuthCode)
		// This will change the value on oAuthCode and fire the next useEffect
	}

	// logIn() continue in this useEffect

	useEffect(() => {
		(async () => {
			if (oAuthCode) {
				if (oAuthCode !== 'error') {
					const credentials = await spotifyOAuth.getOauthCredentials(oAuthCode)

					if (credentials.access_token && credentials.refresh_token) {
						if (credentials.access_token !== 'error' && credentials.refresh_token !== 'error') {
							spotifyApi.defaults.headers.Authorization = `Bearer ${credentials.access_token}`

							setAccessToken(credentials.access_token)
							seRefreshToken(credentials.refresh_token)

							AsyncStorage.multiSet([
								['@SpotHackAuth:oAuthCode', oAuthCode],
								['@SpotHackAuth:accessToken', credentials.access_token],
								['@SpotHackAuth:refreshToken', credentials.refresh_token]
							])
							setErrorOnLogin('')
						} else {
							setErrorOnLogin("We can't get your tokens from Spotify")
						}
					} else {
						setErrorOnLogin("We can't get your tokens from Spotify")
					}
				} else {
					setErrorOnLogin("We can't get your oAuth Code from Spotify")
				}
			}
		})()
	}, [oAuthCode])

	const logOut = () => {
		if (accessToken) {
			try {
				setOAuthCode(undefined)
				setAccessToken(undefined)
				seRefreshToken(undefined)
				setErrorOnLogin('')

				AsyncStorage.clear()

				spotifyApi.defaults.headers.Authorization = ''

				return { response: 'sucess on logout', logout: 1 }
			} catch (err) {
				return { response: 'error on logout', logout: 0 }
			}
		}
	}

	return (
		<AuthContext.Provider value={{ loading, errorOnLogin, signed: !!accessToken, logIn, logOut }}>
			{children}
		</AuthContext.Provider>
	)
}

export default function useAuth () {
	const context = useContext(AuthContext)

	return context
}
