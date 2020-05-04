import Vue from 'vue'
import HttpService from '../../services/http.service'
import { UtilityService } from '../../services/utility.service'

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
        this.allUsers = response.data.data;
      });
    },
    getImageUrl (url) {
      return UtilityService.getImageUrl(url)
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
