import Vue from 'vue'
import HttpService from '../../services/http.service'

export default Vue.extend({
  data () {
    return {
      formData: {
        name: '',
        email: '',
        password: ''
      },
      verifyMailSent: false,
      hitSigningApi: false
    }
  },
  methods: {
    signUp () {
      this.hitSigningApi = true;
      HttpService.post('sign-up', this.formData).then(res => {
        if (res && res.data && res.data.message === 'Registration Successful!') {
          this.$toasted.success('Verification Mail Sent please check MailBox.', {duration: 5000})
        }
        // console.log('res', res)
        this.hitSigningApi = false;
      })
    }
  }
});
