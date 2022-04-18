import React from 'react'
import { useNavigation } from '@react-navigation/core'

import MusicPlaylistView from '../../../../Components/MusicPlaylistView'

import { musicOnQueueSchema } from '../../../../../SpotHack_Core/DownloadMachine'

interface MemoizedMusicPlaylistViewProps {
	musicInfo: musicOnQueueSchema,
	contentBackgroundColor: string
}

const MemoizedMusicPlaylistView:React.FC<MemoizedMusicPlaylistViewProps> = ({ musicInfo, contentBackgroundColor }) => {
	const { navigate } = useNavigation()

	return (
		<MusicPlaylistView
			title={musicInfo.musicName}
			artists={musicInfo.artists}
			imageSource={{ uri: musicInfo.thumbnail }}
			viewBackgroundColor={contentBackgroundColor}
			contentBackgroundColor={contentBackgroundColor}

			viewPressAction={() => {
				navigate('MusicDetailPage', {
					spotifyId: musicInfo.spotifyId,
					image: { uri: musicInfo.thumbnail },
					title: musicInfo.musicName,
					artists: musicInfo.artists
				})
			}}

			entypoIconName="chevron-right"
			iconPressAction={() => {
				navigate('MusicDetailPage', {
					spotifyId: musicInfo.spotifyId,
					image: { uri: musicInfo.thumbnail },
					title: musicInfo.musicName,
					artists: musicInfo.artists
				})
			}}
		/>
	)
}

export default React.memo(MemoizedMusicPlaylistView, () => true)
