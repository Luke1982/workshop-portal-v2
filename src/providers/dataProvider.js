// import { AutocompleteArrayInput, useLogout } from 'react-admin'
import {
	doGetList,
    doDescribe,
    doGetMany,
    doRetrieve,
    doRevise,
    doGetRelatedByReference,
    doCreate,
    doRelate,
    doGetRelated,
    doGetUserInfo
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
                    this.authProvider.getSessionId(),
                    sort
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
            try {
                const records = await doGetMany(params.ids, resource, localStorage.getItem('cbsession'), url)
                return Promise.resolve(
                    {data: records}
                )
            } catch (e) {
                return Promise.reject(e)
            }
        },
        getManyReference: async (resource, params) => {
            try {
                const result = await doGetRelatedByReference(
                    resource,
                    params,
                    localStorage.getItem('cbsession'),
                    url
                )
                return Promise.resolve({
                    data: result.result,
                    total: result.result.length
                })
            } catch (e) {
                return Promise.reject(e)
            }
        },
        create: async (resource, params) => {
            try {
                const response = await doCreate(resource, params, localStorage.getItem('cbsession'), url)
                return Promise.resolve(
                    {
                        data: {
                            ...response
                        }
                    }
                )
            } catch (e) {
                Promise.reject(e)
            }
        },
        update: async (resource, params) => {
            try {
                const response = await doRevise(params, localStorage.getItem('cbsession'), url)
                return Promise.resolve(
                    {
                        data: {
                            ...response
                        }
                    }
                )
            } catch (e) {
                Promise.reject(e)
            }
        },
        updateMany: (resource, params) => Promise,
        delete: (resource, params) => Promise,
        deleteMany: (resource, params) => Promise,
        relate: async (sourceId, targetIds) => {
            try {
                const response = await doRelate(sourceId, targetIds, localStorage.getItem('cbsession'), url)
                return Promise.resolve({data: response.status === 200})
            } catch (e) {
                return Promise.reject(e)
            }
        },
        getRelated: async (resource, params) => {
            try {
                const response = await doGetRelated(resource, params, localStorage.getItem('cbsession'), url)
                return Promise.resolve({data: await response.json()})
            } catch (e) {
                return Promise.reject(e)
            }
        },
        getUserInfo: async () => {
            try {
                const response = await doGetUserInfo(localStorage.getItem('cbsession'), url)
                return Promise.resolve({data: await response.json()})
            } catch (e) {
                return Promise.reject(e)
            }
        }
    }
}

export {dataProvider}