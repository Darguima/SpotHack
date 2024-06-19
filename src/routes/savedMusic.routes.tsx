import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import SavedMusicPage from '../pages/SpotHackPages/DownloadMusicPage';
import MusicDetailPage from '../pages/DetailPages/MusicDetailPage';

const SavedMusicRoutes: React.FC = () => {
  const {Navigator, Screen} = createStackNavigator();

  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="SavedMusicPage" component={SavedMusicPage} />

      <Screen
        name="MusicDetailPage"
        component={MusicDetailPage}
        initialParams={{spotifyId: ''}}
      />
    </Navigator>
  );
};

export default SavedMusicRoutes;
