import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'

import MusicPlaylistView from '../../Components/MusicPlaylistView'

import useUserData from '../../../contexts/userData'

const NoSearchContent:React.FC = () => {
  const [screenIndex, setScreenIndex] = useState<number>(0)

  const { userPlaylists } = useUserData()

  return (
    <View style={styles.container}>

      <View style={styles.topContainer}>
        <Text
          style={[styles.screenToogleText, screenIndex === 0 ? styles.screenToogleTextSelected : {}]}
          onPress={() => { setScreenIndex(0) }}
        >
          History
        </Text>

        <Text
          style={[styles.screenToogleText, screenIndex === 1 ? styles.screenToogleTextSelected : {}]}
          onPress={() => { setScreenIndex(1) }}
        >
          My Playlists
        </Text>
      </View>

      {screenIndex === 1 && userPlaylists.map((item, index) => (
        <MusicPlaylistView
          key={index}

          style={{
            marginTop: index === 0 ? 0 : '2%',
            marginBottom: index === userPlaylists.length - 1 ? '4%' : '2%'
          }}

          imageSource={item.images.length > 0
            ? { uri: (item.images[1] || item.images[0]).url }
            : require('../../../assets/graySquare.jpg')}
          title={item.name}
          artists={item.owner.display_name}

          viewPressAction={() => {}}

          entypoIconName="chevron-right"
          iconPressAction={() => {}}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    paddingVertical: '5%'
  },

  screenToogleText: {
    width: '40%',

    color: '#fff',
    fontSize: 20,

    textAlign: 'center',

    paddingVertical: '2%'
  },

  screenToogleTextSelected: {
    color: '#1c5ed6',
    fontSize: 22,

    textDecorationLine: 'underline'
  }
})

export default NoSearchContent
