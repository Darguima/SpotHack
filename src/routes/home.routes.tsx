import React from 'react';

import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

import Home from '../pages/SpotHackPages/Home';
import PlaylistsChangesPage from '../pages/SpotHackPages/PlaylistsChangesPage';
import PlaylistDetailPage from '../pages/DetailPages/PlaylistDetailPage';
import FlatListMusics from '../pages/DetailPages/PlaylistDetailPage/pages/FlatListMusicsPage';
import MusicDetailPage from '../pages/DetailPages/MusicDetailPage';
import FlatListRemovedMusicsPage from '../pages/DetailPages/PlaylistDetailPage/pages/FlatListRemovedMusicsPage';
import FlatListAddedMusicsPage from '../pages/DetailPages/PlaylistDetailPage/pages/FlatListAddedMusicsPage';
import DownloadsManagerPage from '../pages/SpotHackPages/DownloadsManagerPage';
import AddUnrecognizedPlaylistPage from '../pages/SpotHackPages/DownloadsManagerPage/pages/AddUnrecognizedPlaylistPage';
import ReferencePlaylistPage from '../pages/SpotHackPages/DownloadsManagerPage/pages/ReferencePlaylistPage';

import {downloadsInfoSchema} from '../SpotHack_Core/DownloadManager';

type HomeStackParamsList = {
  Home: any;

  PlaylistsChangesPage: any;

  PlaylistDetailPage: any;

  FlatListMusics: any;

  MusicDetailPage: any;

  FlatListRemovedMusicsPage: any;
  FlatListAddedMusicsPage: any;

  DownloadsManagerPage: any;
  AddUnrecognizedPlaylistPage: {
    rootPath: string;
    downloadsInfo: downloadsInfoSchema;
  };
  ReferencePlaylistPage: {
    path: string;
    pathName: string;
  };
};

const HomeRoutes: React.FC = () => {
  const {Navigator, Screen} = createStackNavigator<HomeStackParamsList>();

  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="Home" component={Home} />

      <Screen name="PlaylistsChangesPage" component={PlaylistsChangesPage} />

      <Screen name="PlaylistDetailPage" component={PlaylistDetailPage} />

      <Screen name="FlatListMusics" component={FlatListMusics} />

      <Screen name="MusicDetailPage" component={MusicDetailPage} />

      <Screen
        name="FlatListRemovedMusicsPage"
        component={FlatListRemovedMusicsPage}
      />
      <Screen
        name="FlatListAddedMusicsPage"
        component={FlatListAddedMusicsPage}
      />

      <Screen name="DownloadsManagerPage" component={DownloadsManagerPage} />
      <Screen
        name="AddUnrecognizedPlaylistPage"
        component={AddUnrecognizedPlaylistPage}
      />
      <Screen name="ReferencePlaylistPage" component={ReferencePlaylistPage} />
    </Navigator>
  );
};

type HomeStackNavigationProp = StackNavigationProp<HomeStackParamsList>;
export const homeStackUseNavigator = () =>
  useNavigation<HomeStackNavigationProp>();

export type HomeScreenParamsListProp<
  RouteName extends keyof HomeStackParamsList,
> = StackScreenProps<HomeStackParamsList, RouteName>;

export default HomeRoutes;
