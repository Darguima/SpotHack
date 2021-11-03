const convertCodeAndErrorsToColor = (iconCode: number, actualCode: number, message: string) => {
	const disableColor = '#000'
	const workingColor = '#ff0'
	const successColor = '#0f0'
	const errorColor = '#f00'

	const mainMessage = message.slice(0, message.indexOf(' -'))

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
			} else if (actualCode >= 5) {
				return successColor
			}
		} else if (iconCode === 4) {
			if (actualCode < 5) {
				return disableColor
			} else if (actualCode === 5) {
				return workingColor
			} else if (actualCode === 6) {
				return successColor
			}
		}
	} else {
		if (mainMessage === 'gotten_youtubeId' || mainMessage === 'gotten_downloadUrl') {
			if (iconCode === 1) {
				return errorColor
			} else {
				return disableColor
			}
		} else if (mainMessage === 'downloadedMusicVideo') {
			if (iconCode === 2) {
				return errorColor
			} else if (iconCode < 2) {
				return successColor
			} else {
				return disableColor
			}
		} else if (mainMessage === 'convertedVideoToMusic') {
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
 * progress - stage:
 *
 * 0 - ${stage where error ocurred} - ${err}
 * 1 - start
 * 2 - gotten_youtubeId
 * 3 - gotten_downloadUrl
 * 4 - downloadedMusicVideo
 * 5 - convertedVideoToMusic
 * 6 - downloadedMusic / alreadyDownloaded
*/
