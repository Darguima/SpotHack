import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {
  HomeScreenParamsListProp,
  homeStackUseNavigator,
} from '../../../../routes/home.routes';

import {readDir, ReadDirItem} from 'react-native-fs';

import Header from '../components/Header';
import MusicPlaylistView from '../../../Components/MusicPlaylistView';

import removeSpecialChars from '../../../../utils/removeSpecialChars';

type Prop = HomeScreenParamsListProp<'AddUnrecognizedPlaylistPage'>;

type DirItemsFiltered = ReadDirItem & {ignore: boolean};

const AddUnrecognizedPlaylistPage: React.FC<Prop> = ({
  route: {
    params: {rootPath, downloadsInfo},
  },
}) => {
  const {navigate} = homeStackUseNavigator();
  const [rootPathItems, setRootPathDirectories] = useState<DirItemsFiltered[]>(
    [],
  );

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const playlistsDetectedNames = Object.keys(downloadsInfo[rootPath]).map(
        playlistId =>
          removeSpecialChars(downloadsInfo[rootPath][playlistId].playlistName),
      );

      const dirItems: DirItemsFiltered[] = (await readDir(rootPath)).map(
        item => ({
          ...item,
          ignore:
            !item.isDirectory() || playlistsDetectedNames.includes(item.name),
        }),
      );

      // To show in order (unrecognized folder, playlists, files)
      const dirs = dirItems.filter(item => item.isDirectory() && !item.ignore);
      const playlists = dirItems.filter(
        item => item.isDirectory() && item.ignore,
      );
      const files = dirItems.filter(item => item.isFile());

      if (isMounted) {
        setRootPathDirectories([...dirs, ...playlists, ...files]);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const sentencesRender = (sentences: string[]) =>
    sentences.map((sentence, index) => (
      <View key={index} style={styles.lineContainer}>
        <Text style={styles.indexText}>{index + 1}</Text>
        <Text style={styles.text}>{sentence}</Text>
      </View>
    ));

  return (
    <ScrollView style={styles.container}>
      <Header rootPath={rootPath} />

      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Add a Playlist</Text>

        <Text style={styles.descriptionText}>
          If you already downloaded a playlist and for some reason {"it's"} no
          longer being recognized, you can correct it.
        </Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.subTitleText}>Steps:</Text>

        {sentencesRender([
          'Start to copy its Spotify Id (available) in its page.',

          'Reference this Spotify Id to any desynchronized folder (highlighted below)',
        ])}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.subTitleText}>Some notes:</Text>

        {sentencesRender([
          'Make sure you are in the correct directory (written in the header).\n\n' +
            'Otherwise, go to the previous page and change it (have a picker also in the header).\n\n' +
            'If the directory you want is not in the picker, add it in the Settings (Root Path).\n',

          'Be careful, if you reference a directory that is not a playlist, we will probably change it and delete some files.',
        ])}
      </View>

      <View>
        <Text style={styles.directoryText}>Items in folder:</Text>

        {rootPathItems.map((item, index) => {
          const isDir = item.isDirectory();

          return (
            <MusicPlaylistView
              key={(isDir ? 'dir' : 'file') + '_' + item.name}
              title={item.name}
              artists={
                item.ignore
                  ? isDir
                    ? 'Playlist Already Detected'
                    : 'This is file'
                  : 'Am I a playlist?'
              }
              imageSource={
                isDir
                  ? require('../../../../assets/icons/directoryIcon.png')
                  : require('../../../../assets/icons/fileIcon.png')
              }
              disabled={item.ignore}
              entypoIconName={!item.ignore ? 'chevron-right' : undefined}
              iconPressAction={() => {
                navigate('ReferencePlaylistPage', {
                  path: item.path,
                  pathName: item.name,
                });
              }}
              viewPressAction={() => {
                navigate('ReferencePlaylistPage', {
                  path: item.path,
                  pathName: item.name,
                });
              }}
              style={{
                opacity: item.ignore ? 0.3 : 1,

                marginTop: '2%',
                marginBottom: index === rootPathItems.length - 1 ? '4%' : '2%',
              }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  textContainer: {
    marginBottom: 25,
  },

  titleText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,

    marginVertical: '5%',
  },

  descriptionText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',

    marginHorizontal: '3%',
  },

  subTitleText: {
    color: '#fff',
    fontSize: 18,
  },

  text: {
    color: '#fff',
    paddingLeft: 5,
    paddingBottom: 5,
  },

  directoryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',

    paddingTop: 15,

    borderTopColor: '#212121',
    borderWidth: 2,
  },

  indexText: {
    color: '#fff',
    textAlign: 'center',

    borderRightColor: '#212121',
    borderWidth: 2,

    width: '7%',
  },

  lineContainer: {
    flexDirection: 'row',
  },
});

export default AddUnrecognizedPlaylistPage;
