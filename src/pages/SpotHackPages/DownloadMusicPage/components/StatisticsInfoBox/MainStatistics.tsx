import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {statisticsSchema} from '../../../../../SpotHack_Core/DownloadMachine';

interface MainStatisticsProps {
  downloadStatistics: statisticsSchema;
  showAlreadyDownloadedMusics: boolean;
}

const MainStatistics: React.FC<MainStatisticsProps> = ({
  downloadStatistics: dlStatistics,
  showAlreadyDownloadedMusics,
}) => {
  return (
    <View style={styles.mainStatisticsContainer}>
      <View style={styles.statusContainers}>
        <MaterialCommunityIcons
          name={'playlist-music'}
          style={styles.icon}
          size={22}
        />

        <Text style={styles.iconText}>
          {showAlreadyDownloadedMusics
            ? dlStatistics.queueLength
            : dlStatistics.queueLength - dlStatistics.alreadyDownloadedMusics}
        </Text>
      </View>

      <View style={styles.statusContainers}>
        <MaterialCommunityIcons
          name={'database'}
          style={styles.icon}
          size={22}
        />

        <Text style={styles.iconText}>
          {dlStatistics.musicsWithDownloadUrl}
        </Text>
      </View>

      <View style={styles.statusContainers}>
        <MaterialCommunityIcons
          name={'download'}
          style={styles.icon}
          size={22}
        />

        <Text style={styles.iconText}>
          {dlStatistics.downloadedMusicVideos}
        </Text>
      </View>

      <View style={styles.statusContainers}>
        <MaterialCommunityIcons
          name={'music-note'}
          style={styles.icon}
          size={22}
        />

        <Text style={styles.iconText}>{dlStatistics.convertedVideos}</Text>
      </View>

      <View style={styles.statusContainers}>
        <MaterialCommunityIcons
          name={'content-save'}
          style={styles.icon}
          size={22}
        />

        <Text style={styles.iconText}>
          {showAlreadyDownloadedMusics
            ? dlStatistics.downloadedMusics +
              dlStatistics.alreadyDownloadedMusics
            : dlStatistics.downloadedMusics}
        </Text>
      </View>

      {dlStatistics.errors.length > 0 && (
        <View style={styles.statusContainers}>
          <MaterialCommunityIcons
            name={'alert-octagram'}
            style={[styles.icon, {color: '#f00'}]}
            size={22}
          />

          <Text style={styles.iconText}>{dlStatistics.errors.length}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainStatisticsContainer: {
    flexDirection: 'row',

    height: 80,
  },

  statusContainers: {
    flex: 1,

    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  icon: {
    color: '#0f0',
  },

  iconText: {
    color: '#fff',
  },
});

export default MainStatistics;
