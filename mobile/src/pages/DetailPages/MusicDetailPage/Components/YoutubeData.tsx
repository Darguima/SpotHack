import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Linking, ToastAndroid } from 'react-native'

import ContentBox from '../../../Components/ContentBox'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import getYoutubeInfo from '../../../../SpotHack_Core/GetYoutubeUrl'

interface YoutubeDataProps {
  spotifyId: string
  title: string,
  artists: string
}

const YoutubeData:React.FC<YoutubeDataProps> = ({ spotifyId, title, artists }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('Loading ...')

  useEffect(() => {
    (async () => {
      const youtubeInfo = await getYoutubeInfo(spotifyId, title, artists)
      if (youtubeInfo.success === 1) {
        setYoutubeUrl(youtubeInfo.youtubeUrl)
      } else {
        setYoutubeUrl('Error getting Youtube Url')
      }
    })()
  }, [])

  return (
    <ContentBox
      title="Youtube"

      buttonText="Download"
      buttonIcon={<MaterialCommunityIcons name="download" style={styles.downloadIcon} size={17}/>}
      buttonStyle={{ width: '45%' }}
      buttonOnPress={() => {
        ToastAndroid.show("Downloading Music", ToastAndroid.LONG)
      }}
    >
      <View style={styles.youtubeUrlContainer}>
        <Text style={styles.youtubeUrlTitleText}>Youtube Url:</Text>
        <Text
          style={styles.youtubeUrlText}
          numberOfLines={1}
          onPress={() => {
            if (youtubeUrl !== 'Loading ...' && youtubeUrl !== 'Error getting Youtube Url') {
              Linking.openURL(youtubeUrl)
            }
          }}
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

  downloadIcon: {
    color: '#1c5ed6',
    marginLeft: '5%'
  }
})

export default YoutubeData
