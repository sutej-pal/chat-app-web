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
      socket: io(process.env.VUE_APP_base_url),
      receiver: {},
      sender: {}
    }
  },
  methods: {
    selectReceiver (receiver) {
      this.receiver = receiver
      this.getChatHistory();
    },
    sendMessage(event) {
      if (event && event.shiftKey) {
        // console.log(event.target.clientHeight);
        // event.target.style.height = event.target.clientHeight + 25 + 'px'
        return
      }
      const data = {
        senderId: this.sender.id,
        receiverId: this.receiver.id,
        message: this.message.trim()
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
      }, 50);
    },
    getMessageTime(creationTime) {
      return moment(creationTime).format('hh:mm a')
    },
    textAreaAdjust(event) {
      event.target.style.height = "1px";
      event.target.style.height = (25 + event.target.scrollHeight) + "px";
    }
  },
  computed: {
    filteredUsers () {
      return this.users.filter((user) => {
        return user.name.toLowerCase().includes(this.searchText.toLowerCase())
      })
    }
  },
  async mounted() {
    this.sender = UtilityService.getUserData();
    await this.getUsers();
    this.socket.on('MESSAGE', () => {
      this.getChatHistory();
    });
  }
})
