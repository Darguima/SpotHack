import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

const SearchMusicPage:React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Search Music</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',

    backgroundColor: '#000'
  }
})

export default SearchMusicPage
