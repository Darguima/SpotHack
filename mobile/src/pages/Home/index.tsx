import React, { useEffect, useState } from 'react'
import { Button, Text, View, StyleSheet } from 'react-native'

import useAuth from '../../contexts/auth'

import spotifyApi from '../../services/spotifyApi'

const Home:React.FC = () => {
  const [spotifyData, setSpotifyData] = useState('wait')
  const { logOut } = useAuth()

  useEffect(() => {
    (async () => {
      try {
        const spotifyResponse = await spotifyApi.get('me')

        setSpotifyData(JSON.stringify(spotifyResponse.data))
      } catch (err) {
        setSpotifyData(JSON.stringify(err.response.data))
      }
    })()
  }, [spotifyApi.defaults.headers.Authorization])

  return (
    <View style={styles.container}>
      <Text>{spotifyData}</Text>
      <Text>{spotifyApi.defaults.headers.Authorization}</Text>

    <Button
        title="LogOut"
        onPress={() => { logOut() }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
})

export default Home
