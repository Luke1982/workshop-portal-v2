// import { AutocompleteArrayInput, useLogout } from 'react-admin'
import {
	doGetList,
    doDescribe,
    doGetMany,
    doRetrieve
} from '../WSClient'
import { authProvider } from './authProvider'

const dataProvider = (url) => {
    return {
        authProvider: authProvider(url),
        getList: async function(resource, params) {
            const {pagination, sort, filter} = params
            const offSet = (pagination.page * pagination.perPage) - pagination.perPage
            try {
                const moduleDescription = await doDescribe(resource, localStorage.getItem('cbsession'), url)
                const records = await doGetList(
                    moduleDescription,
                    resource,
                    offSet,
                    pagination.perPage,
                    url,
                    this.authProvider.getSessionId()
                )
                return Promise.resolve({data: records, total: records.length})
            } catch (e) {
                if (e.message === 'INVALID_SESSIONID') {
                    this.authProvider.logout()
                }
                return Promise.reject(e)
            }
        },
        getOne: async (resource, params) => {
            const record = await doRetrieve(params.id, localStorage.getItem('cbsession'), url)
            return Promise.resolve({data: record.result})
        },
        getMany: async (resource, params) => {
            const records = await doGetMany(params.ids, resource, localStorage.getItem('cbsession'), url)
            return Promise.resolve(
                {data: records}
            )
        },
        getManyReference: (resource, params) => {
            console.log('getManyReference', resource, params)
            return Promise.resolve()
        },
        create: (resource, params) => Promise,
        update: (resource, params) => Promise,
        updateMany: (resource, params) => Promise,
        delete: (resource, params) => Promise,
        deleteMany: (resource, params) => Promise,
    }
}

export {dataProvider}