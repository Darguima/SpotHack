import React from 'react'
import { Text, View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import SpotifyAccountSettings from './Components/SpotifyAccountSettings'
import SpotHackSettings from './Components/SpotHackSettings'

const SettingsPage:React.FC = () => {
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainerStyle}
        keyboardShouldPersistTaps={'handled'}
      >

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <SpotifyAccountSettings />
        <SpotHackSettings />

      </ScrollView>
    </KeyboardAvoidingView>
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

  scrollViewContentContainerStyle: {
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
