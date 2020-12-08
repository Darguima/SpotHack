import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import SpotifyAccountSettings from './Components/SpotifyAccountSettings'

const SettingsPage:React.FC = () => {
  return (
    <View style={styles.container}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrolViewContentContainerStyle}
      >

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <SpotifyAccountSettings />

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

    backgroundColor: '#000'
  },

  scrollView: {
    width: '100%'
  },

  scrolViewContentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center'
  },

  titleContainer: {
    width: '100%'
  },

  title: {
    marginLeft: '10%',
    marginTop: '10%',

    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
})

export default SettingsPage
