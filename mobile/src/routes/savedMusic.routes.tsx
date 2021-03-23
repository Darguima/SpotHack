import React from "react"

import {createStackNavigator} from "@react-navigation/stack"

import SavedMusicPage from '../pages/SpotHackPages/DownloadMusicPage'

const SavedMusicRoutes: React.FC = () => {

	const {Navigator, Screen} = createStackNavigator()

	return (
		<Navigator screenOptions={{headerShown: false}}>
			<Screen name="SavedMusicPage" component={SavedMusicPage}/>
		</Navigator>
	)
}

export default SavedMusicRoutes
