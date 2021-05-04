import { DownloadMachine } from '../index'

export default function getDownloadsStatus (this: DownloadMachine) {
	return {
		musicsStatus: [...this.queue],
		statistics: this.downloadsStatistics
	}
}
