import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({
  methods: {
    ...mapActions(['setUser']),
    logout () {
      this.setUser().then(() => {
        this.$router.push('/user/login')
      })
    }
  },
  mounted () {
    this.logout();
  }
})
