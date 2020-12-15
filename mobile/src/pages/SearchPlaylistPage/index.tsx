import React, { useEffect, useState } from 'react'
import { View, StyleSheet, BackHandler } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import SearchBarHeader from '../Components/SearchBarHeader'
import NoSearchContent from './Components/NoSearchContent'

import useAppUtils from '../../contexts/appUtils'

import { StackScreenProps } from '@react-navigation/stack'

const SearchPlaylistPage:React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [searchedPlaylist, setSearchedPlaylist] = useState('')
  const { changePlaylistSearchInputValue, setChangePlaylistSearchInputValue } = useAppUtils()

  // const [errorMessage, setErrorMessage] = useState<Array<string>>([])
  // const [musicsSpotifyResponse, setMusicsSpotifyResponse] = useState <Array<musicsSpotifyResponseSchema>>([])

  // const { musicSearchHistory, addMusicToMusicSearchHistory, removeMusicFromMusicSearchHistory } = useUserHistory()

  // const { navigate } = useNavigation()

  // BackHandler
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

      <ScrollView>
        {searchedPlaylist === '' &&
          <NoSearchContent />
        }
      </ScrollView>

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
