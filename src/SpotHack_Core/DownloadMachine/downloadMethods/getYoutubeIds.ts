import {DownloadMachine} from '../index';
import getYoutubeUrl from '../../GetYoutubeUrl';

export default async function getYoutubeIds(this: DownloadMachine) {
  if (this.isGetYoutubeIdsActive === true) {
    return 0;
  }
  this.isGetYoutubeIdsActive = true;

  if (this.youtubeIdsQueue.length > 0) {
    this.startFgService();
  }

  while (this.youtubeIdsQueue.length > 0) {
    const queue = this.queue;
    const queueIndex = this.youtubeIdsQueue[0];

    if (this.queue[queueIndex].youtubeId === '') {
      const {youtubeId, infoSourceIcon, success} = await getYoutubeUrl(
        this.queue[queueIndex].spotifyId,
        '',
        '',
        this.queue[queueIndex].youtubeQuery,
        this.queue[queueIndex].approxDurationMs / 1000,
      );

      if (success !== 0) {
        // downloadsStatistics
        this.downloadsStatistics.musicsWithYoutubeId += 1;
        if (!this.downloadsStatistics.youtubeIdsSources[infoSourceIcon]) {
          this.downloadsStatistics.youtubeIdsSources[infoSourceIcon] = 1;
        } else {
          this.downloadsStatistics.youtubeIdsSources[infoSourceIcon] += 1;
        }
        // =

        queue[queueIndex] = {
          ...queue[queueIndex],
          youtubeId:
            youtubeId[
              queue[queueIndex].downloadSource || this.defaultDownloadSource
            ], // downloadSource can be "" if come from Download Manager
          progress: 2,
          stage: 'gotten_youtubeId',
        };

        this.downloadUrlsQueue.push(queueIndex);
        if (this.isGetDownloadUrlsActive === false) {
          this.getDownloadUrls();
        }
      } else {
        // downloadsStatistics
        this.downloadsStatistics.errors.push(queue[queueIndex].youtubeQuery);
        // =

        queue[queueIndex] = {
          ...queue[queueIndex],
          progress: 0,
          stage: 'gotten_youtubeId - error',
        };
      }
    } else {
      // downloadsStatistics
      this.downloadsStatistics.musicsWithYoutubeId += 1;
      if (!this.downloadsStatistics.youtubeIdsSources.asyncStorage) {
        this.downloadsStatistics.youtubeIdsSources.asyncStorage = 1;
      } else {
        this.downloadsStatistics.youtubeIdsSources.asyncStorage += 1;
      }
      // =

      queue[queueIndex] = {
        ...queue[queueIndex],
        progress: 2,
        stage: 'gotten_youtubeId',
      };

      this.downloadUrlsQueue.push(queueIndex);
      if (this.isGetDownloadUrlsActive === false) {
        this.getDownloadUrls();
      }
    }

    this.youtubeIdsQueue.shift();
  }

  this.isGetYoutubeIdsActive = false;
  this.stopFgService();

  return 1;
}
