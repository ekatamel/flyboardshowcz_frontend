import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-type': 'application/json',
  },
})

axios.defaults.withXSRFToken = true

export default axiosClient
