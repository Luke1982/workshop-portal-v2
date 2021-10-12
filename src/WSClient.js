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

const doGetList = async (describeObj, modName, offSet, perPage, url, sessionId, sorting) => {
	const fields = [...describeObj.fields].map(field => field.name)
	const q = `SELECT ${fields.join(',')} FROM ${modName.toLowerCase()} ORDER BY ${sorting.field} ${sorting.order} LIMIT ${offSet}, ${perPage}`
	const result = await doQuery(q, sessionId, url)
	return result.result
}

const doGetMany = async (ids, modName, sessionId, url) => {
	const q = `SELECT * FROM ${modName.toLowerCase()} WHERE id IN (${ids.join(',')})`
	const result = await doQuery(q, sessionId, url)
	return result.result
}

const doRetrieve = async (id, sessionId, url) => {
	const response = await fetch(`${url}/webservice.php?operation=retrieve&id=${id}&sessionName=${sessionId}`)
	return await response.json()
}

const doRevise = async (record, sessionId, url) => {
	const response = await fetch(`
			${url}/webservice.php
			?operation=revise
			&sessionName=${sessionId}
		`,
		{
			method: 'POST',
			headers: {
				"Content-type": 'application/x-www-form-urlencoded'
			},
			body: 'element=' + JSON.stringify(record)
		}
	)
	try {
		const result = await response.json()
		if (result.success === true) {
			return Promise.resolve(result.result)
		} else {
			return Promise.reject(result.error.code)
		}
	} catch(e) {
		return Promise.reject('Kon niet updaten')
	}
}

const doGetRelatedByReference = async (relatedModName, params, sessionId, url) => {
	const query = `SELECT * FROM ${relatedModName} 
		WHERE ${params.target} = ${params.id} 
		ORDER BY ${params.sort.field} ${params.sort.order}`
	return await doQuery(query, sessionId, url)
}

const doCreate = async (modName, record, sessionId, url) => {
	try {
		return await doCreateOrRevise('create', modName, record, sessionId, url)
	} catch (e) {
		console.error(e)
	}
}

const doCreateOrRevise = async (type, modName, record, sessionId, url) => {
	const response = await fetch(`
			${url}/webservice.php
			?operation=${type}
			&sessionName=${sessionId}
		`,
		{
			method: 'POST',
			headers: {
				"Content-type": 'application/x-www-form-urlencoded'
			},
			body: 'element=' + JSON.stringify(record) + '&elementType=' + modName
		}
	)
	try {
		const result = await response.json()
		if (result.success === true) {
			return Promise.resolve(result.result)
		} else {
			return Promise.reject(result.error.code)
		}
	} catch(e) {
		const operation = type === 'create' ? 'aanmaken' : 'updaten'
		return Promise.reject(`Kon niet ${operation}`)
	}
}

const doRelate = async (sourceId, targetIds, sessionId, url) => {
	const response = await fetch(`
			${url}/webservice.php
			?operation=SetRelation
			&sessionName=${sessionId}
		`,{
			method: 'POST',
			headers: {
				"Content-type": 'application/x-www-form-urlencoded'
			},
			body: 'relate_this_id=' + sourceId + '&with_these_ids=' + JSON.stringify(targetIds)
		}
	)
	return response
}

const doGetRelated = async (sourceMod, params, sessionId, url) => {
	const response = await fetch(
			`
				${url}
				/webservice.php
				?operation=getRelatedRecords
				&sessionName=${sessionId}
				&id=${params.id}
				&module=${sourceMod}
				&relatedModule=${params.target}
			`
		)
	if (response.status !== 200) {
		return Promise.reject('msg.getrelated.failed')
	}
	return response
}

export {
	doLogin,
	doLogout,
	doGetList,
	doDescribe,
	doGetMany,
	doRetrieve,
	doRevise,
	doGetRelatedByReference,
	doCreate,
	doRelate,
	doGetRelated
}