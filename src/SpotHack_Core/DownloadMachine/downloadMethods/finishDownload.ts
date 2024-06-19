import {DownloadMachine} from '../index';

import downloadManager from '../../DownloadManager';

export default function finishDownload(
  this: DownloadMachine,
  queueIndex: number,
) {
  const musicInfo = this.queue[queueIndex];

  downloadManager.addDownloadedMusicInfo(
    musicInfo.playlistId,
    musicInfo.playlistName,
    {
      spotifyId: musicInfo.spotifyId,

      title: musicInfo.musicName,
      artists: musicInfo.artists,

      albumName: musicInfo.albumName,
      playlistName: musicInfo.playlistName,
      thumbnail: musicInfo.thumbnail,

      youtubeQuery: musicInfo.youtubeQuery,
    },
  );

  // downloadsStatistics
  this.downloadsStatistics.downloadedMusics += 1;
  // =

  this.queue[queueIndex] = {
    ...musicInfo,

    progress: 6,
    stage: 'downloadedMusic',
  };
}
