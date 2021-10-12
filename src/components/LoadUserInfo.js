import {useEffect} from 'react'
import { useDataProvider } from 'ra-core'

const LoadUserInfo = () => {
	const dataProvider = useDataProvider()
	useEffect(() => {
		if (window.globalUserInfo === undefined) {
			const getUserInfo = async () => {
				const userInfo = await dataProvider.getUserInfo()
				window.globalUserInfo = userInfo.data.result
			}
			getUserInfo()
		}
	})

	return <div>User info</div>
}

export default LoadUserInfo