import React from 'react'
import { Text, StyleSheet, Image, View } from 'react-native'

import ContentBox from '../../../Components/ContentBox'

import useAuth from '../../../../contexts/auth'
import useUserData from '../../../../contexts/userData'

const SpotifyAccountSettings:React.FC = () => {
  const { logOut } = useAuth()
  const { userData } = useUserData()

  return (
    <ContentBox
      title="Spotify Settings"

      buttonText="Log Out"
      buttonOnPress={logOut}
    >
      <View style={styles.content}>
        <Image
          source={userData.image}
          style={styles.userDataImage}
        />

        <Text style={styles.userDataUsername}>{userData.display_name}</Text>
      </View>
    </ContentBox>
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

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
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
