import axios from 'axios';
import convertTimerToSeconds from '../../utils/convertTimerToSeconds';

interface searchYoutubeVideoResponse {
  uploader: {
    url: string;
    username: string;
    verified: boolean;
  };
  video: {
    duration: string;
    id: string;
    snippet: string;
    thumbnail_src: string;
    title: string;
    upload_date: string;
    url: string;
    views: string;
  };
}

interface searchYoutubeVideoSchema extends searchYoutubeVideoResponse {
  success: number;
}

export const scrapeFromYoutubeVideo = async (
  q: string,
  ignoreId?: string,
  minDuration?: number,
  maxDuration?: number,
) => {
  const {data} = await axios.get(
    'https://youtube-scrape.herokuapp.com/api/search',
    {
      params: {
        q,
      },
    },
  );

  let {results}: {results: Array<searchYoutubeVideoResponse>} = data;

  if (minDuration && maxDuration) {
    results = results.filter(video => {
      if (!video?.video?.duration) {
        return false;
      }
      const duration = convertTimerToSeconds(video.video.duration);

      return minDuration <= duration && duration <= maxDuration;
    });
  }

  if (results.length !== 0) {
    const video = results[0].video.id !== ignoreId ? results[0] : results[1];

    return {
      ...video,
      success: 1,
    } as searchYoutubeVideoSchema;
  } else {
    return {
      success: 0,
    } as searchYoutubeVideoSchema;
  }
};

// https://github.com/HermanFassett/youtube-scrape
