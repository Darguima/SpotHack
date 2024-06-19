import * as RNFS from 'react-native-fs';
import removeSpecialChars from '../../../utils/removeSpecialChars';

import {
  downloadedPlaylistsInfoSchema,
  downloadsInfoSchema,
  playlistsChangesSchema,
  removedMusicToPlaylistInfoSchema,
} from '../index';
import {ImageSourcePropType} from 'react-native';

export default async (
  downloadsInfo: downloadsInfoSchema,
  apiUpdatedPlaylists: downloadedPlaylistsInfoSchema,
) => {
  const defaultThumbnail: ImageSourcePropType = require('../../../assets/icons/defaultIcon.png');

  const playlistsChanges: playlistsChangesSchema = {};

  for (const rootPath in downloadsInfo) {
    playlistsChanges[rootPath] = {};

    for (const playlistId in downloadsInfo[rootPath]) {
      if (playlistId === '0') {
        continue;
      }

      const downloadedPlaylist = downloadsInfo[rootPath][playlistId];

      playlistsChanges[rootPath][playlistId] = {
        playlistName: downloadedPlaylist.playlistName,
        playlistId,
        coverImage: apiUpdatedPlaylists[playlistId].coverImage,
        added: [],
        removed: [],
      };

      // Added Musics:

      for (const musicIndex in apiUpdatedPlaylists[playlistId].tracks) {
        const musicInfo = apiUpdatedPlaylists[playlistId].tracks[musicIndex];

        if (
          !downloadedPlaylist.tracks.some(
            ({spotifyId}) => spotifyId === musicInfo.spotifyId,
          )
        ) {
          playlistsChanges[rootPath][playlistId].added.push({
            spotifyId: musicInfo.spotifyId,
            youtubeId: '',

            musicName: musicInfo.title,
            artists: musicInfo.artists,
            albumName: musicInfo.albumName,
            thumbnail: musicInfo.thumbnail,

            playlistName: musicInfo.playlistName,
            youtubeQuery: musicInfo.youtubeQuery,

            downloadSource: '',
          });
        }
      }

      // Removed Musics:

      const filesToRemove = (
        await RNFS.readDir(
          rootPath + removeSpecialChars(downloadedPlaylist.playlistName),
        )
      )
        .map(filesInfo => filesInfo.name)
        .filter(fileName => {
          if (
            apiUpdatedPlaylists[playlistId].tracks.some(
              apiMusic =>
                removeSpecialChars(apiMusic.youtubeQuery) + '.mp3' === fileName,
            )
          ) {
            return false;
          } else {
            return true;
          }
        })
        .map(fileName => ({
          path:
            rootPath +
            removeSpecialChars(downloadedPlaylist.playlistName) +
            '/' +
            fileName,
          playlistName: downloadedPlaylist.playlistName,
          musicName: fileName.replace('.mp3', ''),
        }));

      // FFmpegKit.disableLogs(); This was used on the deprecated FFmpeg package

      const filesInfoToRemove: Array<removedMusicToPlaylistInfoSchema> = [];

      for (const filePathIndex in filesToRemove) {
        const file = filesToRemove[filePathIndex];

        const fileNameSplitted = file.musicName.split(' - ');
        let musicName: string, artists: string;

        if (fileNameSplitted.length === 1) {
          musicName = fileNameSplitted[0];
          artists = 'Somebody';
        } else {
          artists = fileNameSplitted.pop() || 'Somebody';
          /* artists removed from fileNameSplitted array with .pop() */
          musicName = fileNameSplitted.join(' - ');
        }

        const metadata = (
          await RNFFprobe.getMediaInformation(file.path)
        ).getAllProperties() as unknown as {
          format?: {tags?: {[key: string]: string}};
        };

        if (metadata.format) {
          if (metadata.format.tags) {
            filesInfoToRemove.push({
              spotifyId: metadata.format.tags.spotifyId || '',

              musicName: metadata.format.tags.title || musicName,
              artists: metadata.format.tags.artist || artists,
              thumbnail: metadata.format.tags.thumbnail
                ? {uri: metadata.format.tags.thumbnail}
                : defaultThumbnail,

              playlistName: file.playlistName,

              path: file.path,
            });
            continue;
          }
        }

        filesInfoToRemove.push({
          spotifyId: '',

          musicName: musicName,
          artists: artists,
          thumbnail: defaultThumbnail,

          playlistName: file.playlistName,

          path: file.path,
        });
      }

      playlistsChanges[rootPath][playlistId].removed = filesInfoToRemove;

      if (
        playlistsChanges[rootPath][playlistId].added.length === 0 &&
        playlistsChanges[rootPath][playlistId].removed.length === 0
      ) {
        delete playlistsChanges[rootPath][playlistId];
      }
    }
  }

  return playlistsChanges;
};
