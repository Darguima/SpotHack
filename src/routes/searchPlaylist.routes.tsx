import React, {useEffect} from 'react';

import SearchPlaylistPage from '../pages/SpotifyPages/SearchPlaylistPage';
import PlaylistDetailPage from '../pages/DetailPages/PlaylistDetailPage';
import MusicDetailPage from '../pages/DetailPages/MusicDetailPage';
import FlatListMusics from '../pages/DetailPages/PlaylistDetailPage/pages/FlatListMusicsPage';
import FlatListRemovedMusicsPage from '../pages/DetailPages/PlaylistDetailPage/pages/FlatListRemovedMusicsPage';
import FlatListAddedMusicsPage from '../pages/DetailPages/PlaylistDetailPage/pages/FlatListAddedMusicsPage';

import {createStackNavigator} from '@react-navigation/stack';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';

import useAppUtils from '../contexts/appUtils';

const {Navigator, Screen} = createStackNavigator();

const SearchPlaylistRoutes: React.FC<MaterialTopTabScreenProps<any>> = ({
  navigation,
}) => {
  const {changePlaylistSearchInputValue} = useAppUtils();

  useEffect(() => {
    const addListenerTabPress = () => {
      navigation.addListener('tabPress', handleTabPress);
    };

    const removeListenerTabPress = () => {
      navigation.removeListener('tabPress', handleTabPress);
    };

    const handleTabPress = () => {
      changePlaylistSearchInputValue('');
    };

    navigation.addListener('focus', addListenerTabPress);

    navigation.addListener('blur', removeListenerTabPress);

    return () => {
      navigation.removeListener('focus', addListenerTabPress);
      navigation.removeListener('blur', removeListenerTabPress);
    };
  }, [changePlaylistSearchInputValue]);

  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="SearchPlaylistPage" component={SearchPlaylistPage} />

      <Screen name="PlaylistDetailPage" component={PlaylistDetailPage} />

      <Screen name="MusicDetailPage" component={MusicDetailPage} />

      <Screen name="FlatListMusics" component={FlatListMusics} />

      <Screen
        name="FlatListRemovedMusicsPage"
        component={FlatListRemovedMusicsPage}
      />
      <Screen
        name="FlatListAddedMusicsPage"
        component={FlatListAddedMusicsPage}
      />
    </Navigator>
  );
};

export default SearchPlaylistRoutes;
