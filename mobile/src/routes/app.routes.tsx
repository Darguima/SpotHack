import React, { useEffect } from 'react'
import { Dimensions, Image } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import SearchMusicRoutes from './searchMusic.routes'
import PlaylistsPage from '../pages/PlaylistsPage'
import Home from '../pages/Home'
import SavedMusicPage from '../pages/SavedMusicPage'
import SettingsPage from '../pages/SettingsPage'

import { UserDataProvider } from '../contexts/userData'
import useAuth from '../contexts/auth'
import LoadingPage from '../pages/LoadingPage'

const { Navigator, Screen } = createMaterialTopTabNavigator()

const AppRoutes: React.FC = () => {
  const { signed } = useAuth()

  return (
    <>
    {signed &&
      <NavigationContainer>
      <UserDataProvider>
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
            name="SearchMusicRoutes"
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
            name="PlaylistsPage"
            component={PlaylistsPage}

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
            component={Home}

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
            component={SavedMusicPage}

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
                  <MaterialCommunityIcons
                    name="account-settings"
                    size={25}
                    color={focused ? '#1c5ed6' : color}
                  />
                )
              }
            }}
          />

        </Navigator>
      </UserDataProvider>
      </NavigationContainer>
    }
    {!signed && <LoadingPage />}
    </>
  )
}

export default AppRoutes
