import youtubeIdsStorage from './youtubeIdsStorage';
import youtubeApi from '../../services/youtubeApi';
import {scrapeFromYoutubeVideo} from '../../services/youtubeScrape';

import createYoutubeQuery from '../../utils/createYoutubeQuery';

export interface youtubeIdsSchema {
  [key: string]: string;
  ytFirstVideoOnSearch: string;
  ytLyricsVideo: string;
}

export type infoSourceIcon = 'error' | 'asyncStorage' | 'ytScrape' | 'ytApi';

export interface getYoutubeUrlReturn {
  youtubeId: youtubeIdsSchema;
  youtubeQuery: string;
  success: number;
  infoSourceIcon: infoSourceIcon;
}

const main = async (
  spotifyId: string,
  title: string,
  artists: string,
  musicTimeLimit: number,
  spotHackServerURL?: string | undefined,
  youtubeQuery?: string,
  spotifyDurationSec?: number,
) => {
  if (!youtubeQuery) {
    youtubeQuery = createYoutubeQuery(artists, title);
  }

  const storedYoutubeIds = youtubeIdsStorage.getYoutubeId(spotifyId);

  if (storedYoutubeIds) {
    return {
      youtubeId: storedYoutubeIds,
      youtubeQuery: youtubeQuery,
      success: 1,
      infoSourceIcon: 'asyncStorage',
    } as getYoutubeUrlReturn;
  }

  try {
    /*
     * Search for the video on internet
     */

    let youtubeInfo: getYoutubeUrlReturn = {
      youtubeId: {
        ytFirstVideoOnSearch: '',
        ytLyricsVideo: '',
      },
      youtubeQuery: '',
      success: 0,
      infoSourceIcon: 'error',
    };

    let minDuration: number | undefined;
    let maxDuration: number | undefined;
    if (spotifyDurationSec) {
      minDuration = spotifyDurationSec * (1 - musicTimeLimit);
      maxDuration = spotifyDurationSec * (1 + musicTimeLimit);
    }

    /*
     * Search the youtubeQuery on Youtube with a scraper
     */

    try {
      if (!spotHackServerURL) {
        throw new Error('just to continue');
      }

      const ytResponse1stVideoOnSearch = await scrapeFromYoutubeVideo(
        youtubeQuery,
        spotHackServerURL,
        undefined,
        minDuration,
        maxDuration,
      );
      const ytResponseLyricsVideo = await scrapeFromYoutubeVideo(
        youtubeQuery + ' lyrics',
        spotHackServerURL,
        ytResponse1stVideoOnSearch.id || '',
        minDuration,
        maxDuration,
      );

      if (
        ytResponse1stVideoOnSearch.success === 1 &&
        ytResponseLyricsVideo.success === 1
      ) {
        youtubeInfo = {
          youtubeId: {
            ytFirstVideoOnSearch: ytResponse1stVideoOnSearch.id,
            ytLyricsVideo: ytResponseLyricsVideo.id,
          },
          youtubeQuery: youtubeQuery,
          success: 1,
          infoSourceIcon: 'ytScrape',
        };
      }
    } catch (err) {}

    /*
     * Search the youtubeQuery on Youtube Api
     */

    if (!youtubeInfo.success) {
      const ytApiResponse1stVideoOnSearch = await youtubeApi.searchYoutubeVideo(
        youtubeQuery,
      );
      const ytApiResponseLyricsVideo = await youtubeApi.searchYoutubeVideo(
        youtubeQuery + ' lyrics',
        ytApiResponse1stVideoOnSearch.id || '',
      );

      if (
        ytApiResponse1stVideoOnSearch.success === 1 &&
        ytApiResponseLyricsVideo.success === 1
      ) {
        youtubeInfo = {
          youtubeId: {
            ytFirstVideoOnSearch: ytApiResponse1stVideoOnSearch.id,
            ytLyricsVideo: ytApiResponseLyricsVideo.id,
          },
          youtubeQuery: youtubeQuery,
          success: 1,
          infoSourceIcon: 'ytApi',
        };
      }
    }

    /*
     * Save the youtubeId on Async Storage
     */
    if (youtubeInfo.success === 1) {
      youtubeIdsStorage.storeYoutubeId(spotifyId, youtubeInfo.youtubeId);
    }

    /*
     * Return (error or success)
     */

    return youtubeInfo as getYoutubeUrlReturn;
  } catch (err) {
    const musicError: getYoutubeUrlReturn = {
      youtubeId: {
        ytFirstVideoOnSearch: '',
        ytLyricsVideo: '',
      },
      youtubeQuery: '',
      success: 0,
      infoSourceIcon: 'error',
    };

    return musicError;
  }
};

export default main;
