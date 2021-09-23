import md5 from 'crypto-js/md5'

const doLogin = async (user, accesskey, url) => {
	const challengeResult = await doChallenge(user, url)
	const accessKey = md5(`${challengeResult.token}${accesskey}`).toString()

	const loginResponse = await fetch(
		`${url}/webservice.php?operation=login`,
		{
			method: 'POST',
			headers: {
				"Content-type": 'application/x-www-form-urlencoded'
			},
			body: `username=${user}&accessKey=${accessKey}`
		}
	)
	const loginResult = await loginResponse.json()
	return loginResult.success ? Promise.resolve(loginResult) : Promise.reject(loginResult.error.message)
}

const doLogout = async (sessionId, url) => {
	const response = await fetch(
		`${url}/webservice.php?operation=logout`,
		{
			method: 'POST',
			headers: {
				"Content-type": 'application/x-www-form-urlencoded'
			},
			body: `sessionId=${sessionId}&sessionName=${sessionId}`
		}
	)
	const r = await response.json()
	return r.success ? Promise.resolve() : Promise.reject(r.error.message)
}

const doChallenge = async (user, url) => {
	const response = await fetch(`${url}/webservice.php?operation=getchallenge&username=${user}`)
	const r = await response.json()
	return r.success ? Promise.resolve(r.result) : Promise.reject(`Challenge failed for user ${user}`)
}

const doQuery = async (query, sessionId, url) => {
	const response = await fetch(`${url}/webservice.php?operation=query&query=${query};&sessionName=${sessionId}`)
	return await response.json()
}

const doDescribe = async (moduleName, sessionId, url) => {
	const response = await fetch(`${url}/webservice.php?operation=describe&sessionName=${sessionId}&elementType=${moduleName}`)
	const result = await response.json()
	if (result.success === false) {
		throw new Error(result.error.code)
	}
	return result.result
}

const doGetList = async (describeObj, modName, offSet, perPage, url, sessionId) => {
	const fields = [...describeObj.fields].map(field => field.name)
	const q = `SELECT ${fields.join(',')} FROM ${modName.toLowerCase()} LIMIT ${offSet}, ${perPage}`
	const result = await doQuery(q, sessionId, url)
	return result.result
}

const doGetMany = async (ids, modName, sessionId, url) => {
	const q = `SELECT * FROM ${modName.toLowerCase()} WHERE id IN (${ids.join(',')})`
	const result = await doQuery(q, sessionId, url)
	return result.result
}

const doRetrieve = async (id, sessionId, url) => {
	// const q = `SELECT * FROM ${modName.toLowerCase()} WHERE id = ${id})`
	// const result = await doQuery(q, sessionId, url)
	// return result.result
	const response = await fetch(`${url}/webservice.php?operation=retrieve&id=${id}&sessionName=${sessionId}`)
	return await response.json()
}

export {
	doLogin,
	doLogout,
	doGetList,
	doDescribe,
	doGetMany,
	doRetrieve
}