import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, StyleSheet, ScrollView, ImageSourcePropType } from 'react-native'

import SearchBarHeader from '../Components/SearchBarHeader'
import MusicPlaylistView from '../Components/MusicPlaylistView'

import spotifyApi, { spotifyApiTrackSearchResponseItems } from '../../services/spotifyApi'
import convertArtistsArrayToString from '../../utils/convertArtistsArrayToString'

interface musicsSpotifyResponseSchema {
  spotifyId: string,

  image: ImageSourcePropType,

  title: string,
  artists: string
}

const SearchMusicPage:React.FC = () => {
  const [searchedMusic, setSearchedMusic] = useState('')
  const [musicsSpotifyResponse, setMusicsSpotifyResponse] = useState <Array<musicsSpotifyResponseSchema>>([])

  const { navigate } = useNavigation()

  useEffect(() => {
    if (searchedMusic) {
      (async () => {
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
      })()
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

              viewPressAction={() => { navigate('MusicDetailPage', { spotifyId: item.spotifyId }) }}
              entypoIconName="chevron-right"
              iconPressAction={() => { navigate('MusicDetailPage', { spotifyId: item.spotifyId }) }}
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
  }
})

export default SearchMusicPage
