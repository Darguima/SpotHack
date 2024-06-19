import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Text,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';

import MusicPlaylistView from '../../../Components/MusicPlaylistView';

import Entypo from 'react-native-vector-icons/Entypo';

import useDownloadsInfo from '../../../../contexts/downloadsInfo';

import {addedMusicToPlaylistInfoSchema} from '../../../../SpotHack_Core/DownloadManager';
import downloadMachine from '../../../../SpotHack_Core/DownloadMachine';

interface Props {
  route: RouteProp<
    {
      params: {
        playlistId: string;
      };
    },
    'params'
  >;
}

const FlatListAddedMusicsPage: React.FC<Props> = ({
  route: {
    params: {playlistId},
  },
}) => {
  const {navigate, goBack} = useNavigation();

  const {playlistsChangesObject} = useDownloadsInfo();

  const addedMusics = (playlistsChangesObject[playlistId] || {added: []}).added;

  const downloadMusic = async (music: addedMusicToPlaylistInfoSchema) => {
    const downloadStatus = await downloadMachine.addMusicsToDownloadQueue([
      {
        spotifyId: music.spotifyId,
        youtubeId: '',

        musicName: music.musicName,
        artists: music.artists,
        thumbnail: music.thumbnail,
        albumName: music.albumName,

        playlistName: music.playlistName,
        playlistId: playlistId,
        youtubeQuery: music.youtubeQuery,

        downloadSource: music.downloadSource,
      },
    ]);

    downloadStatus.successCode
      ? ToastAndroid.show('Downloading Music', ToastAndroid.SHORT)
      : ToastAndroid.show(downloadStatus.msg, ToastAndroid.SHORT);
  };

  const downloadAllMusic = async () => {
    const musicsToDownload = addedMusics.map(music => ({
      spotifyId: music.spotifyId,
      youtubeId: '',

      musicName: music.musicName,
      artists: music.artists,
      thumbnail: music.thumbnail,
      albumName: music.albumName,

      playlistName: music.playlistName,
      playlistId: playlistId,
      youtubeQuery: music.youtubeQuery,

      downloadSource: music.downloadSource,
    }));

    const downloadStatus = await downloadMachine.addMusicsToDownloadQueue(
      musicsToDownload,
    );

    downloadStatus.successCode
      ? ToastAndroid.show('Downloading Playlist', ToastAndroid.SHORT)
      : ToastAndroid.show(downloadStatus.msg, ToastAndroid.SHORT);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: addedMusicToPlaylistInfoSchema;
    index: number;
  }) => (
    <MusicPlaylistView
      key={index}
      style={{
        marginTop: '2%',
        marginBottom: index === addedMusics.length - 1 ? '4%' : '2%',
      }}
      imageSource={{uri: item.thumbnail}}
      title={item.musicName}
      artists={item.artists}
      viewPressAction={() => {
        navigate('MusicDetailPage', {
          spotifyId: item.spotifyId,
          image: {uri: item.thumbnail},
          title: item.musicName,
          artists: item.artists,
        });
      }}
      entypoIconName="download"
      iconSize={22}
      iconPressAction={() => downloadMusic(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.goBackIconContainer}
                onPress={goBack}>
                <Entypo
                  name="chevron-left"
                  style={styles.goBackIcon}
                  size={30}
                />
              </TouchableOpacity>

              <Text style={styles.title}>
                {addedMusics.length} Added Music
                {addedMusics.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {addedMusics.length === 0 && (
              <Text style={styles.noMusicsText}>
                This playlist has no songs to download
              </Text>
            )}

            {addedMusics.length > 0 && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={downloadAllMusic}>
                  <Entypo
                    name={'download'}
                    style={styles.buttonIcon}
                    size={20}
                  />

                  <View style={styles.textContainer}>
                    <Text style={styles.text}>Download</Text>

                    <Text style={styles.text}>
                      {addedMusics.length} Music
                      {addedMusics.length === 1 ? '' : 's'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        style={{width: '100%'}}
        data={addedMusics}
        renderItem={renderItem}
        keyExtractor={(_, index) => `${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',

    backgroundColor: '#000',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    width: '100%',
    height: 60,

    backgroundColor: '#1c5ed6',
  },

  goBackIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    height: '100%',
    aspectRatio: 1,
  },

  goBackIcon: {
    color: '#fff',
  },

  title: {
    flex: 1,

    color: '#fff',
    fontSize: 19,

    textAlign: 'center',
  },

  noMusicsText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',

    marginTop: '5%',
  },

  buttonContainer: {
    alignItems: 'center',
    height: 75,

    backgroundColor: '#111',

    marginTop: '4%',
    marginBottom: '2%',
  },

  button: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',

    backgroundColor: '#212121',

    height: '100%',
    width: '50%',
  },

  buttonIcon: {
    color: '#fff',
  },

  textContainer: {},

  text: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default FlatListAddedMusicsPage;
