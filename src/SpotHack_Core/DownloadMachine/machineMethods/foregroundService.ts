import { DownloadMachine } from '../index'

import VIForegroundService from '@voximplant/react-native-foreground-service'

const foregroundService = VIForegroundService.getInstance()

export async function startFgService (this: DownloadMachine) {
	this.isFgServiceOn = true
	const channelConfig = {
		id: 'spothackDownloader',
		name: 'SpotHack Downloading',
		description: 'SpotHack is Downloading',
		enableVibration: false,
		importance: 0
	}
	await foregroundService.createNotificationChannel(channelConfig)

	const notificationConfig = {
		channelId: 'spothackDownloader',
		id: 1005,
		title: 'SpotHack Downloading',
		text: 'SpotHack is Downloading',
		icon: 'ic_download',
		priority: 0
	}

	await foregroundService.startService(notificationConfig)
}

export async function stopFgService (this: DownloadMachine) {
	if (!this.isFgServiceOn) return

	if (
		this.isGetYoutubeIdsActive ||
		this.isGetDownloadUrlsActive ||
		this.isDownloadMusicsVideosActive ||
		this.isConvertVideosToMusicsActive
	) return

	await foregroundService.stopService()
	foregroundService.off()

	this.isFgServiceOn = false
}
