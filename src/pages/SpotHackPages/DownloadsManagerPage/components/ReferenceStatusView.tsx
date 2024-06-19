import React from 'react';
import {Text, View, StyleSheet, ViewStyle} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

interface referenceStatusViewProps {
  statusText: string;
  color: string;
  iconName: string;

  containerStyle?: ViewStyle;
}

const ReferenceStatusView: React.FC<referenceStatusViewProps> = ({
  statusText,
  color,
  iconName,
  containerStyle = {},
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.playlistReferencedTextContainer}>
        <Text style={[styles.infoText, {color}]}>{statusText}</Text>
        <Feather name={iconName} size={48} style={{color}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 2,
    paddingTop: '5%',

    borderTopColor: '#aaa',
    borderWidth: 1,
  },

  playlistReferencedTextContainer: {
    aspectRatio: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  infoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ReferenceStatusView;
