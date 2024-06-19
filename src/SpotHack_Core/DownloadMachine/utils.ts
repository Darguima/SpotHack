import * as RNFS from 'react-native-fs';

export const createAssetsOnPath = async (pathWithFile: string) => {
  try {
    if (pathWithFile.endsWith('/')) {
      pathWithFile = pathWithFile.substring(0, pathWithFile.length - 1);
    }

    const path = pathWithFile.substring(0, pathWithFile.lastIndexOf('/'));

    if (!(await RNFS.exists(pathWithFile))) {
      await RNFS.mkdir(path);
      await RNFS.writeFile(pathWithFile, '');
    }

    return 1;
  } catch (err) {
    return 0;
  }
};

export const deleteAssetsOnPath = async (pathWithFile: string) => {
  try {
    RNFS.unlink(pathWithFile);
  } catch (err) {}
};
