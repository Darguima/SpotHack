import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'

interface ShortcutsToTabsProps {
	navigationFunction?: <RouteName extends string>(...args: [RouteName] | [RouteName, any]) => void,
	jumpToRoutePageName?: string,
	imageSource?: ImageSourcePropType,

}

const ShortcutsToTabs:React.FC<ShortcutsToTabsProps> = ({
	children,
	navigationFunction = () => {},
	jumpToRoutePageName = '',
	imageSource
}) => {
	if (!children && !imageSource) return <></>

	return (
		<View style={styles.imagesButtonContainer}>
			<TouchableOpacity
				style={styles.button}
				onPress={() => navigationFunction(jumpToRoutePageName)}
			>
				{children}
				{!children &&
				<Image
					source={imageSource!}
					style={styles.images}
				/>
				}

			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	imagesButtonContainer: {
		width: '80%',
		aspectRatio: 1.5,

		marginVertical: '5%',

		overflow: 'hidden'
	},

	button: {
		width: '100%',
		height: '100%'
	},

	images: {
		resizeMode: 'stretch',
		width: '100%',
		height: '100%',

		borderRadius: 25
	}
})

export default ShortcutsToTabs
