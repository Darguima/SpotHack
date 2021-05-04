import { DownloadMachine } from '../index'

export default function getDownloadsStatus (this: DownloadMachine) {
	return [...this.queue]
}
