import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Picker} from '@react-native-picker/picker';

import Entypo from 'react-native-vector-icons/Entypo';

interface HeaderProps {
  rootPath?: string;
  setRootPath?: React.Dispatch<React.SetStateAction<string>>;
  rootPaths?: string[];
  goBackDisabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  rootPath,
  setRootPath,
  rootPaths,
  goBackDisabled = false,
}) => {
  const {goBack} = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.goBackIconContainer}
        onPress={!goBackDisabled ? goBack : () => {}}>
        <Entypo name="chevron-left" style={styles.goBackIcon} size={30} />
      </TouchableOpacity>

      {rootPath && setRootPath && rootPaths && (
        <View style={styles.contentContainer}>
          <Picker
            style={styles.picker}
            selectedValue={rootPath}
            onValueChange={itemValue => setRootPath(itemValue as string)}>
            {rootPaths.map((rootPath, index) => (
              <Picker.Item key={index} label={rootPath} value={rootPath} />
            ))}
          </Picker>
        </View>
      )}

      {rootPath && !setRootPath && (
        <View style={styles.contentContainer}>
          <Text style={styles.text}>{rootPath}</Text>
        </View>
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

  contentContainer: {
    flex: 1,
  },

  picker: {
    color: '#fff',
  },

  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Header;
