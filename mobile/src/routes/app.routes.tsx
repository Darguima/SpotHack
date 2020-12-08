import React from 'react'
import { Image } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import SearchMusicPage from '../pages/SearchMusicPage'
import PlaylistsPage from '../pages/PlaylistsPage'
import Home from '../pages/Home'
import SavedMusicPage from '../pages/SavedMusicPage'
import SettingsPage from '../pages/SettingsPage'

import { UserDataProvider } from '../contexts/userData'

const { Navigator, Screen } = createBottomTabNavigator()

const AppRoutes: React.FC = () => (
  <NavigationContainer>
  <UserDataProvider>
    <Navigator
      initialRouteName="Home"
      tabBarOptions={{
        style: {
          height: 60
        },

        labelStyle: {
          fontSize: 12
        },

        inactiveBackgroundColor: '#212121',
        inactiveTintColor: '#fff',
        activeBackgroundColor: '#212121',
        activeTintColor: '#1c5ed6'

      }}
    >

      <Screen
        name="SearchMusicPage"
        component={SearchMusicPage}

        options={{
          tabBarLabel: 'Search Music',
          tabBarIcon: function icon ({ color, size, focused }) {
            return (
              <MaterialCommunityIcons
                name="music-box-outline"
                size={size}
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
          tabBarIcon: function icon ({ color, size, focused }) {
            return (
              <MaterialCommunityIcons
                name="playlist-music-outline"
                size={size}
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
          tabBarIcon: function icon ({ color, size, focused }) {
            return (
              <Image
                source={require('../assets/icons/homeIcon.png')}

                style={{ width: size, height: size }}

                height={size}
                width={size}
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
          tabBarIcon: function icon ({ color, size, focused }) {
            return (
              <MaterialCommunityIcons
                name="file-music-outline"
                size={size}
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
          tabBarIcon: function icon ({ color, size, focused }) {
            return (
              <MaterialCommunityIcons
                name="account-settings"
                size={size}
                color={focused ? '#1c5ed6' : color}
              />
            )
          }
        }}
      />

    </Navigator>
  </UserDataProvider>
  </NavigationContainer>
)

export default AppRoutes
