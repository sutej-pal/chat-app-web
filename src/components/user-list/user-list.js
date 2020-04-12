import Vue from 'vue'
import moment from 'moment'

export default Vue.component('user-list', {
  props: ['users', 'receiver', 'searchText'],
  methods: {
    selectReceiver (receiver) {
      this.$emit('newReceiver', receiver)
    },
    getLastUpdateTime (time) {
      console.log('time', moment(time).format());
      console.log('time', moment(time).diff(moment(), 'days'));
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
