import React, { useState } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'

import SearchBarHeader from '../Components/SearchBarHeader'
import MusicPlaylistView from '../Components/MusicPlaylistView'

const SearchMusicPage:React.FC = () => {
  const [searchedMusic, setSearchedMusic] = useState('')

  return (
    <View style={styles.container}>
      <SearchBarHeader
        setState={setSearchedMusic}
        inputPlaceholder="Search a music"
      />

      <ScrollView style={styles.scroolView} contentContainerStyle={styles.scroolViewContentContainerStyle}>
        <MusicPlaylistView
          imageSource={require('../../assets/icons/defaultIcon.png')}
          title="My Music"
          artists="My artists"

          entypoIconName="cross"
          iconPressAction={() => { console.log('pressed') }}
        />

        <View style={styles.content}>
          <Text style={{ color: 'white' }}>{searchedMusic}</Text>
          <Text style={{ color: 'white' }}>Search Music</Text>
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

  scroolView: {
    marginTop: 30
  },

  scroolViewContentContainerStyle: {
    flex: 1,
    backgroundColor: '#000'
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#000'
  }
})

export default SearchMusicPage
