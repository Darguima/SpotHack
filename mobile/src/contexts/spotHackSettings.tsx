import AsyncStorage from '@react-native-community/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { DownloadDirectoryPath } from 'react-native-fs'

interface SpotHackSettingsContextData {
spotHackSettings: spotHackSettingsSchema
saveNewSpotHackSettings: (newSpotHackSettings: Partial<spotHackSettingsSchema>) => void,
}

interface spotHackSettingsSchema {
	rootPath: string,
	defaultDownloadSource: string
}

const defaultSpotHackSettings: spotHackSettingsSchema = {
	rootPath: DownloadDirectoryPath,
	defaultDownloadSource: 'yt_firstVideoOnSearch'
}

const SpotHackSettingsContext = createContext<SpotHackSettingsContextData>({} as SpotHackSettingsContextData)

export const SpotHackSettingsProvider: React.FC = ({ children }) => {
	const [spotHackSettings, setSpotHackSettings] = useState(defaultSpotHackSettings)

	useEffect(() => {
		(async () => {
			const [[, spotHackSettingsStored]] = await AsyncStorage.multiGet(['spotHackSettings'])

			if (spotHackSettingsStored) {
				setSpotHackSettings({ ...defaultSpotHackSettings, ...JSON.parse(spotHackSettingsStored) })

				// For create possibles new configurations that aren't yet on the AsyncStorage
				if ({ ...defaultSpotHackSettings, ...JSON.parse(spotHackSettingsStored) } !== JSON.parse(spotHackSettingsStored)) {
					saveNewSpotHackSettings({ ...defaultSpotHackSettings, ...JSON.parse(spotHackSettingsStored) })
				}
			} else {
				saveNewSpotHackSettings(defaultSpotHackSettings)
			}
		})()
	}, [])

	const saveNewSpotHackSettings = (newSpotHackSettings: Partial<spotHackSettingsSchema>) => {
		// For security reasons "{ ...defaultSpotHackSettings, ...spotHackSettings,"
		const newSettings = { ...defaultSpotHackSettings, ...spotHackSettings, ...newSpotHackSettings }
		setSpotHackSettings(newSettings)
		AsyncStorage.setItem('spotHackSettings', JSON.stringify(newSettings))
	}

	return (
		<SpotHackSettingsContext.Provider value={{
			spotHackSettings,
			saveNewSpotHackSettings
		}}>
			{children}
		</SpotHackSettingsContext.Provider>
	)
}

export default () => (useContext(SpotHackSettingsContext))
