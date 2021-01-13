import AsyncStorage from '@react-native-community/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { DownloadDirectoryPath } from 'react-native-fs'
import downloadMachine from '../SpotHack_Core/DownloadMachine'

interface SpotHackSettingsContextData {
  spotHackSettings: spotHackSettingsSchema
  saveNewSpotHackSettings: (newSpotHackSettings: spotHackSettingsSchema) => void,
}

interface spotHackSettingsSchema {
  rootPath: string
}

const defaultSpotHackSettings: spotHackSettingsSchema = {
  rootPath: DownloadDirectoryPath
}

const SpotHackSettingsContext = createContext<SpotHackSettingsContextData>({} as SpotHackSettingsContextData)

export const SpotHackSettingsProvider: React.FC = ({ children }) => {
  const [spotHackSettings, setSpotHackSettings] = useState(defaultSpotHackSettings)

  useEffect(() => {
    (async () => {
      const [[, spotHackSettingsStoraged]] = await AsyncStorage.multiGet(['spotHackSettings'])

      if (spotHackSettingsStoraged) {
        setSpotHackSettings({ ...defaultSpotHackSettings, ...JSON.parse(spotHackSettingsStoraged) })

        // For create possibles new configurations that aren't yet on the AsyncStorage
        if ({ ...defaultSpotHackSettings, ...JSON.parse(spotHackSettingsStoraged) } !== JSON.parse(spotHackSettingsStoraged)) {
          saveNewSpotHackSettings({ ...defaultSpotHackSettings, ...JSON.parse(spotHackSettingsStoraged) })
        }
      } else {
        saveNewSpotHackSettings(defaultSpotHackSettings)
      }
    })()
  }, [])

  useEffect(() => {
    if (spotHackSettings.rootPath !== downloadMachine.getFinalPath()) {
      downloadMachine.setFinalPath(spotHackSettings.rootPath)
    }
  }, [spotHackSettings])

  const saveNewSpotHackSettings = (newSpotHackSettings: spotHackSettingsSchema) => {
    // For security reasons "{ ...defaultSpotHackSettings, ...spotHackSettings,"
    setSpotHackSettings({ ...defaultSpotHackSettings, ...spotHackSettings, ...newSpotHackSettings })
    AsyncStorage.setItem('spotHackSettings', JSON.stringify({ ...defaultSpotHackSettings, ...spotHackSettings, ...newSpotHackSettings }))
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
