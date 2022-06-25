import axios from 'axios'

import {store} from '../redux/redux'

axios.defaults.baseURL = 'http://localhost:8000/'
// axios.defaults.url = 'sss'

 
 
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  store.dispatch({
    type: "LOADINGREDUCER",
    payload: true
  })
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  
  store.dispatch({
    type: "LOADINGREDUCER",
    payload: false
  })
  return response;
}, function (error) {
  store.dispatch({
    type: "LOADINGREDUCER",
    payload: false
  })
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

