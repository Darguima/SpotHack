import React, { useEffect } from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'

import SearchMusicPage from '../pages/SearchMusicPage'
import MusicDetailPage from '../pages/MusicDetailPage'

import useAppUtils from '../contexts/appUtils'

const { Navigator, Screen } = createStackNavigator()

const SearchMusicRoutes: React.FC<MaterialTopTabScreenProps<any>> = ({ navigation }) => {
  const { changeMusicSearchInputValue } = useAppUtils()

  useEffect(() => {
    const addListenerTabPress = () => {
      navigation.addListener('tabPress', handleTabPress)
    }

    const removeListenerTabPress = () => {
      navigation.removeListener('tabPress', handleTabPress)
    }

    const handleTabPress = () => {
      changeMusicSearchInputValue('')
    }

    navigation.addListener('focus', addListenerTabPress)

    navigation.addListener('blur', removeListenerTabPress)

    return () => {
      navigation.removeListener('focus', addListenerTabPress)
      navigation.removeListener('blur', removeListenerTabPress)
    }
  }, [changeMusicSearchInputValue])

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SearchMusicPage" component={SearchMusicPage}/>

      <Screen name="MusicDetailPage" component={MusicDetailPage} initialParams={{ spotifyId: '' }}/>
    </Navigator>
  )
}

export default SearchMusicRoutes
