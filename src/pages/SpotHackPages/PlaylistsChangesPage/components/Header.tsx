import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Entypo from 'react-native-vector-icons/Entypo';

import useDownloadsInfo from '../../../../contexts/downloadsInfo';

const Header: React.FC = () => {
  const {playlistsChanges, playlistsChecked} = useDownloadsInfo();

  const {goBack} = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.goBackIconContainer} onPress={goBack}>
        <Entypo name="chevron-left" style={styles.goBackIcon} size={30} />
      </TouchableOpacity>

      {!playlistsChecked && (
        <Text style={styles.title}>Checking your playlists</Text>
      )}

      {playlistsChecked && (
        <Text style={styles.title}>
          <Text style={styles.titlePlaylistsNumber}>
            {playlistsChanges.length}
          </Text>{' '}
          Outdated Playlist{playlistsChanges.length !== 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    width: '100%',
    height: 60,

    backgroundColor: '#1c5ed6',
  },

  goBackIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    height: '100%',
    aspectRatio: 1,
  },

  goBackIcon: {
    color: '#fff',
  },

  title: {
    flex: 1,

    color: '#fff',
    fontSize: 19,

    textAlign: 'center',
  },

  titlePlaylistsNumber: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default Header;
