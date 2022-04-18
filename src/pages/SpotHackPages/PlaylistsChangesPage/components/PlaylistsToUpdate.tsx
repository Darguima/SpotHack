import React from 'react'
import { useNavigation } from '@react-navigation/native'

import MusicPlaylistView from '../../../Components/MusicPlaylistView'
import UpdatePlaylistsButtons from './UpdatePlaylistsButtons'

import useDownloadsInfo from '../../../../contexts/downloadsInfo'

const PlaylistsToUpdate:React.FC = () => {
	const { navigate } = useNavigation()
	const { playlistsChanges } = useDownloadsInfo()

	return (
		<>
			<UpdatePlaylistsButtons />

			{
				playlistsChanges.map((playlist, index) => {
					let descriptionText = ''

					if (playlist.added.length !== 0) {
						descriptionText += `${playlist.added.length} music${playlist.added.length === 1 ? '' : 's'} to download`
					}

					if (playlist.added.length !== 0 && playlist.removed.length !== 0) {
						descriptionText += '\n'
					}

					if (playlist.removed.length !== 0) {
						descriptionText += `${playlist.removed.length} music${playlist.removed.length === 1 ? '' : 's'} to delete`
					}

					return (
						<MusicPlaylistView
							key = {playlist.playlistId}

							title={playlist.playlistName}
							imageSource={playlist.coverImage}
							artists={descriptionText}

							artistsNumberOfLines={2}

							style={{
								marginTop: '4%',
								marginBottom: index === playlistsChanges.length - 1 ? '4%' : '2%'
							}}

							entypoIconName="chevron-right"

							viewPressAction={() => {
								navigate('PlaylistDetailPage', {
									spotifyId: playlist.playlistId,
									image: playlist.coverImage,
									name: playlist.playlistName
								})
							}}
							iconPressAction={() => {
								navigate('PlaylistDetailPage', {
									spotifyId: playlist.playlistId,
									image: playlist.coverImage,
									name: playlist.playlistName
								})
							}}
						/>
					)
				})
			}
		</>
	)
}

export default PlaylistsToUpdate
