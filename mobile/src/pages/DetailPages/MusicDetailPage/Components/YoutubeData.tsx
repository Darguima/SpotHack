import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Linking } from 'react-native'

import ContentBox from '../../../Components/ContentBox'
import Feather from 'react-native-vector-icons/Feather'

import getYoutubeInfo, { getYoutubeUrlReturn } from '../../../../SpotHack_Core/GetYoutubeUrl'
import downloadMachine from '../../../../SpotHack_Core/DownloadMachine'

interface YoutubeDataProps {
  spotifyId: string
  title: string,
  artists: string
}


const YoutubeData:React.FC<YoutubeDataProps> = ({ spotifyId, title, artists }) => {
  const [youtubeInfo, setYoutubeInfo] = useState<getYoutubeUrlReturn>({ youtubeUrl: 'Loading ...', success: 0 } as getYoutubeUrlReturn)
  const [downloadButtonColorStyle, setDownloadButtonColorStyle] = useState(undefined as undefined | string)
  const [intervales, setIntervales] = useState([] as Array<NodeJS.Timeout>)

  // change to the global watcher ... thta watch also the already downloaded files
  const watchDownloadStatus = () => {
    const setIntervalId = setInterval(() => {
      const downloadStatus = downloadMachine.getDownloadStatus(spotifyId)

      if (downloadStatus.code === 200) {
        clearInterval(setIntervalId)
        setDownloadButtonColorStyle("#0c0")
      } else if (downloadStatus.code === 0) {
        clearInterval(setIntervalId)
        setDownloadButtonColorStyle("#f00")
      }
    }, 2500)

    return setIntervalId
  }

  useEffect(() => {
    (async () => {
      const youtubeInfo = await getYoutubeInfo(spotifyId, title, artists)
      if (youtubeInfo.success === 1) {
        setYoutubeInfo(youtubeInfo)
      } else {
        setYoutubeInfo({ youtubeUrl: 'Error getting Youtube Url', success: 0 } as getYoutubeUrlReturn)
      }
    })()
  }, [])

  useEffect(() => {
    const downloadStatus = downloadMachine.getDownloadStatus(spotifyId)

    if (downloadStatus.message == "spotifyId invalid") {
      setDownloadButtonColorStyle(undefined)
    } else if (downloadStatus.code === 200) {
      setDownloadButtonColorStyle("#0c0")
    } else if (downloadStatus.code === 0 && downloadStatus.message !== "spotifyId invalid") {
      setDownloadButtonColorStyle("#f00")
    } else if (downloadStatus.code !== 0 && downloadStatus.code !== 200) {
      setDownloadButtonColorStyle("#ff0")
      const setIntervalId = watchDownloadStatus()
      setIntervales([...intervales, setIntervalId])

    }
  }, [])

  useEffect(() => {
    return () => {
      intervales.map(item => {
        clearInterval(item)
      })
    }
  }, [intervales])

  return (
    <ContentBox
      title="Youtube"

      buttonText="Download"
      buttonIcon={
        <Feather
          name="download"
          style={[
            styles.downloadIcon,
            (downloadButtonColorStyle ? {color: downloadButtonColorStyle} : {})
          ]}
          size={20}
        />
      }
      buttonStyle={{ width: '45%' }}
      buttonColorTheme={downloadButtonColorStyle}
      buttonOnPress={() => {
        if (youtubeInfo.success !== 0) {
          downloadMachine.addTrackToQueue(spotifyId, youtubeInfo.youtubeId, title, artists, `${artists} - ${title}`)
          setDownloadButtonColorStyle("#ff0")

          const setIntervalId = watchDownloadStatus()
          setIntervales([...intervales, setIntervalId])
        }
      }}
    >
      <View style={styles.youtubeInfoContainer}>
        <Text style={styles.youtubeInfoTitleText}>Youtube Url:</Text>
        <Text
          style={styles.youtubeInfoText}
          numberOfLines={1}
          onPress={() => {
            if (youtubeInfo.success !== 0) {
              Linking.openURL(youtubeInfo.youtubeUrl)
            }
          }}
        >
          {youtubeInfo.youtubeUrl}
        </Text>
      </View>
    </ContentBox>
  )
}

const styles = StyleSheet.create({
  youtubeInfoContainer: {
  },

  youtubeInfoTitleText: {
    color: '#fff',

    fontSize: 18
  },

  youtubeInfoText: {
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
