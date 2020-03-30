import Vue from 'vue'
import _ from 'underscore'
import io from 'socket.io-client'
import HttpService from '../../services/http.service.ts'

export default Vue.extend({
  data() {
    return {
      users: [],
      messages: [],
      socket: io('localhost:3000'),
      activeUser: {}
    }
  },
  methods: {
    selectContact (contact) {
      console.log(this.$refs['contact-list'])
      _.each(this.$refs['contact-list'].children, (card) => {
        card.classList.remove('active');
      });
      this.$refs['card' + contact.id][0].classList.add('active');
      this.activeUser = contact
    },
    sendMessage() {
      console.log(this.activeUser);
      console.log(this.$refs.message);
      const data = {
        user: this.activeUser.id,
        message: this.$refs.message.innerHTML
      }
      this.socket.emit('SEND_MESSAGE', data)
      // this.$refs.message.innerHTML = ''
    },
    async getUsers() {
      HttpService.get('users-list', true).then(response => {
        console.log('users', response.data)
        this.users = response.data.data;
        setTimeout(() => {
          console.log('cards', this.$refs['contact-list'].children[0].classList.add('active'))
        }, 500)
      });
    }
  },
  async mounted() {
    await this.getUsers();
    this.socket.on('MESSAGE', (data) => {
      this.messages = [...this.messages, data]
      // you can also do this.messages.push(data)
      console.log('hi', this.messages);
    });
  }
})
