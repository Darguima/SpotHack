import React from 'react';
import {StyleSheet, View} from 'react-native';

import RootPathInput from './components/RootPathInput';
import SpotHackServerUrlInput from './components/SpotHackServerUrlInput';
import DefaultDownloadSource from './components/DefaultDownloadSource';
import MusicTimeLimit from './components/MusicTimeLimit';
import SlowRender from './components/SlowRender';

const SpotifyAccountSettings: React.FC = () => {
  return (
    <View style={styles.spotHackContainer}>
      <RootPathInput />

      <SpotHackServerUrlInput />

      <DefaultDownloadSource />

      <MusicTimeLimit />

      <SlowRender />
    </View>
  );
};

const styles = StyleSheet.create({
  spotHackContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
});

export default SpotifyAccountSettings;
