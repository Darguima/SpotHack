const convertCodeAndErrorsToColor = (iconCode: number, actualCode: number, message: string) => {
  const disableColor = '#000'
  const workingColor = '#ff0'
  const successColor = '#0f0'
  const errorColor = '#f00'

  if (actualCode !== 0) {
    if (iconCode === 1) {
      if (actualCode < 3) {
        return workingColor
      } else if (actualCode >= 3) {
        return successColor
      }
    } else if (iconCode === 2) {
      if (actualCode < 3) {
        return disableColor
      } else if (actualCode === 3) {
        return workingColor
      } else if (actualCode >= 4) {
        return successColor
      }
    } else if (iconCode === 3) {
      if (actualCode < 4) {
        return disableColor
      } else if (actualCode === 4) {
        return workingColor
      } else if (actualCode === 200) {
        return successColor
      }
    } else if (iconCode === 4) {
      if (actualCode <= 4) {
        return disableColor
      } else if (actualCode === 200 && message === 'conversion success') {
        return workingColor
      } else if (actualCode === 200) {
        return successColor
      }
    }
  } else {
    if (message === 'PermissionsAndroid canceled' || message === 'PermissionsAndroid error' || message === 'react-native-ytdl error' || message === 'RNFS create assets error') {
      if (iconCode === 1) {
        return errorColor
      } else {
        return disableColor
      }
    } else if (message === 'RNFS download video error') {
      if (iconCode === 2) {
        return errorColor
      } else if (iconCode < 2) {
        return successColor
      } else {
        return disableColor
      }
    } else if (message === 'RNFFmpeg conversion error') {
      if (iconCode === 3) {
        return errorColor
      } else if (iconCode < 3) {
        return successColor
      } else {
        return disableColor
      }
    }
  }

  return errorColor
}

export default convertCodeAndErrorsToColor

/*

PermissionsAndroid sucess   -- 1
PermissionsAndroid success  -- 1
react-native-ytdl success   -- 2
RNFS create assets success  -- 3
RNFS download video success -- 4
RNFS download video success -- 4
RNFFmpeg conversion success -- 200
RNFFmpeg conversion success -- 200

PermissionsAndroid canceled -- 1
PermissionsAndroid error    -- 1
react-native-ytdl error     -- 2
RNFS create assets error    -- 3
RNFS download video error   -- 4
RNFFmpeg conversion error   -- 200
*/
