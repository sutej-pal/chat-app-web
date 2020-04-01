import Vue from 'vue'
import _ from 'underscore'
import io from 'socket.io-client'
import moment from 'moment'
import HttpService from '../../services/http.service.ts'
import UtilityService from '../../services/utility.service.ts'

export default Vue.extend({
  data() {
    return {
      searchText: '',
      users: [],
      message: '',
      messages: [],
      socket: io('localhost:3000'),
      receiver: {},
      sender: {}
    }
  },
  methods: {
    selectReceiver (receiver) {
      this.receiver = receiver
      this.getChatHistory();
    },
    sendMessage() {
      const data = {
        senderId: this.sender.id,
        receiverId: this.receiver.id,
        message: this.message
      }
      console.log('data', data);
      this.socket.emit('SEND_MESSAGE', data)
      this.message = ''
    },
    async getUsers() {
      HttpService.get('users-list', true).then(response => {
        console.log('users', response.data)
        this.users = response.data.data;
        setTimeout(() => {
          this.receiver = response.data.data[0];
          this.getChatHistory();
        }, 500)
      });
    },
    getChatHistory () {
      const data = {
        senderId: UtilityService.getUserData().id,
        receiverId: this.receiver.id
      };
      HttpService.post('chat-history', data)
        .then(res => {
          this.messages = res.data.data;
          console.log('messages', this.messages);
          this.scrollConversationToBottom();
        })
    },
    scrollConversationToBottom() {
      setTimeout(() => {
        const element = this.$refs['conversation-container']
        element.scrollTop = element.scrollHeight;
      }, 500);
    },
    getMessageTime(creationTime) {
      return moment(creationTime).format('hh:mm a')
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
