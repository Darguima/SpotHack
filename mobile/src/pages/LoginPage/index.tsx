import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'

import useAuth from '../../contexts/auth'

const LoginPage:React.FC = () => {
  const { logIn, errorOnLogin } = useAuth()

  return (
    <View style={styles.container}>

      <View style={styles.topContainer}>
          <Image
            source={require('../../assets/icons/spothackHorizontal.png')}
            style={styles.spotHackLogo}
          />
      </View>

      {!!errorOnLogin &&
        <View style={styles.errorMsgContainer}>
          <Text style={styles.errorMsg}>{errorOnLogin}</Text>
        </View>
      }

      <TouchableOpacity
        style={styles.bottomContainer}
        onPress={logIn}
        activeOpacity={0.5}
      >
        <View style={styles.spotifyLogoContainer}>
          <Image
            source={require('../../assets/icons/spotifyIcon.png')}
            style={styles.spotifyLogo}
          />
        </View>

        <Text style={styles.buttonText}>Login on Spotify</Text>

      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',

    backgroundColor: '#1c5ed6'
  },

  topContainer: {
    width: '70%',
    height: '20%'
  },

  spotHackLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },

  errorMsgContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    width: '70%',
    height: '12%',

    padding: '2%',

    backgroundColor: '#fff',

    borderRadius: 25,
    borderColor: '#ff0000',
    borderWidth: 2
  },

  errorMsg: {
    color: '#ff2020',

    fontSize: 18,
    fontWeight: 'bold',

    textAlign: 'center'
  },

  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',

    width: '70%',
    height: '12%',
    backgroundColor: '#000',

    padding: '2%',

    borderRadius: 25
  },

  spotifyLogoContainer: {
    width: '21%',
    height: '80%'

  },

  spotifyLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },

  buttonText: {
    color: '#fff',

    fontSize: 18
  }
})

export default LoginPage
