import React, { useState } from 'react'
import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native'

import SearchBarHeader from '../Components/SearchBarHeader'

const SearchMusicPage:React.FC = () => {
  const [searchedMusic, setSearchedMusic] = useState('')

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} >
      <ScrollView contentContainerStyle={{ flex: 1 }} >
      <SearchBarHeader
        state={searchedMusic}
        setState={setSearchedMusic}
      />

      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Search Music</Text>
        <Text style={{ color: 'white' }}>Search Music</Text>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#000'
  }
})

export default SearchMusicPage
