import React from 'react'
import { Text, View, StyleSheet, Image, ViewStyle, ImageSourcePropType } from 'react-native'

import Entypo from 'react-native-vector-icons/Entypo'

import { TouchableOpacity } from 'react-native-gesture-handler'

interface SearchBarHeaderProps {
	imageSource: ImageSourcePropType,
	title: string,
	artists: string,

	style?: ViewStyle

	viewBackgroundColor?: string,
	contentBackgroundColor?: string,

	viewPressAction?: () => void
	entypoIconName?: string,
	iconSize?: number,
	iconPressAction?: () => void,
	disabled?: boolean

	titleNumberOfLines?: number,
	artistsNumberOfLines?: number,
}

const MusicPlaylistView:React.FC<SearchBarHeaderProps> = (
	{
		imageSource, title, artists,
		style, viewBackgroundColor = '#212121', contentBackgroundColor = '#212121',
		titleNumberOfLines = 2, artistsNumberOfLines = 1,
		viewPressAction, entypoIconName, iconSize = 30, iconPressAction = () => {}, disabled = false
	}) => {
	return (
		<View style={[styles.container, { backgroundColor: viewBackgroundColor }, style || {}]}>
			<View style={[styles.content, { backgroundColor: contentBackgroundColor }]}>

				<View style={styles.leftPart}>
					<TouchableOpacity
						style={styles.leftPartButton}
						onPress={viewPressAction}
						disabled={disabled}
					>
						<View style={styles.imageContainer}>
							<Image source={imageSource} style={styles.image}/>
						</View>

						<View style={styles.textsContainer}>
							<Text style={styles.titleText} numberOfLines={titleNumberOfLines}>{title}</Text>
							<Text style={styles.artistsText} numberOfLines={artistsNumberOfLines}>{artists}</Text>
						</View>
					</TouchableOpacity>
				</View>

				{entypoIconName &&
						<View style={styles.rightPart}>
							<TouchableOpacity style={styles.iconButton} onPress={iconPressAction}>
								<Entypo name={entypoIconName} style={styles.icon} size={iconSize}/>
							</TouchableOpacity>
						</View>
				}

			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'flex-end',

		width: '100%'
	},

	content: {
		flex: 1,
		flexDirection: 'row',

		width: '100%',
		paddingLeft: '5%',
		minHeight: 75

	},

	leftPart: {
		height: '100%',
		width: '80%'
	},

	leftPartButton: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',

		height: '100%',
		width: '100%'
	},

	imageContainer: {
		height: '80%',
		aspectRatio: 1

	},

	image: {
		resizeMode: 'contain',
		height: '100%',
		width: '100%'
	},

	textsContainer: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'space-evenly',

		height: '100%',

		marginLeft: '7%'
	},

	titleText: {
		color: '#fff',
		fontSize: 18
	},

	artistsText: {
		color: '#ccc',
		fontSize: 14
	},

	rightPart: {
		height: '100%',
		width: '20%'
	},

	iconButton: {
		justifyContent: 'center',
		alignItems: 'center',

		height: '100%',
		width: '100%'
	},

	icon: {
		color: '#fff'
	}
})

export default MusicPlaylistView
