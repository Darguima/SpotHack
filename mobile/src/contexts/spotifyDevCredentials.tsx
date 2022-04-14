import React, { createContext, useContext, useEffect, useState } from 'react'

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env'
import EncryptedStorage from 'react-native-encrypted-storage'

import { Buffer } from 'buffer'

interface spotifyCredentialsStored {
	clientId: string,
	clientSecret: string,
}

interface SpotifyDevCredentialsContextData {
	spotifyClientId: string,
	spotifyClientSecret: string,
	spotifyBase64Key: string,

	spotifyCredentialsStored: spotifyCredentialsStored,

	storeSpotifyClientId: (newClientId: string) => Promise<void>,
	storeSpotifyClientSecret: (newClientSecret: string) => Promise<void>,

	isLoginPossible: () => boolean,
}

const SpotifyDevCredentialsContext = createContext({} as SpotifyDevCredentialsContextData)

export const SpotifyDevCredentialsProvider: React.FC = ({ children }) => {
	const [spotifyClientId, setSpotifyClientId] = useState<string>('')
	const [spotifyClientSecret, setSpotifyClientSecret] = useState<string>('')
	const [spotifyBase64Key, setSpotifyBase64Key] = useState<string>('')

	const [spotifyCredentialsStored, setSpotifyCredentialsStored] = useState<spotifyCredentialsStored>({ clientId: '', clientSecret: '' })

	useEffect(() => {
		(async () => {
			let newSpotifyClientId = SPOTIFY_CLIENT_ID || ''
			let newSpotifyClientSecret = SPOTIFY_CLIENT_SECRET || ''

			try {
				const credentialsStored = await EncryptedStorage.getItem('spotify_credentials')

				if (credentialsStored) {
					const credentials: spotifyCredentialsStored = JSON.parse(credentialsStored)

					setSpotifyCredentialsStored({
						clientId: credentials.clientId || '',
						clientSecret: credentials.clientSecret || ''
					})

					newSpotifyClientId = credentials.clientId || newSpotifyClientId
					newSpotifyClientSecret = credentials.clientSecret || newSpotifyClientSecret
				}
			} catch {}

			setSpotifyClientId(newSpotifyClientId)
			setSpotifyClientSecret(newSpotifyClientSecret)
			setSpotifyBase64Key(Buffer.from(`${newSpotifyClientId}:${newSpotifyClientSecret}`, 'utf-8').toString('base64'))
		})()
	}, [])

	const storeSpotifyClientId = async (newClientId: string) => {
		setSpotifyClientId(newClientId || SPOTIFY_CLIENT_ID || '')
		setSpotifyBase64Key(Buffer.from(`${newClientId || SPOTIFY_CLIENT_ID || ''}:${spotifyClientSecret}`, 'utf-8').toString('base64'))

		try {
			await EncryptedStorage.setItem('spotify_credentials', JSON.stringify({ ...spotifyCredentialsStored, clientId: newClientId }))
			setSpotifyCredentialsStored({ ...spotifyCredentialsStored, clientId: newClientId })
		} catch {}
	}

	const storeSpotifyClientSecret = async (newClientSecret: string) => {
		setSpotifyClientSecret(newClientSecret || SPOTIFY_CLIENT_SECRET || '')
		setSpotifyBase64Key(Buffer.from(`${spotifyClientId}:${newClientSecret || SPOTIFY_CLIENT_SECRET || ''}`, 'utf-8').toString('base64'))

		try {
			await EncryptedStorage.setItem('spotify_credentials', JSON.stringify({ ...spotifyCredentialsStored, clientSecret: newClientSecret }))
			setSpotifyCredentialsStored({ ...spotifyCredentialsStored, clientSecret: newClientSecret })
		} catch {}
	}

	const isLoginPossible = () => {
		return !!spotifyClientId && !!spotifyClientSecret && !!spotifyBase64Key
	}

	return (
		<SpotifyDevCredentialsContext.Provider value={{
			spotifyClientId,
			spotifyClientSecret,
			spotifyBase64Key,

			spotifyCredentialsStored,

			storeSpotifyClientId,
			storeSpotifyClientSecret,

			isLoginPossible
		}}>
			{children}
		</SpotifyDevCredentialsContext.Provider>
	)
}

export default function useSpotifyDevCredentials () {
	const context = useContext(SpotifyDevCredentialsContext)

	return context
}
