import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ImageSourcePropType, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'

import YoutubeData from './Components/YoutubeData'
import MusicData from './Components/MusicData'
import AlbumData from './Components/AlbumData'
import ArtistsData from './Components/ArtistsData'

import spotifyApi from '../../../services/spotify/spotifyApi'

import convertArtistsArrayToString from '../../../utils/convertArtistsArrayToString'

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
  { spotifyId, image = require('../../../assets/graySquare.jpg'), title = 'Music', artists = 'Artists' }
  }
}) => {
  const [musicInfo, setMusicInfo] = useState({
    spotifyId,
    image,
    title,
    artists,

    duration: 0,
    explicit: false,
    spotifyPopularity: 0,
    trackNumber: 0,

    albumTitle: 'Album Title',
    albumArtists: 'Album Artists',
    albumReleaseDate: '00-00-0000',
    albumTotalTracks: 0,

    artistsArray: [{
      name: 'Artist',
      spotifyId: ''
    }]

  })

  const { goBack } = useNavigation()

  useEffect(() => {
    (async () => {
      const response: SpotifyApi.SingleTrackResponse = (await spotifyApi.get(`tracks/${spotifyId}`)).data

      const newMusicInfo = {
        spotifyId,

        image: response.album.images.length > 0
          ? { uri: response.album.images[0].url }
          : require('../../../assets/graySquare.jpg'),

        title: response.name,
        artists: convertArtistsArrayToString(response.artists),

        duration: response.duration_ms,
        explicit: response.explicit,
        spotifyPopularity: response.popularity,
        trackNumber: response.track_number,

        albumTitle: response.album.name,
        albumArtists: convertArtistsArrayToString(response.album.artists),
        albumReleaseDate: response.album.release_date,
        albumTotalTracks: response.album.total_tracks || 0, // total_tracks don't is recognized by typescript, but it exists (you need add it on the node_modules)

        artistsArray: response.artists.map(item => ({ name: item.name, spotifyId: item.id }))
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

        <YoutubeData
          spotifyId={musicInfo.spotifyId}
          title={musicInfo.title}
          artists={musicInfo.artists}
        />

       <MusicData
        title={musicInfo.title}
        artists={musicInfo.artists}
        duration={musicInfo.duration}
        explicit={musicInfo.explicit}
        spotifyPopularity={musicInfo.spotifyPopularity}
        trackNumber={musicInfo.trackNumber}
       />

      <AlbumData
        title={musicInfo.albumTitle}
        artists={musicInfo.albumArtists}
        releaseDate={musicInfo.albumReleaseDate}
        totalTracks={musicInfo.albumTotalTracks}
       />

       <ArtistsData
        artistsArray={musicInfo.artistsArray}
       />

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
