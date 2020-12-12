import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SearchMusicPage from '../pages/SearchMusicPage'

import MusicDetailPage from '../pages/MusicDetailPage'

const { Navigator, Screen } = createStackNavigator()

const SearchMusicRoutes: React.FC = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name="SearchMusicPage" component={SearchMusicPage}/>

    <Screen name="MusicDetailPage" component={MusicDetailPage} initialParams={{ spotifyId: '' }}/>
  </Navigator>
)

export default SearchMusicRoutes
