import * as RNFS from 'react-native-fs';
import removeSpecialChars from '../../../utils/removeSpecialChars';

import {downloadedPlaylistsInfoSchema, downloadsInfoSchema} from '../index';

export default async (
  downloadsInfo: downloadsInfoSchema,
  apiUpdatedPlaylists: downloadedPlaylistsInfoSchema,
) => {
  const playlistsIdsNames = Object.keys(apiUpdatedPlaylists).map(
    playlistId => ({
      playlistId,
      playlistName: apiUpdatedPlaylists[playlistId].playlistName,
    }),
  );

  const playlistsPaths = Object.keys(downloadsInfo);

  const updatedDownloadsInfo: downloadsInfoSchema = {};

  for (const pathIndex in playlistsPaths) {
    const path = playlistsPaths[pathIndex];
    if (!(await RNFS.exists(path))) {
      continue;
    }
    const playlistsOnPath = (await RNFS.readDir(path))
      .filter(possibleDirectory => possibleDirectory.isDirectory())
      .map(possiblePlaylist => {
        return playlistsIdsNames.find(playlist => {
          return (
            removeSpecialChars(playlist.playlistName) === possiblePlaylist.name
          );
        });
      })
      .filter(possibleUndefined => possibleUndefined !== undefined) as {
      playlistId: string;
      playlistName: string;
    }[];
    // For some reason typescript don't consider this filter and say that the value is possible undefined

    const fileTree: downloadedPlaylistsInfoSchema[] = await Promise.all(
      playlistsOnPath.map(async playlist => {
        const filesNames = (
          await RNFS.readDir(path + removeSpecialChars(playlist.playlistName))
        )
          .filter(possibleFile => possibleFile.isFile())
          .map(filesInfo => filesInfo.name);

        const tracks = apiUpdatedPlaylists[playlist.playlistId].tracks.filter(
          trackOnApiPlaylist =>
            filesNames.includes(
              removeSpecialChars(trackOnApiPlaylist.youtubeQuery) + '.mp3',
            ),
        );

        return {
          [playlist.playlistId]: {
            playlistName: playlist.playlistName,
            coverImage: apiUpdatedPlaylists[playlist.playlistId].coverImage,
            tracks,
          },
        };
      }),
    );

    updatedDownloadsInfo[path] = Object.assign({}, ...fileTree);
  }

  return updatedDownloadsInfo;
};
