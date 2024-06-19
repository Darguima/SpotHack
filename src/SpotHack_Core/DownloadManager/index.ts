import AsyncStorage from '@react-native-community/async-storage';

import updateDownloadedPlaylists from './updateDownloadedPlaylists';

import spotifyApi from '../../services/spotify/spotifyApi';

import convertArtistsArrayToString from '../../utils/convertArtistsArrayToString';
import createYoutubeQuery from '../../utils/createYoutubeQuery';
import {getExternalStoragePermissions} from '../../utils/getStoragePermissions';
import {ImageSourcePropType} from 'react-native';

type onPlaylistUpdateEventFunction = (
  playlistsChangesOnRootPaths: playlistsChangesSchema,
  playlistsChanges: playlistsChangesOnPathSchema,
  downloadsInfo: downloadsInfoSchema,
  arePlaylistsUpdated: boolean,
) => void;

export interface downloadedMusicInfoSchema {
  title: string;

  artists: string;
  spotifyId: string;

  youtubeQuery: string;

  playlistName: string;
  albumName: string;
  thumbnail: string;
}

export interface downloadedPlaylistInfoSchema {
  playlistName: string;
  coverImage: {uri: string};
  tracks: downloadedMusicInfoSchema[];
}

export interface downloadedPlaylistsInfoSchema {
  // PlaylistId
  [key: string]: downloadedPlaylistInfoSchema;
}

export interface downloadsInfoSchema {
  // rooPath
  [key: string]: downloadedPlaylistsInfoSchema;
}

export interface addedMusicToPlaylistInfoSchema {
  spotifyId: string;
  youtubeId: string;

  musicName: string;
  artists: string;
  albumName: string;
  thumbnail: string;

  playlistName: string;
  youtubeQuery: string;

  downloadSource: string;
}

export interface removedMusicToPlaylistInfoSchema {
  spotifyId: string;

  musicName: string;
  artists: string;
  thumbnail: ImageSourcePropType;

  playlistName: string;

  path: string;
}

export interface playlistChangesSchema {
  playlistName: string;
  playlistId: string;
  coverImage: {uri: string};
  added: Array<addedMusicToPlaylistInfoSchema>;
  removed: Array<removedMusicToPlaylistInfoSchema>;
}

export interface playlistsChangesOnPathSchema {
  [playlistId: string]: playlistChangesSchema;
}

export interface playlistsChangesSchema {
  [rootPath: string]: playlistsChangesOnPathSchema;
}

export class DownloadManager {
  /*
		* "startDownloadManager" function should be used on app start and only if the user is already logged in
		* At this moment is being called on:
			this file on `set rootPath`
			`/src/routes/index.tsx`
			`/src/SpotHack_Core/DownloadMachine/machineMethods/addMusicsToDownloadQueue.ts`

		* For restart the manager:
			`/src/pages/SpotHackPages/DownloadsManagerPage/pages/ReferencePlaylistPage.tsx`
	*/

  private isDownloadManagerAlreadyStarting = false;
  public async startDownloadManager() {
    if (this.isDownloadManagerAlreadyStarting) {
      return;
    }
    this.isDownloadManagerAlreadyStarting = true;
    this.arePlaylistsUpdated = false;

    if (!(await getExternalStoragePermissions())) {
      return;
    }

    await this.getStoredAlreadyDownloadedPlaylistsIds();
    await this.getStoredDownloadsInfo();
    await this.updateDownloadedPlaylists();
    this.isDownloadManagerAlreadyStarting = false;
  }

  private rootPathValue = '';
  get rootPath() {
    return this.rootPathValue;
  }
  set rootPath(newRootPath) {
    this.rootPathValue = newRootPath;
    if (!this.downloadsInfo[newRootPath]) {
      this.startDownloadManager();
    } else {
      this.triggerOnPlaylistUpdateEventFunctions(this.arePlaylistsUpdated);
    }
  }

  private arePlaylistsUpdatedValue = false;
  get arePlaylistsUpdated() {
    return this.arePlaylistsUpdatedValue;
  }
  set arePlaylistsUpdated(newArePlaylistsUpdated: boolean) {
    const prevArePlaylistsUpdated = this.arePlaylistsUpdatedValue;
    this.arePlaylistsUpdatedValue = newArePlaylistsUpdated;
    if (prevArePlaylistsUpdated !== newArePlaylistsUpdated) {
      this.triggerOnPlaylistUpdateEventFunctions(newArePlaylistsUpdated);
    }
  }

  private onPlaylistUpdateEventFunctionsArray: Array<onPlaylistUpdateEventFunction> =
    [];

  public addOnPlaylistUpdateEventFunction(
    eventFunction: onPlaylistUpdateEventFunction,
  ) {
    this.onPlaylistUpdateEventFunctionsArray.push(eventFunction);
  }

