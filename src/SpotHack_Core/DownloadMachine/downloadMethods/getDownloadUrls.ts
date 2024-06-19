import {DownloadMachine} from '../index';
import ytdl from 'react-native-ytdl';

export default async function getDownloadUrls(this: DownloadMachine) {
  if (this.isGetDownloadUrlsActive === true) {
    return 0;
  }
  this.isGetDownloadUrlsActive = true;

  while (this.downloadUrlsQueue.length > 0) {
    const queue = this.queue;
    const queueIndex = this.downloadUrlsQueue[0];

    try {
      const videoFormats = await ytdl.getInfo(queue[queueIndex].youtubeId);
      const {approxDurationMs, url} = ytdl.chooseFormat(videoFormats.formats, {
        quality: 'highestaudio',
      });

      // downloadsStatistics
      this.downloadsStatistics.musicsWithDownloadUrl += 1;
      // =

      queue[queueIndex] = {
        ...queue[queueIndex],

        approxDurationMs: Number(approxDurationMs),
        downloadUrl: url,

        progress: 3,
        stage: 'gotten_downloadUrl',
      };

      this.downloadMusicsVideosQueue.push(queueIndex);
      if (this.isDownloadMusicsVideosActive === false) {
        this.downloadMusicsVideos();
      }
    } catch (err) {
      // downloadsStatistics
      this.downloadsStatistics.errors.push(queue[queueIndex].youtubeQuery);
      // =

      queue[queueIndex] = {
        ...queue[queueIndex],

        progress: 0,
        stage: `gotten_downloadUrl - ${err}`,
      };
    }

    this.downloadUrlsQueue.shift();
  }

  this.isGetDownloadUrlsActive = false;
  this.stopFgService();

  return 1;
}
