import { DownloadMachine } from '../index'

export default async function setFinalPath (this: DownloadMachine, newFinalPath: string) {
	if (!newFinalPath.endsWith('/')) newFinalPath += '/'

	this.finalPath = newFinalPath
}
