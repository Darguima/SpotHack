import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

import { useNavigation } from '@react-navigation/native'

const Home:React.FC = () => {
  const { navigate } = useNavigation()

  return (
    <View
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center'
        }}
      >

        <View style={[styles.imagesButtonContainer, { marginTop: '10%' }]}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => navigate('SearchMusicPage')}
          >
            <Image
              source={require('../../assets/searchMusic.png')}
              style={styles.images}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imagesButtonContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => navigate('PlaylistsPage')}
          >
            <Image
              source={require('../../assets/playlists.png')}
              style={styles.images}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imagesButtonContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => navigate('SavedMusicPage')}
          >
            <Image
              source={require('../../assets/savedMusic.png')}
              style={styles.images}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.imagesButtonContainer, { marginBottom: '10%' }]}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => navigate('SettingsPage')}
          >
            <Image
              source={require('../../assets/settings.png')}
              style={styles.images}
            />
          </TouchableOpacity>
        </View>

      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',

    width: '100%',
    height: '100%',

    backgroundColor: '#000'
  },

  scrollView: {
    width: '100%'
  },

  imagesButtonContainer: {
    width: '80%',
    aspectRatio: 1.5,

    marginVertical: '5%'
  },

  imageButton: {
    width: '100%',
    height: '100%'

  },

  images: {
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',

    borderRadius: 25

  }
})

export default Home
