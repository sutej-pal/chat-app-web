import Vue from 'vue'
import HttpService from '../../services/http.service'

export default Vue.component('all-users-list', {
  props: ['searchText'],
  data() {
    return {
      allUsers: []
    }
  },
  methods: {
    selectReceiver (receiver) {
      this.$emit('newReceiver', receiver)
    },
    async getAllUsers() {
      HttpService.get('all-users', true).then(response => {
        console.log('users', response.data)
        this.allUsers = response.data.data;
      });
    }
  },
  computed: {
    filteredUsers () {
      return this.allUsers.filter((user) => {
        return user.name.toLowerCase().includes(this.searchText.toLowerCase())
      })
    }
  },
  async mounted () {
    await this.getAllUsers();
  }
});
