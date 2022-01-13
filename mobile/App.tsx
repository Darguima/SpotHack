import React, { useEffect, useState } from 'react'
import { StatusBar, LogBox } from 'react-native'
import NetInfo from '@react-native-community/netinfo'

import * as RNFS from 'react-native-fs'

import { AuthProvider } from './src/contexts/auth'
import Routes from './src/routes/index'
import NoInternetConnection from './src/pages/SpotHackPages/NoInternetConnection'

const mobile:React.FC = () => {
	const [isOnline, setIsOnline] = useState(false)

	NetInfo.fetch().then(state => {
		setIsOnline((state.isConnected || false) && (state.isInternetReachable || false))
	})

	useEffect(() => {
		LogBox.ignoreLogs([
			'react-native-ytdl is out of date! If the latest port is available, update with "npm install react-native-ytdl@latest".',
			'react-native-ytdl: miniget: will not use specified encoding since request has already been made. Currently using utf8 encoding.'
		])
	}, [])

	RNFS.readDir(RNFS.CachesDirectoryPath)
		.then(foldersOnCache => {
			if (foldersOnCache
				.some(pathOnCache => (pathOnCache.name === 'musicsVideos' && pathOnCache.isDirectory()))
			) {
				RNFS.readDir(RNFS.CachesDirectoryPath + '/musicsVideos')
					.then(musicsToDelete =>
						musicsToDelete.forEach(musicToDelete => RNFS.unlink(musicToDelete.path))
					)
			}
		})

	return (
		<AuthProvider>
			<StatusBar barStyle={'light-content'} translucent={false} backgroundColor={'#1c5ed6'}/>

			{isOnline ? <Routes /> : <NoInternetConnection />}

		</ AuthProvider>
	)
}

export default mobile
