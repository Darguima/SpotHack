import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'

import useSpotHackSettings from '../../../../../../contexts/spotHackSettings'
import ContentBox from '../../../../../Components/ContentBox'

const MusicTimeLimit:React.FC = () => {
	const { spotHackSettings: { musicTimeLimit }, saveNewSpotHackSettings } = useSpotHackSettings()
	const [time, setTime] = useState((musicTimeLimit * 100).toString())
	const [exampleTimes, setExampleTimes] = useState(['0', '0'])

	useEffect(() => {
		setExampleTimes([
			Math.max(0, 4 - 4 * musicTimeLimit).toFixed(1).replace(/.0$/, ''),
			(4 + 4 * musicTimeLimit).toFixed(1).replace(/.0$/, '')
		])
	}, [musicTimeLimit])

	return (
		<ContentBox
			title={'Music Time Limit'}
		>
			<Text style={[styles.description, { marginBottom: 8 }]}>
				{"How long can Spotify's music duration differentiate to Youtube's videos duration (used to prevent downloading albums, musics compilation or huge video clips):"}
			</Text>
			<Text style={styles.description}>
				{"Note: This time limit only affects Youtube Scrap, you might find musics that don't respect this rule"}
			</Text>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.inputText}
					textAlign='right'

					keyboardType='numeric'

					placeholder='Music Time Limit'
					placeholderTextColor={'#aaa'}

					value={time}
					onChangeText={setTime}
					onEndEditing={e => {
						const newTime = e.nativeEvent.text.replace(/[^0-9]/g, '') || '75'
						saveNewSpotHackSettings({ musicTimeLimit: Number(newTime) * 0.01 })
						setTime(newTime)
					}}
				/>
				<Text style={[styles.inputText, styles.percentText]}>%</Text>
			</View>

			<View>
				<Text style={styles.exampleText}>
					{`If the Spotify's music has 4 min duration the Youtube need be between ${exampleTimes[0]} min and ${exampleTimes[1]} min.`}
				</Text>
			</View>
		</ContentBox>
	)
}

const styles = StyleSheet.create({
	description: {
		color: '#fff',

		fontSize: 15
	},

	inputContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',

		marginVertical: '5%',

		backgroundColor: '#212121',

		borderWidth: 1,
		borderColor: '#aaa',
		borderRadius: 10
	},

	inputText: {
		color: '#fff',
		fontSize: 16
	},

	percentText: {
		paddingHorizontal: '5%'
	},

	exampleText: {
		color: '#fff'
	}
})

export default MusicTimeLimit
