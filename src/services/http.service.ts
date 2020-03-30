import axios from 'axios'

const baseUrl = 'http://localhost:3000/api/';

export default class HttpService {
  static async get(endPoint: string) {
    const url = baseUrl + endPoint;
    try {
      return axios.get(url)
        .then((res) => {
          return res
        }).catch((err) => {
          console.log('err', err)
        })
    } catch (e) {
      console.log('Error', e)
    }
  }

  static async post(endPoint: string, data = {}) {
    const url = baseUrl + endPoint;
    try {
      return axios.post(url, data)
        .then((res) => {
          return res
        }).catch((err) => {
          console.log('err', err)
        })
    } catch (e) {
      console.log('Error', e)
    }
  }

  // private async hitApi() {
  //
  // }
}
