import Vue from 'vue'
import moment from 'moment'
import UtilityService from '../../services/utility.service'

export default Vue.component('user-list', {
  props: ['users', 'receiver', 'searchText'],
  methods: {
    selectReceiver (receiver) {
      this.$emit('newReceiver', receiver)
    },
    getLastUpdateTime (time) {
      // console.log('time', moment(time).format());
      // console.log('time', moment(time).diff(moment(), 'seconds'));
    },
    getImageUrl (url) {
      return UtilityService.getImageUrl(url)
    }
  },
  computed: {
    filteredUsers () {
      return this.users.filter((user) => {
        return user.name.toLowerCase().includes(this.searchText.toLowerCase())
      })
    }
  }
})
