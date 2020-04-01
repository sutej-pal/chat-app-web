import Vue from 'vue'
import _ from 'underscore'
import io from 'socket.io-client'
import HttpService from '../../services/http.service.ts'
import UtilityService from '../../services/utility.service.ts'

export default Vue.extend({
  data() {
    return {
      users: [],
      messages: [],
      socket: io('localhost:3000'),
      activeUser: {
        id: '5e8205a393e6402bd0b3d2cc'
      },
      sender: {}
    }
  },
  methods: {
    selectReceiver (contact) {
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
        senderId: this.sender.id,
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
          // console.log('cards', this.$refs['contact-list'].children[0].classList.add('active'))
          // this.activeUser = response.data.data[0];
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
    this.sender = UtilityService.getUserData();
    await this.getUsers();
    this.socket.on('MESSAGE', (data) => {
      this.getChatHistory();
    });
  }
})
