import {
	doLogin,
	doLogout
} from '../WSClient'

const authProvider = (url) => {
	return {
		// authentication
		login: async ({username, password}) => {
			const loginResult = await doLogin(username, password, url);
			if (loginResult.success) {
				localStorage.setItem('cbsession', loginResult.result.sessionName)
				localStorage.setItem('cbuserid', loginResult.result.userId)
				return Promise.resolve()
			}
			Promise.reject()
		},
		checkError: error => Promise.resolve(),
		checkAuth: params => {
			return localStorage.getItem('cbsession') === null ? Promise.reject() : Promise.resolve()
		},
		logout: async () => {
			try {
				await doLogout(localStorage.getItem('cbsession'), url)
			} catch(e) {
				console.log(`Logging out of coreBOS failed, the reason is: ${e}`)
			}
			localStorage.removeItem('cbsession')
			localStorage.removeItem('cbuserid')
			return Promise.resolve()
		},
		getIdentity: () => Promise.resolve(),
		// authorization
		getPermissions: params => Promise.resolve(),
		getSessionId: () => {
			return localStorage.getItem('cbsession')
		}
	}
};

export {authProvider}