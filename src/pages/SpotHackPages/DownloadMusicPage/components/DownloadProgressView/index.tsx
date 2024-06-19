import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  TouchableOpacity,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {musicOnQueueSchema} from '../../../../../SpotHack_Core/DownloadMachine';
import convertCodeAndErrorsToColor from './convertCodeAndErrorsToColor';
import MemoizedMusicPlaylistView from './MemoizedMusicPlaylistView';

interface DownloadProgressViewProps {
  musicInfo: musicOnQueueSchema;

  style?: ViewStyle;

  contentBackgroundColor?: string;
}

const DownloadProgressView: React.FC<DownloadProgressViewProps> = ({
  musicInfo,
  style,
  contentBackgroundColor = '#212121',
}) => {
  const [showAllErrorInfo, setShowAllErrorInfo] = useState(false);
  const [errorMessageNumOfLines, setErrorMessageNumOfLines] = useState(0);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: contentBackgroundColor},
        style || {},
      ]}>
      <View style={styles.musicViewContainer}>
        <MemoizedMusicPlaylistView
          musicInfo={musicInfo}
          contentBackgroundColor={contentBackgroundColor}
        />
      </View>

      <View style={styles.statusViewContainer}>
        <View style={styles.statusIconsContainers}>
          <MaterialCommunityIcons
            name={'database'}
            style={{
              color: convertCodeAndErrorsToColor(
                1,
                musicInfo.progress,
                musicInfo.stage,
              ),
            }}
            size={22}
          />
        </View>

        <View style={styles.statusIconsContainers}>
          <MaterialCommunityIcons
            name={'download'}
            style={{
              color: convertCodeAndErrorsToColor(
                2,
                musicInfo.progress,
                musicInfo.stage,
              ),
            }}
            size={22}
          />
        </View>

        <View style={styles.statusIconsContainers}>
          <MaterialCommunityIcons
            name={'music-note'}
            style={{
              color: convertCodeAndErrorsToColor(
                3,
                musicInfo.progress,
                musicInfo.stage,
              ),
            }}
            size={22}
          />
        </View>

        <View style={styles.statusIconsContainers}>
          <MaterialCommunityIcons
            name={'content-save'}
            style={{
              color: convertCodeAndErrorsToColor(
                4,
                musicInfo.progress,
                musicInfo.stage,
              ),
            }}
            size={22}
          />
        </View>

        <View style={styles.statusIconsContainers}>
          <Text
            style={[
              styles.progressNumber,
              {
                color:
                  musicInfo.stageProgress === 0 ||
                  musicInfo.stageProgress === 100
                    ? '#000'
                    : '#fff',
              },
            ]}>
            {musicInfo.stageProgress ? musicInfo.stageProgress.toFixed(0) : 0}%
          </Text>
        </View>
      </View>

      {musicInfo.progress === 0 && (
        <View style={styles.errorsContainer}>
          <TouchableOpacity
            onPress={() => setShowAllErrorInfo(!showAllErrorInfo)}
            disabled={errorMessageNumOfLines <= 2}>
            <Text
              style={styles.errorText}
              numberOfLines={showAllErrorInfo ? 0 : 2}
              onTextLayout={e =>
                setErrorMessageNumOfLines(e.nativeEvent.lines.length)
              }>
              {musicInfo.stage}
            </Text>

            {errorMessageNumOfLines > 2 && (
              <Text style={styles.showMoreText}>
                {showAllErrorInfo ? 'Show Less' : 'Show More'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  musicViewContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#444',
  },

  statusViewContainer: {
    flexDirection: 'row',
    paddingVertical: '3%',
  },

  statusIconsContainers: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },

  progressNumber: {
    fontWeight: 'bold',
  },

  errorsContainer: {
    borderTopWidth: 2,
    borderTopColor: '#444',

    paddingVertical: '3%',
  },

  errorText: {
    color: '#fff',
  },

  showMoreText: {
    color: '#aaa',
    textAlign: 'center',

    marginTop: 5,
  },
});

export default React.memo(DownloadProgressView, (prevProps, nextProps) => {
  if (
    nextProps.musicInfo.progress !== prevProps.musicInfo.progress ||
    nextProps.musicInfo.stageProgress !== prevProps.musicInfo.stageProgress
  ) {
    return false;
  } else {
    return true;
  }
});
