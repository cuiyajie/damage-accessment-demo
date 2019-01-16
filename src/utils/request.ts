import { CustomError } from './';
import axios from 'axios'
import env from '../../config/env';
import { mapError } from './constants';
import { Message } from '@antd';
const qs = require('qs')

export interface ICallbackError {
  type: string,
  status: string,
  reason: string
}

const config = env[process.env.NODE_ENV] || env['development'];
axios.defaults.baseURL = config.host
const TIMEOUT = null;

const getConfig = {
  method: 'get',
  timeout: TIMEOUT,
  headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const postConfig = {
  method: 'post',
  timeout: TIMEOUT,
  headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const postFormDataConfig = {
  method: 'post',
  timeout: TIMEOUT,
  transformRequest: [(data) => {
    const formData = new FormData()
    for(const key in data) {
      formData.append(key, data[key])
    }
    return formData
  }]
}

const handleResult =  async (promise) => {
  const { data } = await promise;
  if (data.status.toUpperCase() === 'OK') {
    return data || {};
  }
}

const handleError = e => {
  if (e && e.code === 'ECONNABORTED') {
    Message.error('请求超时')
  }

  const { response } = e;
  if (response) {
    const { data, status } = response

    if (data) {
      if (data.status) {
        if (data.status && mapError[data.status]) {
          Message.error(mapError[data.status])
        } else {
          Message.error(data.reason || '服务器内部错误')
        }
      } else {
        Message.error('服务器内部错误')
      }
    } else {
      Message.error('网络错误，请重试！')
    }
  } else {
    Message.error('网络错误，请重试！')
  }
}

const handleCallbackError = (e): Promise<ICallbackError> => {
  let error = { type: 'CallbackError' } as ICallbackError
  if (e && e.code === 'ECONNABORTED') {
    error.status = 'TIMEOUT'
    error.reason = '请求超时'
  } else {
    const { response } = e;
    if (response) {
      const { data, status } = response
      if (data) {
        if (data.status) {
          if (data.status && mapError[data.status]) {
            error.status = data.status
            error.reason = mapError[data.status]
          } else {
            error.status = 'SERVER_ERROR'
            error.reason = data.reason || '服务器内部错误'
          }
        } else {
          error.status = 'SEVER_ERROR'
          error.reason = '服务器内部错误'
        }
      } else {
        error.status = 'NETWORK_ERROR'
        error.reason = '网络错误，请重试！'
      }
    } else {
      error.status = 'NETWORK_ERROR'
      error.reason = '网络错误，请重试！'
    }
  }
  return Promise.resolve(error)
}

export async function get(url: string, params: any = {}, config: any = {}) {
  try {
    return await handleResult(axios(url, { ...getConfig, ...config, params }))
  } catch(e) { 
    handleError(e)
  }
}

export async function post(url: string, params: any = {}, config: any = {}) {
  try {
    return await handleResult(axios(url, { ...postConfig, ...config, params: null, data: qs.stringify(params) }))
  } catch(e) { 
    handleError(e)
  }
}

export async function postWithCallbackError(url: string, params: any = {}, config: any = {}) {
  try {
    return await handleResult(axios(url, { ...postConfig, ...config, params: null, data: qs.stringify(params) }))
  } catch(e) { 
    return await handleCallbackError(e)
  }
}

export async function postFormData(url: string, params: any = {}, config: any = {}) {
  try {
    return await handleResult(axios(url, { ...postFormDataConfig, params: null, data: params }));
  } catch(e) { 
    handleError(e)
  }
}

export async function postFormDataWithCallbackError(url: string, params: any = {}, config: any = {}) {
  try {
    return await handleResult(axios(url, { ...postFormDataConfig, params: null, data: params }));
  } catch(e) { 
    return await handleCallbackError(e)
  }
}

export function getImageUrl(image_id: string) {
  return `${config.host}/resources/image/${image_id}`
}
