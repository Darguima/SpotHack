import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, BackHandler, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import SearchBarHeader from '../../Components/SearchBarHeader'
import NoSearchContent from './Components/NoSearchContent'

import MusicPlaylistView from '../../Components/MusicPlaylistView'

import useAppUtils from '../../../contexts/appUtils'
import useUserHistory, { playlistsSpotifyResponseSchema } from '../../../contexts/userHistory'

import getPlaylitDataFromSpotify from './getPlaylitDataFromSpotify'

import { StackScreenProps } from '@react-navigation/stack'

const SearchPlaylistPage:React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [searchedPlaylist, setSearchedPlaylist] = useState('')
  const { changePlaylistSearchInputValue, setChangePlaylistSearchInputValue } = useAppUtils()

  const [errorMessage, setErrorMessage] = useState<Array<string>>([])
  const [playlistsSpotifyResponse, setPlaylistsSpotifyResponse] = useState <Array<playlistsSpotifyResponseSchema>>([])

  const { addPlaylistToPlaylistSearchHistory } = useUserHistory()

  const { navigate } = useNavigation()

  // Search playlists and save on the state
  useEffect(() => {
    setPlaylistsSpotifyResponse([])
    setErrorMessage(['Searching'])

    if (searchedPlaylist) {
      (async () => {
        const response = await getPlaylitDataFromSpotify(searchedPlaylist)

        setPlaylistsSpotifyResponse(response.response)
        setErrorMessage(response.err)
      })()
    } else {
      setErrorMessage([])
    }
  }, [searchedPlaylist])

  // BackButton Handler
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

        {errorMessage.length !== 0 &&
          errorMessage.map((item, index) => (<Text key={index} style={styles.noTrackFoundText}>{item}</Text>))

        }

        {playlistsSpotifyResponse.map((item, index) => {
          return (
            <MusicPlaylistView
              key={index}

              style={{
                marginTop: index === 0 ? '4%' : '2%',
                marginBottom: index === playlistsSpotifyResponse.length - 1 ? '4%' : '2%'
              }}

              imageSource={item.image}
              title={item.name}
              artists={item.owner}

              viewPressAction={() => {
                navigate('PlaylistDetailPage', {
                  spotifyId: item.spotifyId,
                  image: item.image,
                  name: item.name,
                  owner: item.owner
                })
                addPlaylistToPlaylistSearchHistory(item)
              }}
              entypoIconName="chevron-right"
              iconPressAction={() => {
                navigate('PlaylistDetailPage', {
                  spotifyId: item.spotifyId,
                  image: item.image,
                  name: item.name,
                  owner: item.owner
                })
                addPlaylistToPlaylistSearchHistory(item)
              }}
            />
          )
        })}
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#000'
  },

  noTrackFoundText: {
    width: '100%',
    textAlign: 'center',

    marginVertical: 20,

    fontSize: 18,
    color: '#fff'

  }
})

export default SearchPlaylistPage
