import React from 'react'
import { Text, View, StyleSheet, Linking } from 'react-native'

import ContentBox from '../../Components/ContentBox'
import { Feather } from '@expo/vector-icons'

interface YoutubeDataProps {
  youtubeUrl: string
}

const YoutubeData:React.FC<YoutubeDataProps> = ({ youtubeUrl }) => {
  return (
    <ContentBox
      title="Youtube"

      buttonText="Download"
      buttonIcon={<Feather name="download" style={styles.downloadIcon} size={20}/>}
      buttonStyle={{ width: '45%' }}
    >
      <View style={styles.youtubeUrlContainer}>
        <Text style={styles.youtubeUrlTitleText}>Youtube Url:</Text>
        <Text
          style={styles.youtubeUrlText}
          numberOfLines={1}
          onPress={() => { Linking.openURL(youtubeUrl) }}
        >
          {youtubeUrl}
        </Text>
      </View>
    </ContentBox>
  )
}

const styles = StyleSheet.create({
  youtubeUrlContainer: {
  },

  youtubeUrlTitleText: {
    color: '#fff',

    fontSize: 18
  },

  youtubeUrlText: {
    color: '#1c5ed6',

    marginTop: 6,

    fontSize: 16
  },

  donwloadButtonContainer: {
    width: '40%',

    marginTop: '10%',

    borderColor: '#1c5ed6',
    borderWidth: 1,
    borderRadius: 10
  },

  downloadIcon: {
    color: '#1c5ed6',
    marginLeft: '5%'
  }
})

export default YoutubeData
