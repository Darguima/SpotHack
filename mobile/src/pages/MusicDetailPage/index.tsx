import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ImageSourcePropType, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

import { Entypo } from '@expo/vector-icons'

import spotifyApi, { spotifyApiTrackResponseItems } from '../../services/spotifyApi'
import convertArtistsArrayToString from '../../utils/convertArtistsArrayToString'
import { useNavigation } from '@react-navigation/native'

interface MusicDetailPageProps {
  route: {
    params: {
      spotifyId: string,

      image?: ImageSourcePropType,

      title?: string,
      artists?: string
    }
  }
}

const MusicDetailPage:React.FC<MusicDetailPageProps> = ({
  route: {
    params:
  { spotifyId, image = require('../../assets/icons/defaultIcon.png'), title = 'Music', artists = 'Artists' }
  }
}) => {
  const [musicInfo, setMusicInfo] = useState({
    spotifyId,
    image,
    title,
    artists
  })

  const { goBack } = useNavigation()

  useEffect(() => {
    (async () => {
      const response: spotifyApiTrackResponseItems = (await spotifyApi.get(`tracks/${spotifyId}`)).data

      const newMusicInfo = {
        spotifyId,

        image: response.album.images.length > 0
          ? { uri: response.album.images[0].url }
          : require('../../assets/icons/defaultIcon.png'),

        title: response.name,
        artists: convertArtistsArrayToString(response.artists)
      }

      setMusicInfo(newMusicInfo)
    })()
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroolViewContentContainerStyle}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.goBackIconContainer} onPress={goBack}>
            <Entypo name="chevron-left" style={styles.goBackIcon} size={30}/>
          </TouchableOpacity>
        </View>

        <View style={styles.mainImageContainer}>
          <Image source={musicInfo.image} style={styles.mainImage} />
        </View>

        <View style={styles.musicTitleArtistsContainer}>
          <Text style={styles.musicTitleText}>{musicInfo.title}</Text>
          <Text style={styles.musicArtistsText}>{musicInfo.artists}</Text>
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#000'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    width: '100%',
    height: 60,

    backgroundColor: '#1c5ed6'
  },

  goBackIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    height: '100%',
    aspectRatio: 1
  },

  goBackIcon: {

    color: '#fff'
  },

  scroolViewContentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center'
  },

  mainImageContainer: {
    width: '50%',
    aspectRatio: 1,

    marginTop: 50
  },

  mainImage: {
    width: '100%',
    height: '100%'
  },

  musicTitleArtistsContainer: {
    alignItems: 'center',

    width: '80%',
    marginTop: '15%'
  },

  musicTitleText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 25,

    marginBottom: '4%'
  },

  musicArtistsText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 20
  }
})

export default MusicDetailPage
