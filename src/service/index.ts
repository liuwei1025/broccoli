import axios from 'axios'

const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/'
      : 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com',
  timeout: 1e4,
})

service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // TODO 上报请求异常
    console.error(error)
    throw error
  }
)

export default service
