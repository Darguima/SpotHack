import React from 'react'
import { Text, View, StyleSheet, Switch } from 'react-native'
import ContentBox from '../../../../../Components/ContentBox'
import useSpotHackSettings from '../../../../../../contexts/spotHackSettings'

const SlowRender:React.FC = () => {
	const { spotHackSettings: { slowRender }, saveNewSpotHackSettings } = useSpotHackSettings()

	return (
		<ContentBox
			title={'Slow Render'}
			style={styles.container}
		>
			<Text style={styles.descriptionText}>
				Slow Render should be true if your phone cannot render Scroll View properly.
			</Text>
			<Text style={styles.descriptionText}>
				With Slow Render, you will lose some Visual Experience (with a slow render of the Items of the Scroll View) but the App will not stop while rendering the List.
			</Text>

			<View style={styles.switchContainer}>
				<Text style={{ color: slowRender ? '#aaa' : '#1c5ed6' }}>
					Fast Render
				</Text>

				<Switch
					value={slowRender}
					onValueChange={() => saveNewSpotHackSettings({ slowRender: !slowRender })}

					trackColor={{ false: '#aaa', true: '#aaa' }}
					thumbColor={'#1c5ed6'}
				/>

				<Text style={{ color: slowRender ? '#1c5ed6' : '#aaa' }}>
					Slow Render
				</Text>
			</View>

		</ContentBox>
	)
}

const styles = StyleSheet.create({
	container: {
	},

	descriptionText: {
		color: '#fff'
	},

	switchContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',

		marginTop: '5%'
	}
})

export default SlowRender
