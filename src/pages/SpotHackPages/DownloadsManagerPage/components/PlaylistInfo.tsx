import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {playlistInfoSchema} from '../pages/ReferencePlaylistPage';

import removeSpecialChars from '../../../../utils/removeSpecialChars';

import downloadManager from '../../../../SpotHack_Core/DownloadManager';
import {renameFolder} from '../../../../SpotHack_Core/DownloadManager/updateDownloadedPlaylists/updatePlaylistsNames';

interface PlaylistInfoProps {
  playlistId: string;
  playlistInfo: playlistInfoSchema;

  path: string;
  pathName: string;

  setReferenceStatus: React.Dispatch<
    React.SetStateAction<
      'editing id' | 'not founded' | 'founded' | 'referenced'
    >
  >;
}

const PlaylistInfo: React.FC<PlaylistInfoProps> = ({
  playlistId,
  playlistInfo,
  path,
  pathName,
  setReferenceStatus,
}) => {
  const referencePlaylistButtonPress = async () => {
    const newPath =
      path.substring(0, path.lastIndexOf('/')) +
      '/' +
      removeSpecialChars(playlistInfo?.title!);
    renameFolder(path, newPath);

    setReferenceStatus('referenced');

    await downloadManager.addAlreadyDownloadedPlaylistId(playlistId);
    await downloadManager.startDownloadManager();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.playlistPreview}>
          <View style={styles.playlistCoverContainer}>
            <Image
              source={playlistInfo.coverImage}
              style={styles.playlistCover}
              width={0}
              height={0}
            />
          </View>

          <View style={styles.playlistNameOwnerContainer}>
            <Text style={styles.playlistPreviewTitle}>
              {playlistInfo.title}
            </Text>
            <Text style={styles.playlistPreviewOwner}>
              {playlistInfo.owner}
            </Text>
          </View>
        </View>

        <View style={styles.warmingContainer}>
          <Text style={styles.warmingText}>
            <Text style={styles.warmingTitle}>{'Warming: '}</Text>
            All files in this folder that are not musics in this playlist can be
            deleted
          </Text>

          {removeSpecialChars(playlistInfo.title) !== pathName && (
            <Text style={styles.warmingText}>
              <Text style={styles.warmingTitle}>{'Warming: '}</Text>
              Folder will be renamed
            </Text>
          )}
        </View>

        <View style={styles.referencePlaylistButtonContainer}>
          <TouchableOpacity
            onPress={referencePlaylistButtonPress}
            style={styles.buttons}
            activeOpacity={0.5}>
            <Text style={styles.buttonsText}>Reference Playlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '5%',

    borderTopColor: '#aaa',
    borderWidth: 1,
  },

  playlistPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  playlistCoverContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    width: '50%',
    aspectRatio: 1,
  },

  playlistCover: {
    width: '90%',
    height: '90%',
  },

  playlistNameOwnerContainer: {
    width: '50%',
  },

  playlistPreviewTitle: {
    paddingBottom: '4%',

    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
  },

  playlistPreviewOwner: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 20,
  },

  referencePlaylistButtonContainer: {
    marginVertical: '5%',

    height: 48,
    paddingHorizontal: '10%',
  },

  buttons: {
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: '100%',
    borderRadius: 25,

    backgroundColor: '#1c5ed6',
  },

  buttonsText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  warmingContainer: {},

  warmingText: {
    color: '#fff',
    fontSize: 16,
  },

  warmingTitle: {
    color: '#ff4f00',
    fontWeight: 'bold',
  },
});

export default PlaylistInfo;
