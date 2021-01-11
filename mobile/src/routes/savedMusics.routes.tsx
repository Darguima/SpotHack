import React from 'react'

import SavedMusicsPage from '../pages/SpotHackPages/SavedMusicsStack/SavedMusicsPage'
import DownloadingMusicsStatusPage from '../pages/SpotHackPages/SavedMusicsStack/DownloadingMusicsStatusPage'
import MusicDetailPage from '../pages/DetailPages/MusicDetailPage'

import { createStackNavigator } from '@react-navigation/stack'
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'

const { Navigator, Screen } = createStackNavigator()

const SearchPlaylistRoutes: React.FC<MaterialTopTabScreenProps<any>> = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>

      <Screen name="SavedMusicsPage" component={SavedMusicsPage}/>

      <Screen name="DownloadingMusicsStatusPage" component={DownloadingMusicsStatusPage}/>

      <Screen name="MusicDetailPage" component={MusicDetailPage} initialParams={{ spotifyId: '' }}/>
    </Navigator>
  )
}

export default SearchPlaylistRoutes
