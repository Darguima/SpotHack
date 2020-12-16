import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Text, View, StyleSheet, ScrollView, BackHandler } from 'react-native'

import SearchBarHeader from '../../Components/SearchBarHeader'
import MusicPlaylistView from '../../Components/MusicPlaylistView'

import getMusicDataFromSpotify from './getMusicDataFromSpotify'

import useUserHistory, { musicsSpotifyResponseSchema } from '../../../contexts/userHistory'
import useAppUtils from '../../../contexts/appUtils'
import { StackScreenProps } from '@react-navigation/stack'

const SearchMusicPage:React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [searchedMusic, setSearchedMusic] = useState('')
  const { changeMusicSearchInputValue, setChangeMusicSearchInputValue } = useAppUtils()

  const [errorMessage, setErrorMessage] = useState<Array<string>>([])
  const [musicsSpotifyResponse, setMusicsSpotifyResponse] = useState <Array<musicsSpotifyResponseSchema>>([])

  const { musicSearchHistory, addMusicToMusicSearchHistory, removeMusicFromMusicSearchHistory } = useUserHistory()

  const { navigate } = useNavigation()

  useEffect(() => {
    setMusicsSpotifyResponse([])
    setErrorMessage(['Searching'])

    if (searchedMusic) {
      (async () => {
        const response = await getMusicDataFromSpotify(searchedMusic)

        setMusicsSpotifyResponse(response.response)
        setErrorMessage(response.err)
      })()
    } else {
      setErrorMessage([])
    }
  }, [searchedMusic])

  useEffect(() => {
    const addListenerBackPress = () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress)
    }

    const removeListenerBackPress = () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress)
    }

    const handleBackButtonPress = () => {
      if (searchedMusic === '') {
        return false
      } else {
        changeMusicSearchInputValue('')
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
  }, [changeMusicSearchInputValue, searchedMusic])

  return (
    <View style={styles.container}>
      <SearchBarHeader
        setState={setSearchedMusic}
        setChangeInputValue={setChangeMusicSearchInputValue}

        inputPlaceholder="Search a music"

        viewBackgroundColor="#1c5ed6"
      />

      <ScrollView>

        {searchedMusic === '' &&
          musicSearchHistory.map((item, index) => {
            return (
              <MusicPlaylistView
                key={index}

                style={{
                  marginTop: index === 0 ? '4%' : '2%',
                  marginBottom: index === musicsSpotifyResponse.length - 1 ? '4%' : '2%'
                }}

                imageSource={item.image}
                title={item.title}
                artists={item.artists}

                viewPressAction={() => {
                  addMusicToMusicSearchHistory(item)
                  navigate('MusicDetailPage', {
                    spotifyId: item.spotifyId,
                    image: item.image,
                    title: item.title,
                    artists: item.artists
                  })
                }}

                entypoIconName="cross"
                iconPressAction={() => {
                  removeMusicFromMusicSearchHistory(item.spotifyId)
                }}
              />
            )
          })}

        {errorMessage.length !== 0 &&
          errorMessage.map((item, index) => (<Text key={index} style={styles.noTrackFounText}>{item}</Text>))

        }

        {musicsSpotifyResponse.map((item, index) => {
          return (
            <MusicPlaylistView
              key={index}

              style={{
                marginTop: index === 0 ? '4%' : '2%',
                marginBottom: index === musicsSpotifyResponse.length - 1 ? '4%' : '2%'
              }}

              imageSource={item.image}
              title={item.title}
              artists={item.artists}

              viewPressAction={() => {
                navigate('MusicDetailPage', {
                  spotifyId: item.spotifyId,
                  image: item.image,
                  title: item.title,
                  artists: item.artists
                })
                addMusicToMusicSearchHistory(item)
              }}
              entypoIconName="chevron-right"
              iconPressAction={() => {
                navigate('MusicDetailPage', {
                  spotifyId: item.spotifyId,
                  image: item.image,
                  title: item.title,
                  artists: item.artists
                })
                addMusicToMusicSearchHistory(item)
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

  noTrackFounText: {
    width: '100%',
    textAlign: 'center',

    marginVertical: 20,

    fontSize: 18,
    color: '#fff'

  }
})

export default SearchMusicPage
