import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL
const REFRESH_TOKEN = process.env.REACT_APP_REFRESH_TOKEN
let accessToken = null
export const apiClient = axios.create({
  baseURL: API_URL
})

const retryOnUnauthenticated = async error => {
  if (error.response && error.response.status === 401) {
    accessToken = null
    if (!error.config.__isRetryRequest) {
      const nextRequest = {
        ...error.config,
        __isRetryRequest: true
      }
      return apiClient(nextRequest)
    }
  }

  return Promise.reject(error.response.data)
}

const getAccessToken = async () => {
  const res = await axios.post(
    `${API_URL}/v2/session/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${REFRESH_TOKEN}`
      }
    }
  )
  accessToken = res.data.token
  return accessToken
}

apiClient.interceptors.response.use(undefined, retryOnUnauthenticated)
apiClient.interceptors.request.use(async config => ({
  ...config,
  headers: {
    ...config.headers,
    Authorization: `Bearer ${accessToken || (await getAccessToken())}`
  }
}))
