import {DownloadMachine} from '../index';

import downloadManager from '../../DownloadManager';

export default async function setFinalPath(
  this: DownloadMachine,
  newFinalPath: string,
) {
  if (!newFinalPath.endsWith('/')) {
    newFinalPath += '/';
  }

  this.finalPath = newFinalPath;
  downloadManager.rootPath = newFinalPath;
}
