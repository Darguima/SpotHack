import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';
import {homeStackUseNavigator} from '../../../routes/home.routes';

import Header from './components/Header';
import MusicPlaylistView from '../../Components/MusicPlaylistView';

import useSpotHackSettings from '../../../contexts/spotHackSettings';
import useDownloadsInfo from '../../../contexts/downloadsInfo';

import downloadManager, {
  downloadsInfoSchema,
} from '../../../SpotHack_Core/DownloadManager';

const DownloadsManagerPage: React.FC = () => {
  const {navigate} = homeStackUseNavigator();

  const {playlistsChecked} = useDownloadsInfo();
  const {
    spotHackSettings: {rootPath: settingsRootPath},
  } = useSpotHackSettings();
  useEffect(() => {
    setRootPath(settingsRootPath);
  }, [settingsRootPath]);

  const [downloadsInfo, setDownloadsInfo] = useState<downloadsInfoSchema>(
    downloadManager.downloadsInfo,
  );

  const [rootPath, setRootPath] = useState(settingsRootPath);

  useEffect(() => {
    let isMounted = true;
    downloadManager.addOnPlaylistUpdateEventFunction((_, __, downloadsInfo) => {
      if (isMounted) {
        setDownloadsInfo(downloadsInfo);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!playlistsChecked || !downloadsInfo[rootPath]) {
    return (
      <>
        <Header />

        <View style={styles.container}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>We are checking your playlists.</Text>
            <Text style={styles.infoText}>Wait a moment please!</Text>

            <Text style={styles.subInfoText}>
              If the check is taking too long time, try restarting the app.
              {'\n'}
              But maybe it{"'"}s normal if you have a lot of music downloaded.
            </Text>
          </View>

          <View
            style={styles.waitingForThePlaylistsScanActivityIndicatorContainer}>
            <ActivityIndicator size="large" color="#1c5ed6" />
          </View>
        </View>
      </>;
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <Header
        rootPath={rootPath}
        setRootPath={setRootPath}
        rootPaths={Object.keys(downloadsInfo)}
      />

      <MusicPlaylistView
        key={'addPlaylist'}
        title={'Add a Playlist'}
        artists={"that we haven't recognized"}
        artistsNumberOfLines={2}
        imageSource={require('../../../assets/icons/addIcon.png')}
        style={{
          marginTop: '4%',
          marginBottom: '2%',
        }}
        entypoIconName="chevron-right"
        viewPressAction={() =>
          navigate('AddUnrecognizedPlaylistPage', {rootPath, downloadsInfo})
        }
        iconPressAction={() =>
          navigate('AddUnrecognizedPlaylistPage', {rootPath, downloadsInfo})
        }
      />

      <View style={styles.textContainer}>
        <Text style={styles.text}>Downloaded Playlists:</Text>
      </View>

      {Object.keys(downloadsInfo[rootPath]).map((playlistId, index) => {
        const playlist = downloadsInfo[rootPath][playlistId];

        return (
          <MusicPlaylistView
            key={index}
            title={playlist.playlistName}
            artists={`${playlist.tracks.length} music${
              playlist.tracks.length !== 1 ? 's' : ''
            } downloaded`}
            imageSource={playlist.coverImage}
            style={{
              marginTop: '2%',
              marginBottom:
                index === Object.keys(downloadsInfo[rootPath]).length - 1
                  ? '4%'
                  : '2%',
            }}
            entypoIconName="chevron-right"
            viewPressAction={() => {
              navigate('PlaylistDetailPage', {
                spotifyId: playlistId,
                image: playlist.coverImage,
                name: playlist.playlistName,
              });
            }}
            iconPressAction={() => {
              navigate('PlaylistDetailPage', {
                spotifyId: playlistId,
                image: playlist.coverImage,
                name: playlist.playlistName,
              });
            }}
          />;
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  infoTextContainer: {
    justifyContent: 'space-evenly',
    height: '25%',
  },

  infoText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },

  subInfoText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },

  waitingForThePlaylistsScanActivityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  textContainer: {
    marginVertical: '2%',
  },

  text: {
    color: '#fff',
    fontSize: 18,
  },
});

export default DownloadsManagerPage;
