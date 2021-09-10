import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import Home from '../pages/SpotHackPages/Home'
import PlaylistsChangesPage from '../pages/SpotHackPages/PlaylistsChangesPage'
import PlaylistDetailPage from '../pages/DetailPages/PlaylistDetailPage'
import FlatListMusics from '../pages/DetailPages/PlaylistDetailPage/pages/FlatListMusicsPage'
import MusicDetailPage from '../pages/DetailPages/MusicDetailPage'
import FlatListRemovedMusicsPage from '../pages/DetailPages/PlaylistDetailPage/pages/FlatListRemovedMusicsPage'
import FlatListAddedMusicsPage from '../pages/DetailPages/PlaylistDetailPage/pages/FlatListAddedMusicsPage'

const HomeRoutes: React.FC = () => {
	const { Navigator, Screen } = createStackNavigator()

	return (
		<Navigator screenOptions={{ headerShown: false }}>
			<Screen name="Home" component={Home}/>

			<Screen name="PlaylistsChangesPage" component={PlaylistsChangesPage}/>

			<Screen name="PlaylistDetailPage" component={PlaylistDetailPage}/>

			<Screen name="FlatListMusics" component={FlatListMusics} />

			<Screen name="MusicDetailPage" component={MusicDetailPage} />

			<Screen name="FlatListRemovedMusicsPage" component={FlatListRemovedMusicsPage} />
			<Screen name="FlatListAddedMusicsPage" component={FlatListAddedMusicsPage} />
		</Navigator>
	)
}

export default HomeRoutes
