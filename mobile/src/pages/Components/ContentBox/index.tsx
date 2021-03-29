import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'

interface ContentBoxProps {
	title: string,

	style?: ViewStyle,
	titleStyle?: TextStyle,
	contentStyle?: ViewStyle,
	buttonStyle?: ViewStyle,

	buttonText?: string,
	buttonIcon?: React.ReactNode,
	buttonContent?: React.ReactNode,
	buttonOnPress?: () => void
}

const ContentBox:React.FC<ContentBoxProps> = ({
	title,
	style, titleStyle, contentStyle, buttonStyle,
	children,
	buttonText, buttonIcon, buttonContent, buttonOnPress
}) => {
	return (
		<View style={[styles.contentBoxContainer, style]}>
			<Text style={[styles.containerTitle, titleStyle]}>{title}</Text>

			{!!children &&
				<View style={[styles.content, contentStyle]}>
					{children}
				</View>
			}

			{!!buttonContent &&
				<View style={[styles.buttonContainer, buttonStyle]}>
					<TouchableOpacity
						style={styles.button}
						activeOpacity={0.6}
						onPress={buttonOnPress}
					>
						{buttonContent}
					</TouchableOpacity>
				</View>
			}

			{!!buttonText &&
				<View style={[styles.buttonContainer, buttonStyle]}>
					<TouchableOpacity
						style={styles.button}
						activeOpacity={0.6}
						onPress={buttonOnPress}
					>
						<Text style={styles.buttonText}>{buttonText}</Text>

						{buttonIcon}
					</TouchableOpacity>
				</View>
			}

		</View>
	)
}

const styles = StyleSheet.create({
	contentBoxContainer: {
		width: '90%',

		marginVertical: '10%',
		padding: '5%',

		borderColor: '#1c5ed6',
		borderWidth: 3,
		borderRadius: 10
	},

	containerTitle: {
		color: '#aaa',
		fontSize: 18,
		fontWeight: 'bold',

		borderBottomColor: '#aaa',
		borderWidth: 2
	},

	content: {
		marginTop: '10%'
	},

	buttonContainer: {
		width: '40%',
		marginTop: '10%',

		borderColor: '#1c5ed6',
		borderWidth: 1,
		borderRadius: 10
	},

	button: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',

		width: '100%',

		marginVertical: '10%'

	},

	buttonText: {
		textAlign: 'center',
		color: '#1c5ed6',
		fontSize: 17,
		fontWeight: 'bold'
	}
})

export default ContentBox
