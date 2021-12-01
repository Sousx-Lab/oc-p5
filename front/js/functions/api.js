import {Flash} from './flash.js'

const HTTP_NO_CONTENT = 204
const HTTP_OK = 200

/**
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
  if (response.status === HTTP_OK) { 
    return data
  }

  throw new ApiError(response.status, response.statusText)
}

/**
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