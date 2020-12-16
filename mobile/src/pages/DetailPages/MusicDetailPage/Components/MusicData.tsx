import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import convertMilisecondsToMinutes from '../../../../utils/convertMilisecondsToMinutes'

import ContentBox from '../../../Components/ContentBox'

interface MusicDataProps {
  title: string,
  artists: string,
  duration: number,
  explicit: boolean,
  spotifyPopularity: number,
  trackNumber: number
}

const MusicData:React.FC<MusicDataProps> = ({ title, artists, duration, explicit, spotifyPopularity, trackNumber }) => {
  return (
    <ContentBox title="Music Info">

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
        <Text style={styles.InfoTitleText}>Duration:</Text>
        <Text style={styles.infoText}>
          {`${convertMilisecondsToMinutes(duration).minutes} min ${(convertMilisecondsToMinutes(duration).seconds).toString().padStart(2, '0')} sec`}
        </Text>
      </View>

      <View style={styles.InfoContainer}>
        <Text style={styles.InfoTitleText}>Explicit:</Text>
        <Text style={styles.infoText}>
          {explicit ? 'True' : 'False'}
        </Text>
      </View>

      <View style={styles.InfoContainer}>
        <Text style={styles.InfoTitleText}>Spotify Popularity:</Text>
        <Text style={styles.infoText}>
          {spotifyPopularity}
        </Text>
      </View>

      <View style={[styles.InfoContainer, { paddingBottom: 0 }]}>
        <Text style={styles.InfoTitleText}>Album Track Number:</Text>
        <Text style={styles.infoText}>
          {trackNumber}
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

export default MusicData
