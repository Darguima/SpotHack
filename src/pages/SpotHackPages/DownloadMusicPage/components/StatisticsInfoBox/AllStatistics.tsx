import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import YoutubeIdSourcesIcons from '../../../../Components/YoutubeIdSourcesIcons';

import {statisticsSchema} from '../../../../../SpotHack_Core/DownloadMachine';
import {infoSourceIcon} from '../../../../../SpotHack_Core/GetYoutubeUrl';

interface AllStatisticsProps {
  downloadStatistics: statisticsSchema;
  showAlreadyDownloadedMusics: boolean;
}

const AllStatistics: React.FC<AllStatisticsProps> = ({
  downloadStatistics: dlStatistics,
  showAlreadyDownloadedMusics,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <MaterialCommunityIcons
          name={'playlist-music'}
          style={styles.icon}
          size={22}
        />

        <View style={styles.rowTextContainer}>
          <Text style={styles.rowText}>
            Musics on Queue:{' '}
            {showAlreadyDownloadedMusics
              ? dlStatistics.queueLength
              : dlStatistics.queueLength - dlStatistics.alreadyDownloadedMusics}
          </Text>

          <Text style={styles.rowText}>
            Active Musics on Queue:{' '}
            {dlStatistics.queueLength -
              dlStatistics.downloadedMusics -
              dlStatistics.alreadyDownloadedMusics -
              dlStatistics.errors.length}
          </Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <MaterialCommunityIcons
          name={'database'}
          style={styles.icon}
          size={22}
        />

        <View style={styles.rowTextContainer}>
          <Text style={styles.rowText}>
            Youtube Ids: {dlStatistics.musicsWithYoutubeId}
          </Text>
          {dlStatistics.musicsWithYoutubeId !== 0 && (
            <>
              <Text style={styles.rowText}>Youtube Ids Sources:</Text>

              <View style={styles.rowTextContainer}>
                {Object.keys(dlStatistics.youtubeIdsSources).map(key => {
                  return (
                    <View key={key} style={{flexDirection: 'row'}}>
                      <Text style={styles.rowText}>
                        &#8594; {key} - {dlStatistics.youtubeIdsSources[key]}{' '}
                      </Text>
                      <YoutubeIdSourcesIcons iconName={key as infoSourceIcon} />
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <Text style={styles.rowText}>
            {'\n'}Download Urls: {dlStatistics.musicsWithDownloadUrl}
          </Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <MaterialCommunityIcons
          name={'download'}
          style={styles.icon}
          size={22}
        />

        <View style={styles.rowTextContainer}>
          <Text style={styles.rowText}>
            Downloaded Videos: {dlStatistics.downloadedMusicVideos}
          </Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <MaterialCommunityIcons
          name={'music-note'}
          style={styles.icon}
          size={22}
        />

        <View style={styles.rowTextContainer}>
          <Text style={styles.rowText}>
            Converted Videos: {dlStatistics.convertedVideos}
          </Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <MaterialCommunityIcons
          name={'content-save'}
          style={styles.icon}
          size={22}
        />

        <View style={styles.rowTextContainer}>
          <Text style={styles.rowText}>
            Downloaded Musics: {dlStatistics.downloadedMusics}
          </Text>
          <Text style={styles.rowText}>
            Already Downloaded: {dlStatistics.alreadyDownloadedMusics}
          </Text>
        </View>
      </View>

      {dlStatistics.errors.length !== 0 && (
        <View style={styles.rowContainer}>
          <MaterialCommunityIcons
            name={'alert-octagram'}
            style={[styles.icon, {color: '#f00'}]}
            size={22}
          />

          <View style={styles.rowTextContainer}>
            <Text style={styles.rowText}>
              Errors: {dlStatistics.errors.length}
            </Text>

            <View style={styles.rowTextContainer}>
              {dlStatistics.errors.map((youtubeQuery, index) => (
                <Text style={styles.rowText} key={index}>
                  &#8594; {youtubeQuery}
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    width: '100%',

    borderTopWidth: 1,
    borderColor: '#444',
  },

  icon: {
    color: '#0f0',
    paddingHorizontal: '5%',
  },

  rowTextContainer: {
    borderLeftWidth: 1,
    borderColor: '#444',

    paddingVertical: '3%',
    paddingHorizontal: '5%',
  },

  rowText: {
    color: '#fff',
  },
});

export default AllStatistics;
