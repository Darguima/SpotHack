import {DownloadMachine, statisticsSchema} from '../index';

export default function getDownloadsStatus(this: DownloadMachine) {
  return {
    musicsStatus: [...this.queue],
    playlistsOnQueue: [...this.playlistsOnQueue],
    statistics: JSON.parse(
      JSON.stringify(this.downloadsStatistics),
    ) as statisticsSchema,
  };
}
