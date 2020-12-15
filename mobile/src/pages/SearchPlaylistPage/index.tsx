import React, { useEffect, useState } from 'react'
import { View, StyleSheet, BackHandler } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import SearchBarHeader from '../Components/SearchBarHeader'

import useAppUtils from '../../contexts/appUtils'

const SearchPlaylistPage:React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [searchedPlaylist, setSearchedPlaylist] = useState('')
  const { changePlaylistSearchInputValue, setChangePlaylistSearchInputValue } = useAppUtils()

  // const [errorMessage, setErrorMessage] = useState<Array<string>>([])
  // const [musicsSpotifyResponse, setMusicsSpotifyResponse] = useState <Array<musicsSpotifyResponseSchema>>([])

  // const { musicSearchHistory, addMusicToMusicSearchHistory, removeMusicFromMusicSearchHistory } = useUserHistory()

  // const { navigate } = useNavigation()

  useEffect(() => {
    const addListenerBackPress = () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress)
    }

    const removeListenerBackPress = () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress)
    }

    const handleBackButtonPress = () => {
      if (searchedPlaylist === '') {
        return false
      } else {
        changePlaylistSearchInputValue('')
        return true
      }
    }

    if (navigation.isFocused()) {
      addListenerBackPress()
      navigation.addListener('focus', addListenerBackPress)
    } else {
      navigation.addListener('focus', addListenerBackPress)
    }

    navigation.addListener('blur', removeListenerBackPress)

    return () => {
      navigation.removeListener('focus', addListenerBackPress)
      navigation.removeListener('blur', removeListenerBackPress)

      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress)
    }
  }, [changePlaylistSearchInputValue, searchedPlaylist])

  return (
    <View style={styles.container}>

      <SearchBarHeader
        setState={setSearchedPlaylist}
        setChangeInputValue={setChangePlaylistSearchInputValue}

        inputPlaceholder="Search a playlist"

        viewBackgroundColor="#1c5ed6"
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#000'
  }
})

export default SearchPlaylistPage