  private triggerOnPlaylistUpdateEventFunctions(
    newArePlaylistsUpdated: boolean,
  ) {
    this.onPlaylistUpdateEventFunctionsArray.forEach(eventFunction =>
      eventFunction(
        JSON.parse(JSON.stringify(this.playlistsChanges)),
        JSON.parse(JSON.stringify(this.playlistsChanges[this.rootPath] || {})),
        JSON.parse(JSON.stringify(this.downloadsInfo)),
        newArePlaylistsUpdated,
      ),
    );
  }

  private downloadsInfoObject: downloadsInfoSchema = {};
  public get downloadsInfo() {
    return JSON.parse(
      JSON.stringify(this.downloadsInfoObject),
    ) as downloadsInfoSchema;
  }
  protected set downloadsInfo(newDownloadsInfo) {
    this.downloadsInfoObject = newDownloadsInfo;

    const downloadsInfoWithoutTracks: downloadsInfoSchema = {};

    // Don't is needed store the tracks info
    for (const rootPath in newDownloadsInfo) {
      downloadsInfoWithoutTracks[rootPath] = {};
      for (const playlistId in newDownloadsInfo[rootPath]) {
        downloadsInfoWithoutTracks[rootPath][playlistId] = {
          playlistName: newDownloadsInfo[rootPath][playlistId].playlistName,
          coverImage: newDownloadsInfo[rootPath][playlistId].coverImage,
          tracks:
            playlistId !== '0'
              ? []
              : newDownloadsInfo[rootPath][playlistId].tracks,
        };
      }
    }

    AsyncStorage.setItem(
      '@SpotHackDlManager:downloadsInfo',
      JSON.stringify(downloadsInfoWithoutTracks),
    );
  }

  protected async getStoredDownloadsInfo() {
    let newDownloadedPlaylistsInfo: downloadsInfoSchema = {[this.rootPath]: {}};
    const storedDownloadedPlaylistsInfo = await AsyncStorage.getItem(
      '@SpotHackDlManager:downloadsInfo',
    );

    if (storedDownloadedPlaylistsInfo) {
      newDownloadedPlaylistsInfo = {
        ...newDownloadedPlaylistsInfo, // [this.rootPath]: {}
        ...JSON.parse(storedDownloadedPlaylistsInfo),
      };
    }

    await Promise.all(
      Object.keys(newDownloadedPlaylistsInfo)
        .map(rootPath => {
          return Object.keys(newDownloadedPlaylistsInfo[rootPath]);
        })
        .reduce((prevArrayStrings, currentArrayStrings) => {
          return [...prevArrayStrings, ...currentArrayStrings];
        })
        .map(async playlistId => {
          await this.addAlreadyDownloadedPlaylistId(playlistId);
        }),
    );

    this.downloadsInfo = newDownloadedPlaylistsInfo;
  }

  public getPlaylistsOnPathInfo(
    rootPath: string = this.rootPath,
  ): downloadedPlaylistsInfoSchema {
    return JSON.parse(JSON.stringify(this.downloadsInfo[rootPath]));
  }

  protected setPlaylistsOnPathInfo(
    newPlaylistsInfo: downloadedPlaylistsInfoSchema,
    rootPath: string = this.rootPath,
  ) {
    this.downloadsInfo = {
      ...this.downloadsInfo,
      [rootPath]: newPlaylistsInfo,
    };
  }

  public async addDownloadedMusicInfo(
    playlistId: string,
    playlistName: string,
    musicInfo: downloadedMusicInfoSchema,
  ) {
    const currentDownloadedPlaylistsInfo = this.getPlaylistsOnPathInfo();
    await this.addAlreadyDownloadedPlaylistId(playlistId);

    if (!currentDownloadedPlaylistsInfo[playlistId]) {
      currentDownloadedPlaylistsInfo[playlistId] = {
        playlistName: playlistName,
        coverImage: this.apiUpdatedPlaylists[playlistId].coverImage,
        tracks: [],
      };
    }

    this.setPlaylistsOnPathInfo({
      ...currentDownloadedPlaylistsInfo,
      [playlistId]: {
        playlistName,
        coverImage: this.apiUpdatedPlaylists[playlistId].coverImage,
        tracks: [
          ...currentDownloadedPlaylistsInfo[playlistId].tracks,
          musicInfo,
        ],
      },
    });

    if (this.playlistsChanges[this.rootPath][playlistId]) {
      const indexFromPlaylistsChanges = this.playlistsChanges[this.rootPath][
        playlistId
      ].added.findIndex(
        musicToDownload => musicToDownload.spotifyId === musicInfo.spotifyId,
      );

      if (indexFromPlaylistsChanges !== -1) {
        this.playlistsChanges[this.rootPath][playlistId].added.splice(
          indexFromPlaylistsChanges,
          1,
        );

        if (
          this.playlistsChanges[this.rootPath][playlistId].added.length === 0 &&
          this.playlistsChanges[this.rootPath][playlistId].removed.length === 0
        ) {
          delete this.playlistsChanges[this.rootPath][playlistId];
        }

        this.arePlaylistsUpdated = true;
      }
    }
  }

