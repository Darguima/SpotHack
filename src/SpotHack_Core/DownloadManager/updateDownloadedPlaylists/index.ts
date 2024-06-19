import {DownloadManager} from '../index';

import {ToastAndroid} from 'react-native';

import updatePlaylistsNames from './updatePlaylistsNames';
import verifyFileTree from './verifyFileTree';
import verifyPlaylistsChanges from './verifyPlaylistsChanges';

export default async function (this: DownloadManager) {
  const downloadsInfo = this.downloadsInfo;

  this.apiUpdatedPlaylists[0] = {
    playlistName: 'SpotHack_Music',
    coverImage: require('../../../assets/icons/defaultIcon.png'),
    tracks: [],
  };
  Object.keys(downloadsInfo).forEach(path => {
    const playlistsOnPath = downloadsInfo[path];
    if (playlistsOnPath[0]) {
      playlistsOnPath[0].tracks.forEach(trackOnPath => {
        if (
          !this.apiUpdatedPlaylists[0].tracks.some(
            apiTrack => apiTrack.spotifyId === trackOnPath.spotifyId,
          )
        ) {
          this.apiUpdatedPlaylists[0].tracks.push(trackOnPath);
        }
      });
    }
  });

  await updatePlaylistsNames(downloadsInfo, this.apiUpdatedPlaylists);

  this.downloadsInfo = await verifyFileTree(
    this.downloadsInfo,
    this.apiUpdatedPlaylists,
  );

  this.playlistsChanges = await verifyPlaylistsChanges(
    this.downloadsInfo,
    this.apiUpdatedPlaylists,
  );

  this.arePlaylistsUpdated = true;
  ToastAndroid.show('Checked Downloaded Playlists', ToastAndroid.SHORT);
}
