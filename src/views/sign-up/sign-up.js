import Vue from 'vue'
import HttpService from '../../services/http.service'

export default Vue.extend({
  data () {
    return {
      formData: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    signUp () {
      HttpService.post('sign-up', this.formData).then(res => {
        console.log('res', res)
      })
    }
  }
})
