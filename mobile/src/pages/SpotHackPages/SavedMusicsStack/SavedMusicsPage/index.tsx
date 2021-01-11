import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const SavedMusicPage:React.FC = () => {
  const { navigate } = useNavigation()

  return (
    <View style={styles.container}>
      <Text>Saved Music</Text>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => { navigate('DownloadingMusicsStatusPage') }}
      >
        <Text>See Donwloads</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',

    backgroundColor: '#000'
  },

  downloadButton: {
    backgroundColor: '#444',
    padding: '5%',
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#fff'
  }
})

export default SavedMusicPage
