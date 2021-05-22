
export class DownloadManager {
	private rootPathValue = ''
	get rootPath () { return this.rootPathValue }
	set rootPath (newRootPath) {
		if (this.rootPathValue !== newRootPath) {
			this.rootPathValue = newRootPath
		}
	}
}

const downloadManager = new DownloadManager()

export default downloadManager
