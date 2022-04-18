import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, Text } from 'react-native'

interface ShortcutsToTabsProps {
	imageSource: ImageSourcePropType,
	navigationFunction?: <RouteName extends string>(...args: [RouteName] | [RouteName, any]) => void,
	jumpToRoutePageName?: string,
	descriptionText?: string
}

const ShortcutsToTabs:React.FC<ShortcutsToTabsProps> = ({
	navigationFunction = () => {},
	jumpToRoutePageName = '',
	imageSource,
	descriptionText
}) => {
	return (
		<View style={styles.buttonContainer}>
			<TouchableOpacity onPress={() => navigationFunction(jumpToRoutePageName)}>
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={imageSource} resizeMode={'contain'}/>
				</View>

				{ !!descriptionText &&
					<Text style={styles.descriptionText}>{descriptionText}</Text>
				}
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	buttonContainer: {
		width: '45%'
	},

	imageContainer: {
		width: '100%',
		aspectRatio: 1,

		marginBottom: '5%'
	},

	image: {
		width: '100%',
		height: '100%'
	},

	descriptionText: {
		color: '#fff',
		fontSize: 18
	}
})

export default ShortcutsToTabs