  protected apiUpdatedPlaylists: downloadedPlaylistsInfoSchema = {};
  protected async getApiUpdatedPlaylist(
    playlistId: string,
  ): Promise<downloadedPlaylistInfoSchema | undefined> {
    if (!this.apiUpdatedPlaylists[playlistId]) {
      const apiPlaylist: SpotifyApi.PlaylistObjectFull = (
        await spotifyApi.get(`playlists/${playlistId}`)
      ).data;

      if (!apiPlaylist) {
        return;
      }

      const tracks = apiPlaylist.tracks.items;

      while (true) {
        const newTracks: SpotifyApi.PlaylistTrackResponse = (
          await spotifyApi.get(
            `playlists/${playlistId}/tracks?offset=${tracks.length}`,
          )
        ).data;

        tracks.push(...newTracks.items);

        if (tracks.length >= newTracks.total) {
          break;
        }
      }

      this.apiUpdatedPlaylists[playlistId] = {
        playlistName: apiPlaylist.name,

        coverImage:
          apiPlaylist.images.length > 0
            ? {uri: (apiPlaylist.images[1] || apiPlaylist.images[0]).url}
            : require('../../assets/graySquare.jpg'),

        tracks: tracks
          .filter(({track}) => !!track)
          .map(({track}) => {
            return {
              spotifyId: track.id,

              title: track.name,
              artists: convertArtistsArrayToString(track.artists),

              youtubeQuery: createYoutubeQuery(
                convertArtistsArrayToString(track.artists),
                track.name,
              ),

              playlistName: apiPlaylist.name,
              albumName: track.album.name,
              thumbnail:
                track.album.images.length > 0
                  ? track.album.images[0].url
                  : '../../assets/graySquare.jpg',
            };
          }),
      };
    }

    return JSON.parse(JSON.stringify(this.apiUpdatedPlaylists[playlistId]));
  }

  protected alreadyDownloadedPlaylistsIds: string[] = [];
  protected async getStoredAlreadyDownloadedPlaylistsIds() {
    const storedAlreadyDownloadedPlaylistsIds = await AsyncStorage.getItem(
      '@SpotHackDlManager:alreadyDownloadedPlaylistsIds',
    );

    // Playlists Ids saved on AsyncStorage
    if (storedAlreadyDownloadedPlaylistsIds) {
      const updatedAlreadyDownloadedPlaylistsIds: string[] = JSON.parse(
        storedAlreadyDownloadedPlaylistsIds,
      );

      const apiSuccessPlaylistsRequests = (
        await Promise.all(
          updatedAlreadyDownloadedPlaylistsIds.map(
            async (playlistId: string) => {
              if (await this.getApiUpdatedPlaylist(playlistId)) {
                return playlistId;
              }
            },
          ),
        )
      ).filter(
        possibleUndefined => possibleUndefined !== undefined,
      ) as string[];

      this.alreadyDownloadedPlaylistsIds = apiSuccessPlaylistsRequests;
    }

    // Playlists Ids from followed/created playlists on Spotify
    let userPlaylistsUrl = 'me/playlists';
    while (1) {
      const userPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse = (
        await spotifyApi.get(userPlaylistsUrl, {
          params: {
            limit: 50,
          },
        })
      ).data;

      if (userPlaylists) {
        const playlistsIds = userPlaylists.items.map(playlist => playlist.id);

        await Promise.all(
          playlistsIds.map(async (playlistId: string) => {
            await this.getApiUpdatedPlaylist(playlistId);
          }),
        );

        this.alreadyDownloadedPlaylistsIds = [
          ...this.alreadyDownloadedPlaylistsIds,
          ...playlistsIds,
        ];

        if (!userPlaylists.next) {
          break;
        }
        userPlaylistsUrl = userPlaylists.next.replace(
          spotifyApi.defaults.baseURL || '',
          '',
        );
      } else {
        break;
      }
    }

    // Remove repeated Ids
    this.alreadyDownloadedPlaylistsIds = [
      ...new Set(this.alreadyDownloadedPlaylistsIds),
    ];
    await AsyncStorage.setItem(
      '@SpotHackDlManager:alreadyDownloadedPlaylistsIds',
      JSON.stringify(this.alreadyDownloadedPlaylistsIds),
    );
  }

  public async addAlreadyDownloadedPlaylistId(playlistId: string) {
    if (playlistId === '0') {
      return;
    }
    if (this.alreadyDownloadedPlaylistsIds.indexOf(playlistId) !== -1) {
      return;
    }

    if (await this.getApiUpdatedPlaylist(playlistId)) {
      this.alreadyDownloadedPlaylistsIds.push(playlistId);
      await AsyncStorage.setItem(
        '@SpotHackDlManager:alreadyDownloadedPlaylistsIds',
        JSON.stringify(this.alreadyDownloadedPlaylistsIds),
      );
    }
  }

  public playlistsChanges: playlistsChangesSchema = {};

  protected updateDownloadedPlaylists = updateDownloadedPlaylists;
}

const downloadManager = new DownloadManager();

export default downloadManager;
