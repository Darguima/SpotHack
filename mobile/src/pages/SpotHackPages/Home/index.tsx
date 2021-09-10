import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'

import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'

import ShortcutsToTabs from './components/ShortcutsToTabs'
import PlaylistsChanges from './components/PlaylistsChanges'

const Home: React.FC<MaterialTopTabScreenProps<any>> = ({ navigation: { jumpTo } }) => {
	const { navigate } = useNavigation()

	return (
		<ScrollView
			style={styles.scrollView}
			contentContainerStyle={styles.scrollViewContentContainerStyle}
		>

			<ShortcutsToTabs navigationFunction={navigate} jumpToRoutePageName="PlaylistsChangesPage">
				<PlaylistsChanges />
			</ShortcutsToTabs>

			<ShortcutsToTabs navigationFunction={jumpTo} jumpToRoutePageName="SearchMusicStack" imageSource={require('../../../assets/searchMusic.png')} />
			<ShortcutsToTabs navigationFunction={jumpTo} jumpToRoutePageName="SearchPlaylistStack" imageSource={require('../../../assets/playlists.png')} />
			<ShortcutsToTabs navigationFunction={jumpTo} jumpToRoutePageName="SavedMusicPage" imageSource={require('../../../assets/savedMusic.png')} />
			<ShortcutsToTabs navigationFunction={jumpTo} jumpToRoutePageName="SettingsPage" imageSource={require('../../../assets/settings.png')} />

		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: '#000'
	},

	scrollViewContentContainerStyle: {
		alignItems: 'center'
	}
})

export default Home
