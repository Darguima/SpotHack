import React from 'react'
import { View, StyleSheet, ViewStyle, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import MusicPlaylistView from '../MusicPlaylistView'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { downloadStatusSchema } from '../../../SpotHack_Core/DownloadMachine'
import convertCodeAndErrorsToColor from './convertCodeAndErrorsToColor'

interface DownloadProgressViewProps {
  downloadStatus: downloadStatusSchema,

  style?: ViewStyle,

  contentBackgroundColor?: string,
}

const DownloadProgressView:React.FC<DownloadProgressViewProps> = ({
  downloadStatus,
  style, contentBackgroundColor = '#212121'
}) => {
  const { navigate } = useNavigation()

  return (
    <View style={[styles.container, { backgroundColor: contentBackgroundColor }, style || {}]}>
      <View style={styles.musicViewContainer}>
        {downloadStatus.spotifyInfo &&
          <MusicPlaylistView
            title={downloadStatus.spotifyInfo.title}
            artists={downloadStatus.spotifyInfo.artists}
            imageSource={downloadStatus.spotifyInfo.imageSource}
            viewBackgroundColor={contentBackgroundColor}
            contentBackgroundColor={contentBackgroundColor}

            viewPressAction={() => {
              navigate('MusicDetailPage', {
                spotifyId: downloadStatus.spotifyInfo!.spotifyId,
                image: downloadStatus.spotifyInfo!.imageSource,
                title: downloadStatus.spotifyInfo!.title,
                artists: downloadStatus.spotifyInfo!.artists
              })
            }}

            entypoIconName="chevron-right"
            iconPressAction={() => {
              navigate('MusicDetailPage', {
                spotifyId: downloadStatus.spotifyInfo!.spotifyId,
                image: downloadStatus.spotifyInfo!.imageSource,
                title: downloadStatus.spotifyInfo!.title,
                artists: downloadStatus.spotifyInfo!.artists
              })
            }}
          />
        }
      </View>

      <View style={styles.statusViewContainer}>
        <View style={[styles.statusIconsContainers, styles.getDataIconContainer]}>
          <MaterialCommunityIcons
            name={'database'}
            style={[
              styles.getDataIcon,
              styles.statusIcons,
              { color: convertCodeAndErrorsToColor(1, downloadStatus.code, downloadStatus.message) }
            ]}
            size={22}
          />
        </View>

        <View style={[styles.statusIconsContainers, styles.downloadIconContainer]}>
          <MaterialCommunityIcons
            name={'download'}
            style={[
              styles.downloadIcon,
              styles.statusIcons,
              { color: convertCodeAndErrorsToColor(2, downloadStatus.code, downloadStatus.message) }
            ]}
            size={22}
          />
        </View>

        <View style={[styles.statusIconsContainers, styles.conversionIconContainer]}>
          <MaterialCommunityIcons
            name={'music-note'}
            style={[
              styles.conversionIcon,
              styles.statusIcons,
              { color: convertCodeAndErrorsToColor(3, downloadStatus.code, downloadStatus.message) }
            ]}
            size={22}
          />
        </View>

        <View style={[styles.statusIconsContainers, styles.saveIconContainer]}>
          <MaterialCommunityIcons
            name={'content-save'}
            style={[
              styles.saveIcon,
              styles.statusIcons,
              { color: convertCodeAndErrorsToColor(4, downloadStatus.code, downloadStatus.message) }
            ]}
            size={22}
          />
        </View>

        <View style={[styles.statusIconsContainers, styles.pogressNumberContainer]}>
          <Text
            style={[
              styles.pogressNumber,
              {
                color: (downloadStatus.progress === 0 || downloadStatus.progress === 100)
                  ? '#000'
                  : '#fff'
              }
            ]}
          >
            {downloadStatus.progress ? downloadStatus.progress.toFixed(0) : 0}%
          </Text>
        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },

  musicViewContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#444'
  },

  statusViewContainer: {
    flexDirection: 'row',
    paddingVertical: '3%'
  },

  statusIconsContainers: {
    justifyContent: 'center',
    alignItems: 'center',

    width: '20%'
  },

  statusIcons: {},

  getDataIconContainer: {},
  getDataIcon: {},

  downloadIconContainer: {},
  downloadIcon: {},

  conversionIconContainer: {},
  conversionIcon: {},

  saveIconContainer: {},
  saveIcon: {},

  pogressNumberContainer: {},
  pogressNumber: {
    fontWeight: 'bold'
  }

})

export default DownloadProgressView
