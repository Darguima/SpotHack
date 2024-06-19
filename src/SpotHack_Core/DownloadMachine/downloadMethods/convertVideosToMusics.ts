import {
  FFmpegKit,
  ReturnCode,
  FFmpegKitConfig,
  FFmpegSession,
} from 'ffmpeg-kit-react-native';

import {DownloadMachine} from '../index';

import {createAssetsOnPath, deleteAssetsOnPath} from '../utils';
import removeSpecialChars from '../../../utils/removeSpecialChars';

export default async function convertVideosToMusics(this: DownloadMachine) {
  if (this.isConvertVideosToMusicsActive === true) {
    return 0;
  }
  this.isConvertVideosToMusicsActive = true;

  while (this.convertVideosToMusicsQueue.length > 0) {
    const queue = this.queue;
    const queueIndex = this.convertVideosToMusicsQueue[0];
    const temporaryPathWithFile =
      this.temporaryPath +
      queue[queueIndex].playlistId +
      removeSpecialChars(queue[queueIndex].youtubeQuery) +
      '.mp4';
    const finalPathWithFile =
      this.finalPath +
      removeSpecialChars(queue[queueIndex].playlistName) +
      '/' +
      removeSpecialChars(queue[queueIndex].youtubeQuery) +
      '.mp3';
    const {
      thumbnail,
      musicName,
      artists,
      albumName,
      spotifyId,
      approxDurationMs,
    } = queue[queueIndex];

    let session: FFmpegSession | undefined;

    try {
      await createAssetsOnPath(finalPathWithFile);

      FFmpegKitConfig.enableStatisticsCallback(async ffmpegStatus => {
        queue[queueIndex] = {
          ...queue[queueIndex],
          stageProgress:
            (ffmpegStatus.getTime() / Number(approxDurationMs)) * 100,
        };
      });

      // FFmpegKit.disableLogs(); This was used on the deprecated FFmpeg package

      session = await FFmpegKit.execute(
        `-i "${temporaryPathWithFile}" ${
          thumbnail
            ? '-i "' +
              thumbnail.replace('https', 'http') +
              '" -c:v copy -map 0:a:0 -map 1:v:0 '
            : ''
        } -acodec libmp3lame -metadata title="${removeSpecialChars(musicName, [
          '"',
        ])}" -metadata artist="${removeSpecialChars(artists, [
          '"',
        ])}" -metadata album="${removeSpecialChars(albumName, [
          '"',
        ])}" -metadata spotifyId="${spotifyId}" -metadata thumbnail="${thumbnail}" "${finalPathWithFile}" -y`,
      );

      const returnCode = await session.getReturnCode();

      if (!ReturnCode.isSuccess(returnCode)) {
        throw new Error('ffmpeg response != 0');
      }

      // downloadsStatistics
      this.downloadsStatistics.convertedVideos += 1;
      // =

      queue[queueIndex] = {
        ...queue[queueIndex],

        stageProgress: 100,

        progress: 5,
        stage: 'convertedVideoToMusic',
      };

      this.finishDownload(queueIndex);
    } catch (err) {
      // downloadsStatistics
      this.downloadsStatistics.errors.push(queue[queueIndex].youtubeQuery);
      // =

      queue[queueIndex] = {
        ...queue[queueIndex],

        progress: 0,
        stage: `convertedVideoToMusic - ${err} - ${
          (await session?.getOutput()) || 'no output from ffmpeg'
        }`,
      };

      deleteAssetsOnPath(finalPathWithFile);
    }

    try {
      deleteAssetsOnPath(temporaryPathWithFile);
    } catch (err) {}

    this.convertVideosToMusicsQueue.shift();
  }

  this.isConvertVideosToMusicsActive = false;
  this.stopFgService();

  return 1;
}
