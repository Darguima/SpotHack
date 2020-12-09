import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SearchMusicPage from '../pages/SearchMusicPage'

const { Navigator, Screen } = createStackNavigator()

const SearchMusicRoutes: React.FC = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name="SearchMusicPage" component={SearchMusicPage}/>
  </Navigator>
)

export default SearchMusicRoutes
