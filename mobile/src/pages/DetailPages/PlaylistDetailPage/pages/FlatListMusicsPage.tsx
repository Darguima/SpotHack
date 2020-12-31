import React from 'react'
import { ImageSourcePropType, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import MusicPlaylistView from '../../../Components/MusicPlaylistView'

import Entypo from 'react-native-vector-icons/Entypo'

import convertArtistsArrayToString from '../../../../utils/convertArtistsArrayToString'

interface FlatListSpotifyApiTrackResponseFiltered extends SpotifyApi.TrackObjectFull {
  image: ImageSourcePropType,
  index: number
}

const FlatListMusics:React.FC<StackScreenProps<any>> = ({ route: { params } }) => {
  const musicsArray: Array<SpotifyApi.PlaylistTrackObject> = params!.musicsArray || []

  const { navigate, goBack } = useNavigation()

  const tracksArray: Array<FlatListSpotifyApiTrackResponseFiltered> = musicsArray.map((item, index) => {
    const track = item.track

    const image = track.album.images.length > 0
      ? { uri: (track.album.images[1] || track.album.images[0]).url }
      : require('../../../../assets/graySquare.jpg')

    return { ...track, image, index }
  })

  const renderItem = ({ item }: {item: FlatListSpotifyApiTrackResponseFiltered}) => (
    <MusicPlaylistView
        key={item.index}

        style={{
          marginTop: item.index === 0 ? '4%' : '2%',
          marginBottom: item.index === tracksArray.length - 1 ? '4%' : '2%'
        }}

        imageSource={item.image}
        title={item.name}
        artists={convertArtistsArrayToString(item.artists)}

        viewPressAction={() => {
          navigate('MusicDetailPage', {
            spotifyId: item.id,
            image: item.image,
            title: item.name,
            artists: convertArtistsArrayToString(item.artists)
          })
        }}

        entypoIconName="chevron-right"
        iconPressAction={() => {
          navigate('MusicDetailPage', {
            spotifyId: item.id,
            image: item.image,
            title: item.name,
            artists: convertArtistsArrayToString(item.artists)
          })
        }}
      />
  )

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <TouchableOpacity style={styles.goBackIconContainer} onPress={goBack}>
              <Entypo name="chevron-left" style={styles.goBackIcon} size={30}/>
            </TouchableOpacity>
          </View>
        }

        style={{ width: '100%' }}

        data={tracksArray}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',

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
  }
})

export default FlatListMusics
