import axios from 'axios';
import {DownloadMachine} from '../index';

interface getDownloadUrlsResponse {
  approxDurationMs: number;
  url: string;
}

export default async function getDownloadUrls(this: DownloadMachine) {
  if (this.isGetDownloadUrlsActive === true) {
    return 0;
  }
  this.isGetDownloadUrlsActive = true;

  while (this.downloadUrlsQueue.length > 0) {
    const queue = this.queue;
    const queueIndex = this.downloadUrlsQueue[0];

    try {
      if (this.spotHackServerURL === undefined) {
        throw 'spotHackServerURL is not defined - go to settings';
      }

      const {data} = await axios.get(
        `${this.spotHackServerURL}/getDownloadUrls`,
        {
          params: {
            videoId: queue[queueIndex].youtubeId,
          },
        },
      );

      const {approxDurationMs, url}: getDownloadUrlsResponse = data;

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
