import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {infoSourceIcon} from '../../../SpotHack_Core/GetYoutubeUrl';

interface YoutubeIdSourcesIconsProps {
  iconName: infoSourceIcon;
}

const YoutubeIdSourcesIcons: React.FC<YoutubeIdSourcesIconsProps> = ({
  iconName,
}) => {
  const statusIcons: {[key: string]: React.ReactNode} = {
    loading: (
      <MaterialCommunityIcons
        name="clock-time-three-outline"
        size={17}
        color="#aaa"
      />
    ),
    asyncStorage: (
      <MaterialCommunityIcons name="safe" size={20} color="green" />
    ),
    ytScrape: <MaterialCommunityIcons name="web" size={18} color="blue" />,
    ytApi: <MaterialCommunityIcons name="youtube" size={17} color="red" />,
    error: <Entypo name="cross" size={20} color="red" />,
  };

  return <>{statusIcons[iconName]}</>;
};

export default YoutubeIdSourcesIcons;
