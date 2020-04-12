import Vue from 'vue'
import _ from 'underscore'
import io from 'socket.io-client'
import moment from 'moment'
import HttpService from '../../services/http.service.ts'
import UtilityService from '../../services/utility.service.ts'
import UserList from '../../components/user-list/user-list.vue'

export default Vue.extend({
  components: {
    'user-list': UserList
  },
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
      // this.getReceiverStatus();
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
      this.setReceiverOnTopOfList();
      this.message = ''
    },
    setReceiverOnTopOfList() {
      const temp = [...this.users];
      const index = temp.indexOf(this.receiver);
      console.log('index', index);
      temp.splice(index, 1);
      temp.splice(0, 0, this.receiver);
      this.users = temp;
    },
    async getUsers() {
      HttpService.get('recent-users', true).then(response => {
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
      HttpService.post('chat-history-1', data)
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
    },
    async logOut() {
      localStorage.clear();
      await this.$router.push({path: '/'});
    },
    getReceiverStatus () {
      HttpService.get('user-status')
        .then(res => {
          console.log('data', res);
          this.receiver = res.data.data[0];
        })
    }
  },
  async mounted() {
    this.sender = UtilityService.getUserData();
    await this.getUsers();
    this.socket.emit('update-user-status', this.sender)
    this.socket.on('MESSAGE', () => {
      this.getChatHistory();
    });
    this.socket.on('offline-user', (offlineUserData) => {
      console.log('offline-user', offlineUserData);
      _.each(this.users, user => {
        if (offlineUserData._id === user.id) {
          user.isActive = offlineUserData.isActive
        }
      })
    });
    this.socket.on('online-user', (onlineUserData) => {
      console.log('online-user', onlineUserData);
      _.each(this.users, user => {
        if (onlineUserData.id === user.id) {
          user.isActive = true
        }
      })
    });
  }
})
