import React from 'react'

import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'

import LoadingPage from '../pages/OtherPages/LoadingPage'

import useAuth from '../contexts/auth'
import { UserDataProvider } from '../contexts/userData'
import { AppUtilsProvider } from '../contexts/appUtils'
import { UserHistoryProvider } from '../contexts/userHistory'
import { SpotHackSettingsProvider } from '../contexts/spotHackSettings'
import { DownloadsInfoProvider } from '../contexts/downloadsInfo'

import downloadManager from '../SpotHack_Core/DownloadManager'

const Routes: React.FC = () => {
	const { loading, signed } = useAuth()

	if (loading) {
		return <LoadingPage />
	}

	if (signed) { downloadManager.startDownloadManager() }

	return signed
		? <UserDataProvider>
			<AppUtilsProvider>
				<UserHistoryProvider>
					<SpotHackSettingsProvider>
						<DownloadsInfoProvider>

							<AppRoutes />

						</DownloadsInfoProvider>
					</SpotHackSettingsProvider>
				</UserHistoryProvider>
			</AppUtilsProvider>
		</UserDataProvider>
		: <AuthRoutes />
}

export default Routes
