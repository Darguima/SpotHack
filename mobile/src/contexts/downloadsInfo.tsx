import React, { createContext, useContext, useEffect, useState } from 'react'

import downloadManager, { playlistChangesSchema, playlistsChangesOnPathSchema } from '../SpotHack_Core/DownloadManager'
import useSpotHackSettings from '../contexts/spotHackSettings'

interface DownloadsInfoContextData {
	playlistsChanges: Array<playlistChangesSchema>,
	updatePlaylistsChanges: (newPlaylistsChanges: playlistChangesSchema[]) => void,

	playlistsChangesObject: playlistsChangesOnPathSchema,

	playlistsChecked: boolean
}

const DownloadsInfoContext = createContext<DownloadsInfoContextData>({} as DownloadsInfoContextData)

export const DownloadsInfoProvider: React.FC = ({ children }) => {
	const { spotHackSettings: { rootPath } } = useSpotHackSettings()

	const [playlistsChanges, setPlaylistsChanges] = useState<Array<playlistChangesSchema>>([])
	const [playlistsChangesObject, setPlaylistsChangesObject] = useState<playlistsChangesOnPathSchema>({})

	const [playlistsChecked, setPlaylistsChecked] = useState<boolean>(false)

	const updatePlaylistsChanges = (newPlaylistsChanges: playlistChangesSchema[]) => {
		const newPlaylistsChangesOnRootPath: playlistsChangesOnPathSchema = newPlaylistsChanges
			.reduce((finalObj, playlist) => ({ ...finalObj, [playlist.playlistId]: playlist }), {})

		downloadManager.playlistsChanges[rootPath] = newPlaylistsChangesOnRootPath
		setPlaylistsChangesObject(newPlaylistsChangesOnRootPath)
		setPlaylistsChanges(newPlaylistsChanges)
	}

	useEffect(() => {
		let isMounted = true
		downloadManager.addOnPlaylistUpdateEventFunction((_, newPlaylistsChanges, __, arePlaylistsUpdated) => {
			if (!isMounted) return
			setPlaylistsChangesObject(newPlaylistsChanges)
			setPlaylistsChanges(Object.keys(newPlaylistsChanges)
				.map(playlistId => newPlaylistsChanges[playlistId])
			)
			setPlaylistsChecked(arePlaylistsUpdated)
		})

		return () => { isMounted = false }
	}, [])

	return (
		<DownloadsInfoContext.Provider value={{
			playlistsChanges,
			updatePlaylistsChanges,

			playlistsChangesObject,

			playlistsChecked
		}}>
			{children}
		</DownloadsInfoContext.Provider>
	)
}

export default () => (useContext(DownloadsInfoContext))
