import Vue from 'vue'
import HttpService from '../../services/http.service'

export default Vue.extend({
  data() {
    return {
      formData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      HttpService.post('login', this.formData).then(res => {
        console.log('result', res)
        localStorage.setItem('userData', JSON.stringify(res.data.data));
        this.$router.push({ path: '/home' });
      })
    }
  }
})
