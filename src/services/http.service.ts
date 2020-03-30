import axios from 'axios'

const baseUrl = 'http://192.168.42.49:3000/api/';

export default class HttpService {
  static async get(endPoint: string, authorization = true) {
    const request = {
      url: baseUrl + endPoint,
      headers: {},
      method: 'get'
    };
    if (authorization) {
      request.headers = HttpService.addAuthenticationToken();
    }
    return HttpService.hitApi(request);
  }

  static async post(endPoint: string, data = {}, authorization = true) {
    const request = {
      url: baseUrl + endPoint,
      data,
      method: "post",
      headers: {}
    };
    if (authorization) {
      request.headers = HttpService.addAuthenticationToken();
    }
    return HttpService.hitApi(request);
  }

  private static addAuthenticationToken() {
    const headers = {
      Authorization: ''
    };
    const temp = localStorage.getItem('userData');
    let userData = {
      token: ''
    };
    if (typeof temp === "string") {
      userData = JSON.parse(temp);
    }
    if (userData && userData.token) {
      headers.Authorization = 'Bearer ' + userData.token
    }
    return headers
  }

  private static async hitApi(request = {}) {
    try {
      return axios(request)
        .then((res) => {
          return res
        }).catch((err) => {
          console.log('err', err)
        })
    } catch (e) {
      console.log('Error', e)
    }
  }
}
