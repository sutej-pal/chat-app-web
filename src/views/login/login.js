import Vue from 'vue'
import HttpService from '../../services/http.service'
import UtilityService from '../../services/utility.service'
import _ from 'underscore'

export default Vue.extend({
  data () {
    return {
      formData: {
        email: '',
        password: ''
      },
      isLoggedIn: false
    }
  },
  methods: {
    login () {
      HttpService.post('login', this.formData).then(res => {
        console.log('result', res)
        localStorage.setItem('userData', JSON.stringify(res.data.data))
        this.$router.push({ path: '/home' })
      })
    }
  },
  beforeMount () {
    const user = UtilityService.getUserData();
    setTimeout(() => {
      if (_.isObject(user)) {
        this.$router.push({ path: '/home' })
      } else {
        this.isLoggedIn = true
      }
    }, 2000);
  }
})
