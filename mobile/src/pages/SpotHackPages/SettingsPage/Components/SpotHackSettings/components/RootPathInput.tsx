import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ToastAndroid } from 'react-native'

import useSpotHackSettings from '../../../../../../contexts/spotHackSettings'
import { exists as existsPath, mkdir as createPath, readDir } from 'react-native-fs'
import ContentBox from '../../../../../Components/ContentBox'
import { getExternalStoragePermissions } from '../../../../../../utils/getStoragePermissions'

import downloadManager from '../../../../../../SpotHack_Core/DownloadManager'

const RootPathInput:React.FC = () => {
	const { spotHackSettings, saveNewSpotHackSettings } = useSpotHackSettings()

	const [newRootPath, setNewRootPath] = useState(spotHackSettings.rootPath)
	const [isNewRootPathValid, setIsNewRootPathValid] = useState(true)

	const [rootPathIsEditable, setRootPathIsEditable] = useState(false)

	useEffect(() => {
		if (newRootPath !== spotHackSettings.rootPath) {
			setNewRootPath(newRootPath)
		}
	}, [spotHackSettings])

	const verifyAndSetNewRootPath = async (possibleNewRootPath: string) => {
		const storagePermissions = await getExternalStoragePermissions(() => { setIsNewRootPathValid(false) })

		if (!storagePermissions) {
			setIsNewRootPathValid(false)
			return
		}

		if (possibleNewRootPath.indexOf('\n') !== -1) {
			setIsNewRootPathValid(false)
			ToastAndroid.show('Path Invalid', ToastAndroid.LONG)
			return
		}

		if (!possibleNewRootPath.endsWith('/')) possibleNewRootPath += '/'

		if (downloadManager.downloadManagerStarted) {
			setIsNewRootPathValid(false)
			ToastAndroid.show('Updating playlists - wait a moment', ToastAndroid.LONG)
			return
		}

		try {
			if (!await existsPath(possibleNewRootPath)) {
				await createPath(possibleNewRootPath)
			}
			await readDir(possibleNewRootPath)

			saveNewSpotHackSettings({ rootPath: possibleNewRootPath })
			setRootPathIsEditable(false)
			setIsNewRootPathValid(true)
			setNewRootPath(possibleNewRootPath)
			ToastAndroid.show('Root Path Edited', ToastAndroid.LONG)
		} catch (err) {
			setIsNewRootPathValid(false)
			ToastAndroid.show('Path Invalid', ToastAndroid.LONG)
		}
	}

	return (
		<ContentBox
			title={'Root Path'}
			style={styles.rootPathContainer}
		>
			<Text style={styles.rootPathDescription}>Where your songs are saved: </Text>
			<TextInput
				style={[styles.rootPathInput, isNewRootPathValid ? {} : styles.invalidRootPath]}

				value={newRootPath}
				onChangeText={e => {
					setIsNewRootPathValid(true)
					setNewRootPath(e)
				}}

				editable={rootPathIsEditable}

				multiline={true}
			/>

			<View style={styles.buttonsRowContainer}>
				{!rootPathIsEditable
					? <View style={styles.rootPathButtonContainer}>
						<TouchableOpacity
							style={styles.rootPathButtons}
							activeOpacity={0.6}
							onPress={() => { setRootPathIsEditable(!rootPathIsEditable) }}
						>
							<Text style={styles.rootPathButtonsText}>Edit</Text>
						</TouchableOpacity>
					</View>

					: <>
						<View style={styles.rootPathButtonContainer}>
							<TouchableOpacity
								style={styles.rootPathButtons}
								activeOpacity={0.6}
								onPress={() => {
									setNewRootPath(spotHackSettings.rootPath)
									setIsNewRootPathValid(true)
									setRootPathIsEditable(!rootPathIsEditable)
								}}
							>
								<Text style={styles.rootPathButtonsText}>Cancel</Text>
							</TouchableOpacity>
						</View>

						<View style={[styles.rootPathButtonContainer, isNewRootPathValid ? {} : styles.invalidRootPath]}>
							<TouchableOpacity
								style={styles.rootPathButtons}
								activeOpacity={0.6}
								onPress={() => { verifyAndSetNewRootPath(newRootPath) }}
							>
								<Text
									style={[styles.rootPathButtonsText, isNewRootPathValid ? {} : { ...styles.invalidRootPath, borderWidth: 0 }]}
								>
											Save
								</Text>
							</TouchableOpacity>
						</View>
					</>
				}
			</View>
		</ContentBox>
	)
}

const styles = StyleSheet.create({
	rootPathContainer: {
	},

	rootPathDescription: {
		color: '#fff',

		marginBottom: '5%',
		fontSize: 15
	},

	rootPathInput: {
		color: '#fff',
		backgroundColor: '#212121',

		borderWidth: 1,
		borderColor: '#aaa',
		borderRadius: 10,

		paddingVertical: '4%',
		fontSize: 16
	},

	buttonsRowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	rootPathButtonContainer: {
		width: '40%',
		marginTop: '10%',

		borderColor: '#1c5ed6',
		borderWidth: 1,
		borderRadius: 10
	},

	rootPathButtons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',

		width: '100%',

		marginVertical: '10%'

	},

	rootPathButtonsText: {
		textAlign: 'center',
		color: '#1c5ed6',
		fontSize: 17,
		fontWeight: 'bold'
	},

	invalidRootPath: {
		borderColor: '#f00',
		color: '#f00'
	}
})

export default RootPathInput
