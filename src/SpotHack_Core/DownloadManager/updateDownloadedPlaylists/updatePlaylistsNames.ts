import * as RNFS from 'react-native-fs';

import {downloadedPlaylistsInfoSchema, downloadsInfoSchema} from '../index';

import removeSpecialChars from '../../../utils/removeSpecialChars';

export default async (
  downloadsInfo: downloadsInfoSchema,
  apiUpdatedPlaylists: downloadedPlaylistsInfoSchema,
) => {
  await Promise.all(
    Object.keys(downloadsInfo).map(async path => {
      const playlistsOnPath = downloadsInfo[path];

      const playlistsIds = Object.keys(playlistsOnPath);

      const playlistsWithDifferentName = playlistsIds
        .filter(playlistId => {
          if (!playlistsOnPath[playlistId] || !apiUpdatedPlaylists[playlistId])
            return false;
          return (
            playlistsOnPath[playlistId].playlistName !==
            apiUpdatedPlaylists[playlistId].playlistName;
          );
        })
        .map(playlistId => ({
          currentPath:
            path + removeSpecialChars(playlistsOnPath[playlistId].playlistName),
          newPath:
            path +
            removeSpecialChars(apiUpdatedPlaylists[playlistId].playlistName),
        }));

      await Promise.all(
        playlistsWithDifferentName.map(async playlist =>
          renameFolder(playlist.currentPath, playlist.newPath),
        ),
      );
    }),
  );
};

export const renameFolder = async (currentPath: string, newPath: string) => {
  if (!(await RNFS.exists(currentPath)) || currentPath === newPath) return;

  await RNFS.mkdir(newPath);

  await Promise.all(
    (
      await RNFS.readDir(currentPath)
    )
      .filter(possibleFile => possibleFile.isFile())
      .map(musicFile => ({
        currentPath: currentPath + '/' + musicFile.name,
        newPath: newPath + '/' + musicFile.name,
      }))
      .map(async musicToMove => {
        await RNFS.moveFile(musicToMove.currentPath, musicToMove.newPath);
      }),
  );

  await RNFS.unlink(currentPath);
};
