import React, {useState, useEffect, useRef} from 'react';
import {TextInput, Keyboard, View, StyleSheet} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';

interface SearchBarHeaderProps {
  setState: React.Dispatch<React.SetStateAction<string>>;
  setChangeInputValue?: React.Dispatch<
    React.SetStateAction<() => (newValue: string) => void>
  >;

  inputPlaceholder: string;

  viewBackgroundColor?: string;
  inputBackgroundColor?: string;
}

const SearchBarHeader: React.FC<SearchBarHeaderProps> = ({
  setState,
  setChangeInputValue,
  inputPlaceholder,
  viewBackgroundColor = '#000',
  inputBackgroundColor = '#fff',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const changeMusicSearchInputValueFromOut = (newValue: string) => {
      setInputValue(newValue);
      setState(newValue);
    };

    if (setChangeInputValue) {
      setChangeInputValue(() => changeMusicSearchInputValueFromOut);
    }
  }, []);

  const handleIconPress = () => {
    if (isFocused) {
      setInputValue('');
    }
    setIsFocused(true);
    inputRef.current!.focus();
  };

  const handleShowKeyboard = () => {
    setIsFocused(true);
  };
  const handleHideKeyboard = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleShowKeyboard);
    Keyboard.addListener('keyboardDidHide', handleHideKeyboard);

    return () => {
      Keyboard.removeListener('keyboardDidShow', handleShowKeyboard);
      Keyboard.removeListener('keyboardDidHide', handleHideKeyboard);
    };
  }, []);

  useEffect(() => {
    if (isFocused === false) {
      setState(inputValue);
    }
  }, [isFocused]);

  return (
    <View style={[styles.container, {backgroundColor: viewBackgroundColor}]}>
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: inputBackgroundColor},
        ]}>
        <View style={styles.textInputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={inputValue}
            onChangeText={e => {
              setInputValue(e);
            }}
            placeholder={inputPlaceholder}
            autoCorrect={false}
          />
        </View>
        <RectButton style={styles.iconButton} onPress={handleIconPress}>
          <View style={styles.iconContainer}>
            <Entypo
              name={isFocused ? 'circle-with-cross' : 'magnifying-glass'}
              style={styles.magnifyIcon}
              size={25}
            />
          </View>
        </RectButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: 60,
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    width: '80%',
    height: '70%',

    paddingHorizontal: '2%',

    borderRadius: 25,
  },

  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',

    width: '90%',
    height: '90%',
  },

  textInput: {
    width: '100%',
    height: '100%',
  },

  iconButton: {
    width: '10%',
    height: '90%',
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: '100%',
  },

  magnifyIcon: {
    color: '#000',
  },
});

export default SearchBarHeader;
