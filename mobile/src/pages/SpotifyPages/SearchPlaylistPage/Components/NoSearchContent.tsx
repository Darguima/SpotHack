import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import MusicPlaylistView from '../../../Components/MusicPlaylistView'

import useUserData from '../../../../contexts/userData'
import useUserHistory from '../../../../contexts/userHistory'

const NoSearchContent:React.FC = () => {
	const [screenIndex, setScreenIndex] = useState<number>(0)

	const { userPlaylists } = useUserData()
	const { playlistSearchHistory, addPlaylistToPlaylistSearchHistory, removePlaylistFromPlaylistSearchHistory } = useUserHistory()

	const { navigate } = useNavigation()

	return (
		<View style={styles.container}>

			<View style={styles.topContainer}>
				<Text
					style={[styles.screenToogleText, screenIndex === 0 ? styles.screenToogleTextSelected : {}]}
					onPress={() => { setScreenIndex(0) }}
				>
					History
				</Text>

				<Text
					style={[styles.screenToogleText, screenIndex === 1 ? styles.screenToogleTextSelected : {}]}
					onPress={() => { setScreenIndex(1) }}
				>
					My Playlists
				</Text>
			</View>

			{screenIndex === 0 && playlistSearchHistory.map((item, index) => {
				return (
					<MusicPlaylistView
						key={index}

						style={{
							marginTop: index === 0 ? '4%' : '2%',
							marginBottom: index === playlistSearchHistory.length - 1 ? '4%' : '2%'
						}}

						imageSource={item.image}
						title={item.name}
						artists={item.owner}

						viewPressAction={() => {
							addPlaylistToPlaylistSearchHistory(item)
							navigate('PlaylistDetailPage', {
								spotifyId: item.spotifyId,
								image: item.image,
								name: item.name,
								owner: item.owner
							})
						}}

						entypoIconName="cross"
						iconPressAction={() => {
							removePlaylistFromPlaylistSearchHistory(item.spotifyId)
						}}
					/>
				)
			})}

			{screenIndex === 1 && userPlaylists.map((item, index) => (
				<MusicPlaylistView
					key={index}

					style={{
						marginTop: index === 0 ? 0 : '2%',
						marginBottom: index === userPlaylists.length - 1 ? '4%' : '2%'
					}}

					imageSource={item.image}
					title={item.name}
					artists={item.owner.display_name || 'Owner'}

					viewPressAction={() => {
						navigate('PlaylistDetailPage', {
							spotifyId: item.id,
							image: item.image,
							name: item.name,
							owner: item.owner.display_name
						})
					}}

					entypoIconName="chevron-right"
					iconPressAction={() => {
						navigate('PlaylistDetailPage', {
							spotifyId: item.id,
							image: item.image,
							name: item.name,
							owner: item.owner.display_name
						})
					}}
				/>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
	},

	topContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',

		paddingVertical: '5%'
	},

	screenToogleText: {
		width: '40%',

		color: '#fff',
		fontSize: 20,

		textAlign: 'center',

		paddingVertical: '2%'
	},

	screenToogleTextSelected: {
		color: '#1c5ed6',
		fontSize: 22,

		textDecorationLine: 'underline'
	}
})

export default NoSearchContent
