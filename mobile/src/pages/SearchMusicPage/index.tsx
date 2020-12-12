import React, { useEffect, useState } from 'react'
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

            image: item.album.images.length > 0 ? { uri: item.album.images[0].url } : require('../../assets/icons/defaultIcon.png'),

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
      />

      <ScrollView style={styles.scroolView}>

        {musicsSpotifyResponse.map((item, index) => {
          return (
            <MusicPlaylistView
              key={index}

              style={styles.musicPlaylistView}

              imageSource={item.image}
              title={item.title}
              artists={item.artists}

              entypoIconName="chevron-right"
              iconPressAction={() => { console.log('pressed') }}
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

  scroolView: {
    marginTop: 15
  },

  musicPlaylistView: {
    marginVertical: '2%'
  }

})

export default SearchMusicPage
