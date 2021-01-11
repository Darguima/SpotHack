import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Entypo from 'react-native-vector-icons/Entypo'

import downloadMachine, { downloadStatusSchema } from '../../../../SpotHack_Core/DownloadMachine'
import DownloadProgressView from '../../../Components/DownloadProgressView'

interface downloadStatusSchemaWithIndex extends downloadStatusSchema {
  index: number
}

const DownloadingMusicsStatusPage:React.FC = () => {
  const [musicsDownloadStatus, setMusicsDownloadStatus] = useState([] as Array<downloadStatusSchemaWithIndex>)
  const [errorMessage, setErrorMessage] = useState('Wait a moment')

  const { goBack } = useNavigation()

  useEffect(() => {
    const updateDownloadStatusInterval = setInterval(() => {
      try {
        const downloadStatus = downloadMachine.getDownloadsStatus(true).map((item, index) => {
          return {
            ...item,
            index
          }
        }) as Array<downloadStatusSchemaWithIndex>

        if (downloadStatus.length === 0) setErrorMessage('No downloads at the moment')

        setMusicsDownloadStatus(downloadStatus)
      } catch (err) {
        setErrorMessage(JSON.stringify(err))
      }
    }, 500)

    // Finish this loop when the Component isn't focused
    // Set progress params in FFmpeg for better performance
    // Try watch the class "downloadMachine" for don't need have a interval

    return () => {
      clearInterval(updateDownloadStatusInterval)
    }
  }, [])

  const renderItem = ({ item }: {item: downloadStatusSchemaWithIndex}) => (
    <DownloadProgressView
      downloadStatus={item}
      style={{
        marginTop: item.index === 0 ? '4%' : '2%',
        marginBottom: item.index === musicsDownloadStatus.length - 1 ? '4%' : '2%'
      }}
    />
  )

  return (
    <View style={styles.container}>

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity style={styles.goBackIconContainer} onPress={goBack}>
                <Entypo name="chevron-left" style={styles.goBackIcon} size={30}/>
              </TouchableOpacity>
            </View>

            {musicsDownloadStatus.length === 0 &&
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            }
          </>
        }

        style={styles.flatListStyle}

        data={musicsDownloadStatus}
        renderItem={renderItem}
        keyExtractor={item => item.spotifyInfo!.spotifyId}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',

    backgroundColor: '#000'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    width: '100%',
    height: 60,

    backgroundColor: '#1c5ed6'
  },

  goBackIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    height: '100%',
    aspectRatio: 1
  },

  goBackIcon: {

    color: '#fff'
  },

  flatListStyle: {
    width: '100%'
  },

  errorMessage: {
    textAlign: 'center',
    fontSize: 18,
    margin: '4%'
  }
})

export default DownloadingMusicsStatusPage
