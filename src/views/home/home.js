import Vue from 'vue'
import _ from 'underscore'
import io from 'socket.io-client'
import HttpService from '../../services/http.service.ts'
import { UtilityService } from '../../services/utility.service.ts'

export default Vue.extend({
  data() {
    return {
      users: [],
      messages: [],
      socket: io(process.env.VUE_APP_base_url),
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
      this.getChatHistory();
    },
    sendMessage() {
      console.log(this.activeUser);
      console.log(this.$refs.message);
      const data = {
        senderId: UtilityService.getUserData().id,
        receiverId: this.activeUser.id,
        message: this.$refs.message.innerHTML
      }
      this.socket.emit('SEND_MESSAGE', data)
      this.$refs.message.innerHTML = ''
    },
    async getUsers() {
      HttpService.get('users-list', true).then(response => {
        console.log('users', response.data)
        this.users = response.data.data;
        setTimeout(() => {
          console.log('cards', this.$refs['contact-list'].children[0].classList.add('active'))
          this.activeUser = response.data.data[0];
          this.getChatHistory();
        }, 500)
      });
    },
    getChatHistory () {
      const data = {
        senderId: UtilityService.getUserData().id,
        receiverId: this.activeUser.id
      };
      HttpService.post('chat-history', data)
        .then(res => {
          this.messages = res.data.data;
          console.log('messages', this.messages);
        })
    }
  },
  async mounted() {
    await this.getUsers();
    this.socket.on('MESSAGE', (data) => {
      this.getChatHistory();
    });
    console.log('VUE_APP_ENV_VARIABLE', process.env.VUE_APP_ENV_VARIABLE);
    console.log('VUE_APP_ENV_VARIABLE', process.env.VUE_APP_base_url);
  }
})
