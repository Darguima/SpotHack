import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import { mkdir, DownloadDirectoryPath } from 'react-native-fs'

import downloadMachine from '../SpotHack_Core/DownloadMachine'

interface SpotHackSettingsContextData {
spotHackSettings: spotHackSettingsSchema
saveNewSpotHackSettings: (newSpotHackSettings: Partial<spotHackSettingsSchema>) => void,
}

interface spotHackSettingsSchema {
	rootPath: string,
	defaultDownloadSource: string,

	slowRender: boolean,

	downloadsPage: {
		showAlreadyDownloadedMusics: boolean
	}
}

const defaultSpotHackSettings: spotHackSettingsSchema = {
	rootPath: `${DownloadDirectoryPath}/`,
	defaultDownloadSource: 'ytFirstVideoOnSearch',

	slowRender: true,

	downloadsPage: {
		showAlreadyDownloadedMusics: false
	}
}

const voidSpotHackSettings: spotHackSettingsSchema = {
	rootPath: '',
	defaultDownloadSource: '',

	slowRender: true,

	downloadsPage: {
		showAlreadyDownloadedMusics: false
	}
}

const SpotHackSettingsContext = createContext<SpotHackSettingsContextData>({} as SpotHackSettingsContextData)

export const SpotHackSettingsProvider: React.FC = ({ children }) => {
	const [spotHackSettings, setSpotHackSettings] = useState(defaultSpotHackSettings)
	const prevSpotHackSettingsRef = useRef(voidSpotHackSettings)

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

	useEffect(() => {
		(async () => {
			await mkdir(spotHackSettings.rootPath)

			// Change on the downloadMachine the rootPath
			if (prevSpotHackSettingsRef.current.rootPath !== spotHackSettings.rootPath) {
				downloadMachine.setFinalPath(spotHackSettings.rootPath)
			}
			downloadMachine.defaultDownloadSource = spotHackSettings.defaultDownloadSource

			prevSpotHackSettingsRef.current = spotHackSettings
		})()
	}, [spotHackSettings])

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
