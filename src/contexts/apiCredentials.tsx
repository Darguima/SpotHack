import React, {createContext, useContext, useEffect, useState} from 'react';

import {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, YOUTUBE_API_KEY} from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';

import youtubeApi from '../services/youtubeApi';

import {Buffer} from 'buffer';

interface credentialsStored {
  spotifyClientId: string;
  spotifyClientSecret: string;
  youtubeApiKey: string;
}

interface ApiCredentialsContextData {
  spotifyClientId: string;
  spotifyClientSecret: string;
  spotifyBase64Key: string;

  youtubeApiKey: string;

  credentialsStored: credentialsStored;

  storeSpotifyClientId: (newClientId: string) => Promise<void>;
  storeSpotifyClientSecret: (newClientSecret: string) => Promise<void>;
  storeYoutubeApiKey: (newApiKey: string) => Promise<void>;

  isSpotifyLoginPossible: () => boolean;
}

const ApiCredentialsContext = createContext({} as ApiCredentialsContextData);

export const ApiCredentialsProvider: React.FC = ({children}) => {
  const [spotifyClientId, setSpotifyClientId] = useState<string>('');
  const [spotifyClientSecret, setSpotifyClientSecret] = useState<string>('');
  const [spotifyBase64Key, setSpotifyBase64Key] = useState<string>('');

  const [youtubeApiKey, setYoutubeApiKey] = useState<string>('');

  const [credentialsStored, setCredentialsStored] = useState<credentialsStored>(
    {spotifyClientId: '', spotifyClientSecret: '', youtubeApiKey: ''},
  );

  useEffect(() => {
    (async () => {
      let newSpotifyClientId = SPOTIFY_CLIENT_ID || '';
      let newSpotifyClientSecret = SPOTIFY_CLIENT_SECRET || '';
      let newYoutubeApiKey = YOUTUBE_API_KEY || '';

      try {
        const encryptedCredentialsStored = await EncryptedStorage.getItem(
          'api_credentials',
        );

        if (encryptedCredentialsStored) {
          const credentials: credentialsStored = JSON.parse(
            encryptedCredentialsStored,
          );

          setCredentialsStored({
            spotifyClientId: credentials.spotifyClientId || '',
            spotifyClientSecret: credentials.spotifyClientSecret || '',
            youtubeApiKey: credentials.youtubeApiKey || '',
          });

          newSpotifyClientId =
            credentials.spotifyClientId || newSpotifyClientId;
          newSpotifyClientSecret =
            credentials.spotifyClientSecret || newSpotifyClientSecret;
          newYoutubeApiKey = credentials.youtubeApiKey || newYoutubeApiKey;
        }
      } catch {}

      setSpotifyClientId(newSpotifyClientId);
      setSpotifyClientSecret(newSpotifyClientSecret);
      setSpotifyBase64Key(
        Buffer.from(
          `${newSpotifyClientId}:${newSpotifyClientSecret}`,
          'utf-8',
        ).toString('base64'),
      );
      setYoutubeApiKey(newYoutubeApiKey);
    })();
  }, []);

  const storeSpotifyClientId = async (newClientId: string) => {
    setSpotifyClientId(newClientId || SPOTIFY_CLIENT_ID || '');
    setSpotifyBase64Key(
      Buffer.from(
        `${newClientId || SPOTIFY_CLIENT_ID || ''}:${spotifyClientSecret}`,
        'utf-8',
      ).toString('base64'),
    );

    try {
      await EncryptedStorage.setItem(
        'api_credentials',
        JSON.stringify({...credentialsStored, spotifyClientId: newClientId}),
      );
      setCredentialsStored({
        ...credentialsStored,
        spotifyClientId: newClientId,
      });
    } catch {}
  };

  const storeSpotifyClientSecret = async (newClientSecret: string) => {
    setSpotifyClientSecret(newClientSecret || SPOTIFY_CLIENT_SECRET || '');
    setSpotifyBase64Key(
      Buffer.from(
        `${spotifyClientId}:${newClientSecret || SPOTIFY_CLIENT_SECRET || ''}`,
        'utf-8',
      ).toString('base64'),
    );

    try {
      await EncryptedStorage.setItem(
        'api_credentials',
        JSON.stringify({
          ...credentialsStored,
          spotifyClientSecret: newClientSecret,
        }),
      );
      setCredentialsStored({
        ...credentialsStored,
        spotifyClientSecret: newClientSecret,
      });
    } catch {}
  };

  const storeYoutubeApiKey = async (newApiKey: string) => {
    setYoutubeApiKey(newApiKey || YOUTUBE_API_KEY || '');

    try {
      await EncryptedStorage.setItem(
        'api_credentials',
        JSON.stringify({...credentialsStored, youtubeApiKey: newApiKey}),
      );
      setCredentialsStored({...credentialsStored, youtubeApiKey: newApiKey});
    } catch {}
  };

  const isSpotifyLoginPossible = () => {
    return !!spotifyClientId && !!spotifyClientSecret && !!spotifyBase64Key;
  };

  useEffect(() => {
    youtubeApi.setApiKey(youtubeApiKey);
  }, [youtubeApiKey]);

  return (
    <ApiCredentialsContext.Provider
      value={{
        spotifyClientId,
        spotifyClientSecret,
        spotifyBase64Key,

        youtubeApiKey,

        credentialsStored,

        storeSpotifyClientId,
        storeSpotifyClientSecret,
        storeYoutubeApiKey,

        isSpotifyLoginPossible,
      }}>
      {children}
    </ApiCredentialsContext.Provider>
  );
};

export default function useSpotifyDevCredentials() {
  const context = useContext(ApiCredentialsContext);

  return context;
}
