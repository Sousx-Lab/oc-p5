import {Flash} from './flash.js'

const HTTP_OK = 200
const HTTP_CREATED = 201
const HTTP_NO_CONTENT = 204

/**
 * fatch url and return Json
 * @param {RequestInfo} url
 * @param {object} params
 * @returns {Promise<object>}
 */
async function jsonFetch (url, params = {}) {
  // Convert FormData to object
  if (params.body instanceof FormData) {
    params.body = Object.fromEntries(params.body)
  }
  // Convert object to string (json)
  if (params.body && typeof params.body === 'object') {
    params.body = JSON.stringify(params.body)
  }
 
  params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    ...params
  }
  
  const response = await fetch(url, params)
  if (response.status === HTTP_NO_CONTENT) {
      return null
  }
  const data = await response.json()
  if (response.status === HTTP_OK || response.status === HTTP_CREATED ) { 
    return data
  }

  throw new ApiError(response.status, response.statusText)
}

/**
 * Call jsonFetch function & handle error 
 * @param {RequestInfo} url
 * @param {object} params
 * @return {Promise<object>} Promise
 */
 export async function jsonFetchOrFlash(url, params = {}) {
   
  try {
    return await jsonFetch(url, params)
  } catch (e) {
    if (e instanceof ApiError) {
      Flash.error(e.statuCode, e.message)
    } else {
      Flash.error(e)
    }
    return null
  }
}


class ApiError {
  /**
   * @param {?number} statusCode 
   * @param {?string} statusText 
   */
  constructor(statusCode, statusText){
    this.statusCode = statusCode
    this.statusText = statusText
  }

  getMessage(){
    return this.statusText
  }
  get message(){
    return this.getMessage()
  }

  getStatusCode(){
    return this.statusCode
  }

  get statuCode(){
    return this.getStatusCode()
  }

}