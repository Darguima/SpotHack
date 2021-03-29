import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ToastAndroid, PermissionsAndroid, PermissionStatus } from 'react-native'

import useSpotHackSettings from '../../../../../../contexts/spotHackSettings'
import { exists as existsPath, mkdir as createPath } from 'react-native-fs'
import ContentBox from '../../../../../Components/ContentBox'

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
		// get permission from the user
		let permissionGranted: PermissionStatus = PermissionsAndroid.RESULTS.DENIED
		try {
			permissionGranted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

				{
					title: 'SpotHack Storage Permission',
					message: 'Give access to your Storage to save the music.',
					buttonNegative: 'Cancel',
					buttonPositive: 'Ok'
				}
			)
		} catch (err) {
			setIsNewRootPathValid(false)
			ToastAndroid.show('Error Getting Storage Permissions', ToastAndroid.LONG)
			return
		}

		if (PermissionsAndroid.RESULTS.GRANTED !== permissionGranted) {
			setIsNewRootPathValid(false)
			ToastAndroid.show('We need Storage Permissions', ToastAndroid.LONG)
			return
		}

		if (possibleNewRootPath.indexOf('\n') !== -1) {
			setIsNewRootPathValid(false)
			ToastAndroid.show('Path Invalid', ToastAndroid.LONG)
			return
		}

		try {
			if (!await existsPath(possibleNewRootPath)) {
				createPath(possibleNewRootPath)
			}

			saveNewSpotHackSettings({ rootPath: possibleNewRootPath })
			setRootPathIsEditable(false)
			setIsNewRootPathValid(true)
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

		marginVertical: '5%',
		fontSize: 15
	},

	rootPathInput: {
		color: '#fff',
		backgroundColor: '#212121',

		borderWidth: 1,
		borderColor: '#aaa',
		borderRadius: 10,

		marginHorizontal: '10%',
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
