import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import ContentBox from '../../../Components/ContentBox';

import Entypo from 'react-native-vector-icons/Entypo';

import useDownloadsInfo from '../../../../contexts/downloadsInfo';

interface PlaylistChangesProps {
  playlistId: string;
}

const PlaylistChanges: React.FC<PlaylistChangesProps> = ({playlistId}) => {
  const {navigate} = useNavigation();

  const {playlistsChangesObject, playlistsChecked} = useDownloadsInfo();

  const playlistChanges = playlistsChangesObject[playlistId];

  let addedMusicsNumber = 0;
  let removedMusicsNumber = 0;

  if (playlistsChecked && playlistChanges) {
    addedMusicsNumber = (playlistChanges.added || {length: 0}).length;
    removedMusicsNumber = (playlistChanges.removed || {length: 0}).length;
  }

  return (
    <ContentBox
      title={playlistChanges ? 'Playlist Changes' : 'Checking Playlists'}
      contentStyle={{
        marginTop: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={[
          styles.buttonContainer,
          addedMusicsNumber === 0 ? styles.buttonDisabled : {},
        ]}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          disabled={addedMusicsNumber === 0}
          onPress={() => {
            navigate('FlatListAddedMusicsPage', {
              playlistId: playlistChanges.playlistId,
            });
          }}>
          <View>
            <Text
              style={[
                styles.buttonText,
                addedMusicsNumber === 0 ? styles.buttonDisabled : {},
              ]}>
              Added
            </Text>
            <Text
              style={[
                styles.buttonText,
                addedMusicsNumber === 0 ? styles.buttonDisabled : {},
              ]}>
              Musics
            </Text>
          </View>

          <Entypo
            name="plus"
            style={[
              styles.buttonIcon,
              addedMusicsNumber === 0 ? styles.buttonDisabled : {},
            ]}
            size={20}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.buttonContainer,
          removedMusicsNumber === 0 ? styles.buttonDisabled : {},
        ]}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          disabled={removedMusicsNumber === 0}
          onPress={() => {
            navigate('FlatListRemovedMusicsPage', {
              playlistId: playlistChanges.playlistId,
            });
          }}>
          <View>
            <Text
              style={[
                styles.buttonText,
                removedMusicsNumber === 0 ? styles.buttonDisabled : {},
              ]}>
              Removed
            </Text>
            <Text
              style={[
                styles.buttonText,
                removedMusicsNumber === 0 ? styles.buttonDisabled : {},
              ]}>
              Musics
            </Text>
          </View>

          <Entypo
            name="trash"
            style={[
              styles.buttonIcon,
              removedMusicsNumber === 0 ? styles.buttonDisabled : {},
            ]}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </ContentBox>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '45%',
    marginTop: '10%',

    borderColor: '#1c5ed6',
    borderWidth: 1,
    borderRadius: 10,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    width: '100%',

    marginVertical: '10%',
  },

  buttonText: {
    textAlign: 'center',
    color: '#1c5ed6',
    fontSize: 15,
    fontWeight: 'bold',
  },

  buttonIcon: {
    color: '#1c5ed6',
    marginLeft: '5%',
  },

  buttonDisabled: {
    borderColor: '#555',
    color: '#555',
  },
});

export default PlaylistChanges;
