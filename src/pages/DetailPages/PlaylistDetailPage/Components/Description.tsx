import React from 'react'
import { Text, StyleSheet } from 'react-native'

import ContentBox from '../../../Components/ContentBox'

interface descriptionProps {
	description: string,
}

const Description:React.FC<descriptionProps> = ({ description }) => {
	if (description === '') {
		description = "This playlist hasn't description"
	}

	return (
		<ContentBox title="Description">

			<Text style={styles.infoText}>
				{description}
			</Text>

		</ContentBox>
	)
}

const styles = StyleSheet.create({
	infoText: {
		color: '#fff',

		fontSize: 17
	}
})

export default Description
