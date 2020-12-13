import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Text, View, StyleSheet, ScrollView } from 'react-native'

import SearchBarHeader from '../Components/SearchBarHeader'
import MusicPlaylistView from '../Components/MusicPlaylistView'

import spotifyApi, { spotifyApiTrackSearchResponseItems } from '../../services/spotifyApi'
import convertArtistsArrayToString from '../../utils/convertArtistsArrayToString'
import useUserHistory, { musicsSpotifyResponseSchema } from '../../contexts/userHistory'

const SearchMusicPage:React.FC = () => {
  const [searchedMusic, setSearchedMusic] = useState('')

  const [errorMessage, setErrorMessage] = useState<Array<string>>([])
  const [musicsSpotifyResponse, setMusicsSpotifyResponse] = useState <Array<musicsSpotifyResponseSchema>>([])

  const { musicSearchHistory, addMusicToMusicSearchHistory, removeMusicFromMusicSearchHistory } = useUserHistory()

  const { navigate } = useNavigation()

  useEffect(() => {
    setMusicsSpotifyResponse([])
    setErrorMessage(['Searching'])
    if (searchedMusic) {
      (async () => {
        try {
          const response: spotifyApiTrackSearchResponseItems = (await spotifyApi.get('search', {
            params: {
              q: encodeURI(searchedMusic),
              type: 'track'
            }
          })).data

          const musics = response.tracks.items.map(item => {
            return {
              spotifyId: item.id,

              image: item.album.images.length > 0
                ? { uri: (item.album.images[1] || item.album.images[0]).url }
                : require('../../assets/icons/defaultIcon.png'),

              title: item.name,
              artists: convertArtistsArrayToString(item.artists)
            }
          })

          setMusicsSpotifyResponse(musics)
          if (musics.length === 0) {
            setErrorMessage(['No tracks found'])
          } else {
            setErrorMessage([])
          }
        } catch (err) {
          try {
            setErrorMessage(['Something went wrong!', `Spotify Api - ${err.response.data.error.message}`])
            setMusicsSpotifyResponse([])
          } catch (err) {
            setErrorMessage(['Something went wrong!'])
            setMusicsSpotifyResponse([])
          }
        }
      })()
    } else {
      setErrorMessage([])
    }
  }, [searchedMusic])

  return (
    <View style={styles.container}>
      <SearchBarHeader
        setState={setSearchedMusic}

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
                  navigate('MusicDetailPage', { spotifyId: item.spotifyId })
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
                navigate('MusicDetailPage', { spotifyId: item.spotifyId })
                addMusicToMusicSearchHistory(item)
              }}
              entypoIconName="chevron-right"
              iconPressAction={() => {
                navigate('MusicDetailPage', { spotifyId: item.spotifyId })
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
