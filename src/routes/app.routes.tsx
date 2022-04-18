import React from 'react'
import { Dimensions, Image } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'

import SearchMusicRoutes from './searchMusic.routes'
import SearchPlaylistRoutes from './searchPlaylist.routes'
import HomeRoutes from './home.routes'
import SavedMusicRoutes from './savedMusic.routes'
import SettingsPage from '../pages/SpotHackPages/SettingsPage'

import useUserData from '../contexts/userData'
import LoadingPage from '../pages/OtherPages/LoadingPage'

const { Navigator, Screen } = createMaterialTopTabNavigator()

const AppRoutes: React.FC = () => {
	const { userData } = useUserData()

	return (
		<>
			{ userData.display_name /* the page only can render after have the userData */ &&
			<NavigationContainer>
				<Navigator
					initialRouteName="Home"
					tabBarPosition="bottom"

					initialLayout={{ width: Dimensions.get('window').width /* To don't have half the screen white on initial render */ }}

					tabBarOptions={{

						inactiveTintColor: '#fff',
						activeTintColor: '#1c5ed6',
						showIcon: true,
						showLabel: false,

						tabStyle: {
							backgroundColor: '#212121'
						}

					}}
				>

					<Screen
						name="SearchMusicStack"
						component={SearchMusicRoutes}

						options={{
							tabBarLabel: 'Search Music',
							tabBarIcon: function icon ({ color, focused }) {
								return (
									<MaterialCommunityIcons
										name="music-box-outline"
										size={25}
										color={focused ? '#1c5ed6' : color}
									/>
								)
							}
						}}
					/>

					<Screen
						name="SearchPlaylistStack"
						component={SearchPlaylistRoutes}

						options={{
							tabBarLabel: 'Playlists',
							tabBarIcon: function icon ({ color, focused }) {
								return (
									<MaterialCommunityIcons
										name="playlist-music-outline"
										size={25}
										color={focused ? '#1c5ed6' : color}
									/>
								)
							}
						}}
					/>

					<Screen
						name="Home"
						component={HomeRoutes}

						options={{
							tabBarLabel: 'Home',
							tabBarIcon: function icon ({ focused }) {
								return (
									<Image

										source={
											focused
												? require('../assets/icons/homeIcon.png')
												: require('../assets/icons/homeIconWhite.png')
										}

										style={{ width: 25, height: 25 }}

										height={25}
										width={25}
									/>
								)
							}
						}}
					/>

					<Screen
						name="SavedMusicPage"
						component={SavedMusicRoutes}

						options={{
							tabBarLabel: 'Saved Music',
							tabBarIcon: function icon ({ color, focused }) {
								return (
									<MaterialCommunityIcons
										name="file-music-outline"
										size={25}
										color={focused ? '#1c5ed6' : color}
									/>
								)
							}
						}}
					/>

					<Screen
						name="SettingsPage"
						component={SettingsPage}

						options={{
							tabBarLabel: 'Settings',
							tabBarIcon: function icon ({ color, focused }) {
								return (
									<Feather
										name="settings"
										size={25}
										color={focused ? '#1c5ed6' : color}
									/>
								)
							}
						}}
					/>

				</Navigator>
			</NavigationContainer>
			}

			{ !userData && <LoadingPage />}

		</>
	)
}

export default AppRoutes
