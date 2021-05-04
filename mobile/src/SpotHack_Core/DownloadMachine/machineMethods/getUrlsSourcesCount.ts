import { DownloadMachine } from '../index'

export default function getUrlsSourcesCount (this: DownloadMachine) {
	return { ...this.urlsSourcesCount }
}
