import React, { useState } from 'react'
import { StyleSheet, ImageSourcePropType, ScrollView } from 'react-native'

import { HomeScreenParamsListProp } from '../../../../routes/home.routes'

import Header from '../components/Header'
import PlaylistIdInput from '../components/PlaylistIdInput'
import PlaylistInfo from '../components/PlaylistInfo'
import ReferenceStatusView from '../components/ReferenceStatusView'
import SuccessReferenceModal from '../components/SuccessReferenceModal'

export interface playlistInfoSchema {
	coverImage: ImageSourcePropType,
	title: string,
	owner: string
}

type Prop = HomeScreenParamsListProp<'ReferencePlaylistPage'>

const ReferencePlaylistPage: React.FC<Prop> = ({ route: { params: { path, pathName } }, navigation }) => {
	const [playlistId, setPlaylistId] = useState('')
	const [playlistInfo, setPlaylistInfo] = useState<playlistInfoSchema | undefined>()
	const [referenceStatus, setReferenceStatus] = useState<'editing id' | 'not founded' | 'founded' | 'referenced'>('editing id')

	return (
		<ScrollView style={styles.container}>
			<Header rootPath={'Sync Playlist "' + pathName + '"'} goBackDisabled={referenceStatus === 'referenced'} />

			<PlaylistIdInput
				playlistId={playlistId}
				setPlaylistId={setPlaylistId}

				referenceStatus={referenceStatus}
				setReferenceStatus={setReferenceStatus}

				setPlaylistInfo={setPlaylistInfo}
			/>

			{playlistInfo && referenceStatus === 'founded' &&
				<PlaylistInfo
					playlistId={playlistId}
					playlistInfo={playlistInfo}

					path={path}
					pathName={pathName}

					setReferenceStatus={setReferenceStatus}
				/>
			}

			{referenceStatus === 'editing id' &&
				<ReferenceStatusView
					statusText='Paste the Playlist Id'
					color='#1c5ed6'
					iconName='search'
				/>
			}

			{referenceStatus === 'not founded' &&
				<ReferenceStatusView
					statusText='Playlist Not Founded'
					color='#f00'
					iconName='x'
				/>
			}

			<SuccessReferenceModal
				referenceStatus={referenceStatus}
				navigationPop={navigation.pop}
			/>

		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#000',
		flex: 1
	}
})

export default ReferencePlaylistPage
