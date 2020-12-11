import React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import useAuth from '../../../contexts/auth'
import useUserData from '../../../contexts/userData'

const SpotifyAccountSettings:React.FC = () => {
  const { logOut } = useAuth()
  const { userData } = useUserData()

  return (
    <View style={styles.spotifyAccountSettingsContainer}>
      <Text style={styles.containerTitle}>Spotify Settings</Text>

      <View style={styles.userDataContainer}>
        <Image
          source={
            userData.images.length !== 0
              ? { uri: userData.images[0].url }
              : require('../../../assets/icons/defaultIcon.png')
          }
          style={styles.userDataImage}
        />

        <Text style={styles.userDataUsername}>{userData.display_name}</Text>
      </View>

      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.6}
          onPress={logOut}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  spotifyAccountSettingsContainer: {
    width: '90%',

    marginVertical: '10%',
    padding: '5%',

    borderColor: '#1c5ed6',
    borderWidth: 3,
    borderRadius: 10
  },

  containerTitle: {
    color: '#aaa',
    fontSize: 18,
    fontWeight: 'bold',

    borderBottomColor: '#aaa',
    borderWidth: 2
  },

  userDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    marginTop: '10%'
  },

  userDataImage: {
    height: 50,
    width: 50,
    borderRadius: 50
  },

  userDataUsername: {
    color: '#fff',

    marginHorizontal: '10%',
    fontSize: 18
  },

  logoutButtonContainer: {
    width: '40%',

    marginTop: '10%',

    borderColor: '#1c5ed6',
    borderWidth: 1,
    borderRadius: 10
  },

  logoutButton: {
    width: '100%'
  },

  logoutButtonText: {
    textAlign: 'center',
    color: '#1c5ed6',
    fontSize: 17,
    fontWeight: 'bold',

    paddingHorizontal: '5%',
    paddingVertical: '10%'
  }
})

export default SpotifyAccountSettings
