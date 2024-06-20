import axios from 'axios';

interface searchYoutubeVideoResponse {
  id: string;
  title: string;
  link: string;
  thumbnail: string;
  channel: {
    id: string;
    name: string;
    link: string;
    handle: string;
    verified: false;
    thumbnail: string;
  };
  description: string;
  views: number;
  uploaded: string;
  duration: number;
  durationString: string;
}

interface searchYoutubeVideoSchema {
  id: string;
  success: number;
}

export const scrapeFromYoutubeVideo = async (
  query: string,
  spotHackServerURL: string,
  ignoreId?: string,
  minDuration?: number,
  maxDuration?: number,
) => {
  const {data} = await axios.get(`${spotHackServerURL}/getYoutubeIds`, {
    params: {
      query,
    },
  });

  let results: Array<searchYoutubeVideoResponse> = data;

  if (minDuration && maxDuration) {
    results = results.filter(video => {
      if (!video?.duration) {
        return false;
      }

      return minDuration <= video.duration && video.duration <= maxDuration;
    });
  }

  if (results.length !== 0) {
    const video = results[0].id !== ignoreId ? results[0] : results[1];

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
