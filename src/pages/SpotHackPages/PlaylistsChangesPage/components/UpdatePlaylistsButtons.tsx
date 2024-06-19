import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import {unlink as deleteFile} from 'react-native-fs';

import Entypo from 'react-native-vector-icons/Entypo';

import useDownloadsInfo from '../../../../contexts/downloadsInfo';

import downloadMachine, {
  musicForQueueSchema,
} from '../../../../SpotHack_Core/DownloadMachine';

const UpdatePlaylistsButtons: React.FC = () => {
  const {playlistsChanges, updatePlaylistsChanges} = useDownloadsInfo();

  const addedMusicsNumber = playlistsChanges.reduce(
    (number, playlist) => number + playlist.added.length,
    0,
  );

  const removedMusicsNumber = playlistsChanges.reduce(
    (number, playlist) => number + playlist.removed.length,
    0,
  );

  const downloadAllPlaylists = async () => {
    const musicsToDownload: Array<musicForQueueSchema> = playlistsChanges
      .map(playlist =>
        playlist.added.map(addedMusic => ({
          spotifyId: addedMusic.spotifyId,
          youtubeId: '',

          musicName: addedMusic.musicName,
          artists: addedMusic.artists,
          thumbnail: addedMusic.thumbnail,
          albumName: addedMusic.albumName,

          playlistName: addedMusic.playlistName,
          playlistId: playlist.playlistId,
          youtubeQuery: addedMusic.youtubeQuery,

          downloadSource: addedMusic.downloadSource,
        })),
      )
      .flat();

    const downloadStatus = await downloadMachine.addMusicsToDownloadQueue(
      musicsToDownload,
    );

    downloadStatus.successCode
      ? ToastAndroid.show('Downloading Playlists', ToastAndroid.SHORT)
      : ToastAndroid.show(downloadStatus.msg, ToastAndroid.SHORT);
  };

  const deleteAllPlaylists = async () => {
    const musicsToDeletePaths = playlistsChanges
      .map(playlist =>
        playlist.removed.map(musicToDelete => musicToDelete.path),
      )
      .flat();

    await Promise.all(
      musicsToDeletePaths.map(async musicToDeletePath => {
        await deleteFile(musicToDeletePath);
      }),
    );

    updatePlaylistsChanges(
      playlistsChanges
        .map(playlistChange => ({
          ...playlistChange,
          removed: [],
        }))
        .filter(playlistChange => {
          if (
            playlistChange.added.length === 0 &&
            playlistChange.removed.length === 0
          ) {
            return false;
          } else {
            return true;
          }
        }),
    );

    ToastAndroid.show('Musics Deleted', ToastAndroid.SHORT);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              disabled={addedMusicsNumber === 0}
              onPress={downloadAllPlaylists}>
              <Entypo
                name={'download'}
                style={
                  addedMusicsNumber !== 0
                    ? styles.buttonIconEnabled
                    : styles.buttonIconDisabled
                }
                size={20}
              />

              <View style={styles.textContainer}>
                <Text
                  style={
                    addedMusicsNumber !== 0
                      ? styles.textEnabled
                      : styles.textDisabled
                  }>
                  Download
                </Text>

                <Text
                  style={
                    addedMusicsNumber !== 0
                      ? styles.textEnabled
                      : styles.textDisabled
                  }>
                  {addedMusicsNumber} Music{addedMusicsNumber === 1 ? '' : 's'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              disabled={removedMusicsNumber === 0}
              onPress={deleteAllPlaylists}>
              <Entypo
                name={'trash'}
                style={
                  removedMusicsNumber !== 0
                    ? styles.buttonIconEnabled
                    : styles.buttonIconDisabled
                }
                size={20}
              />

              <View style={styles.textContainer}>
                <Text
                  style={
                    removedMusicsNumber !== 0
                      ? styles.textEnabled
                      : styles.textDisabled
                  }>
                  Delete
                </Text>

                <Text
                  style={
                    removedMusicsNumber !== 0
                      ? styles.textEnabled
                      : styles.textDisabled
                  }>
                  {removedMusicsNumber} Music
                  {removedMusicsNumber === 1 ? '' : 's'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '4%',
    marginBottom: '2%',

    width: '100%',
  },

  contentContainer: {
    flexDirection: 'row',

    width: '100%',
    height: 75,
  },

  buttonContainer: {
    flex: 1,
    height: '100%',

    backgroundColor: '#212121',

    borderColor: '#111',
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },

  button: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',

    height: '100%',
    width: '100%',
  },

  buttonIconEnabled: {
    color: '#fff',
  },

  buttonIconDisabled: {
    color: '#000',
  },

  textContainer: {},

  textEnabled: {
    color: '#fff',
    textAlign: 'center',
  },

  textDisabled: {
    color: '#000',
    textAlign: 'center',
  },
});

export default UpdatePlaylistsButtons;
