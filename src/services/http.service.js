import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/'

export default class HttpService {
  static async post (endPoint, data) {
    const request = {
      url: baseUrl + endPoint,
      method: 'post',
      data: data
    }
    try {
      return axios(request)
        .then(res => {
          return res
        }).catch(err => {
          console.log('err', err)
      })
    } catch (e) {
      console.log('Error', e)
    }
  }
}
