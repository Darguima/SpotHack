import React, { useEffect } from 'react'

import SearchPlaylistPage from '../pages/SearchPlaylistPage'

import { createStackNavigator } from '@react-navigation/stack'
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'

import useAppUtils from '../contexts/appUtils'

const { Navigator, Screen } = createStackNavigator()

const SearchPlaylistRoutes: React.FC<MaterialTopTabScreenProps<any>> = ({ navigation }) => {
  const { changePlaylistSearchInputValue } = useAppUtils()

  useEffect(() => {
    const addListenerTabPress = () => {
      navigation.addListener('tabPress', handleTabPress)
    }

    const removeListenerTabPress = () => {
      navigation.removeListener('tabPress', handleTabPress)
    }

    const handleTabPress = () => {
      changePlaylistSearchInputValue('')
    }

    navigation.addListener('focus', addListenerTabPress)

    navigation.addListener('blur', removeListenerTabPress)

    return () => {
      navigation.removeListener('focus', addListenerTabPress)
      navigation.removeListener('blur', removeListenerTabPress)
    }
  }, [changePlaylistSearchInputValue])

  return (
    <Navigator screenOptions={{ headerShown: false }}>

      <Screen name="SearchPlaylistPage" component={SearchPlaylistPage}/>

    </Navigator>
  )
}

export default SearchPlaylistRoutes
