import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

import ContentBox from '../../../Components/ContentBox'

interface AlbumDataProps {
  title: string,
  artists: string,
  releaseDate: string,
  totalTracks: number,
}

const AlbumData:React.FC<AlbumDataProps> = ({ title, artists, releaseDate, totalTracks }) => {
  return (
    <ContentBox title="Album Info">

      <View style={[styles.InfoContainer, { borderTopWidth: 0, paddingTop: 0 }]}>
        <Text style={styles.InfoTitleText}>Title:</Text>
        <Text style={styles.infoText}>
          {title}
        </Text>
      </View>

      <View style={styles.InfoContainer}>
        <Text style={styles.InfoTitleText}>Artists:</Text>
        <Text style={styles.infoText}>
          {artists}
        </Text>
      </View>

      <View style={styles.InfoContainer}>
        <Text style={styles.InfoTitleText}>Release Date:</Text>
        <Text style={styles.infoText}>
          {releaseDate}
        </Text>
      </View>

      <View style={[styles.InfoContainer, { paddingBottom: 0 }]}>
        <Text style={styles.InfoTitleText}>Total Tracks:</Text>
        <Text style={styles.infoText}>
          {totalTracks}
        </Text>
      </View>

    </ContentBox>
  )
}

const styles = StyleSheet.create({
  InfoContainer: {
    borderTopColor: '#aaa',
    borderTopWidth: 1,

    paddingVertical: '2%'
  },

  InfoTitleText: {
    color: '#fff',

    fontSize: 18
  },

  infoText: {
    color: '#aaa',

    marginTop: 6,

    fontSize: 16
  }
})

export default AlbumData
