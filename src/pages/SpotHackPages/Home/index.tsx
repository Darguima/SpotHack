import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';

import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';

import BigShortcutsToTabs from './components/BigShortcutsToTabs';
import ShortcutsToTabs from './components/ShortcutsToTabs';
import PlaylistsChanges from './components/PlaylistsChanges';

const Home: React.FC<MaterialTopTabScreenProps<any>> = ({
  navigation: {jumpTo},
}) => {
  const {navigate} = useNavigation();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContentContainerStyle}>
      <BigShortcutsToTabs
        navigationFunction={navigate}
        jumpToRoutePageName="PlaylistsChangesPage">
        <PlaylistsChanges />
      </BigShortcutsToTabs>

      <View style={styles.row}>
        <ShortcutsToTabs
          navigationFunction={navigate}
          jumpToRoutePageName="DownloadsManagerPage"
          imageSource={require('../../../assets/downloadManager.png')}
          descriptionText={'Downloads Manager'}
        />

        <ShortcutsToTabs
          navigationFunction={jumpTo}
          jumpToRoutePageName="SettingsStack"
          imageSource={require('../../../assets/settings.png')}
          descriptionText={'Settings Page'}
        />
      </View>

      <BigShortcutsToTabs
        navigationFunction={jumpTo}
        jumpToRoutePageName="SearchMusicStack"
        imageSource={require('../../../assets/searchMusic.png')}
      />
      <BigShortcutsToTabs
        navigationFunction={jumpTo}
        jumpToRoutePageName="SearchPlaylistStack"
        imageSource={require('../../../assets/playlists.png')}
      />
      <BigShortcutsToTabs
        navigationFunction={jumpTo}
        jumpToRoutePageName="SavedMusicStack"
        imageSource={require('../../../assets/savedMusic.png')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },

  scrollViewContentContainerStyle: {
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    width: '80%',
  },
});

export default Home;
