import Vue from 'vue'
import _ from 'underscore'
import io from 'socket.io-client'
import HttpService from '../../services/http.service.ts'
import UtilityService from '../../services/utility.service.ts'
import RecentUserList from '../../components/recent-users-list/recent-users-list.vue'
import AllUserList from '../../components/all-users-list/all-users-list.vue'
import ConversationContainer from '../../components/conversation-container/conversation-container.vue'

export default Vue.extend({
  components: {
    'recent-user-list': RecentUserList,
    'all-user-list': AllUserList,
    'conversation-container': ConversationContainer
  },
  data () {
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
      this.searchText = ''
      this.receiver = receiver
      this.getChatHistory()
      // this.getReceiverStatus();
    },
    async sendMessage (event) {
      if (event && event.shiftKey) {
        // console.log(event.target.clientHeight);
        // event.target.style.height = event.target.clientHeight + 25 + 'px'
        return
      }
      if (this.message === '') {
        return
      }
      const data = {
        senderId: this.sender.id,
        receiverId: this.receiver.id,
        message: this.message.trim(),
        createdAt: ''
      }
      console.log('data', data)
      this.messages.push(data)
      this.scrollConversationToBottom()
      this.socket.emit('SEND_MESSAGE', data)
      await this.setReceiverOnTopOfList()
      this.message = ''
    },
    async setReceiverOnTopOfList () {
      const temp = [...this.users]
      const index = temp.indexOf(this.receiver)
      if (index === -1) {
        await this.getRecentUsers()
        return
      }
      console.log('index', index)
      temp.splice(index, 1)
      temp.splice(0, 0, this.receiver)
      this.users = temp
    },
    async getRecentUsers () {
      HttpService.get('recent-users', true).then(response => {
        console.log('users', response.data)
        this.users = response.data.data
        if (response.data.data.length > 0) {
          this.receiver = response.data.data[0]
          this.getChatHistory()
        }
      })
    },
    getChatHistory () {
      const data = {
        senderId: UtilityService.getUserData().id,
        receiverId: this.receiver.id
      }
      HttpService.post('chat-history-1', data)
        .then(res => {
          this.messages = res.data.data
          console.log('messages', this.messages)
          this.scrollConversationToBottom()
        })
    },
    scrollConversationToBottom () {
      setTimeout(() => {
        const element = document.getElementById('conversation-container')
        element.scrollTop = element.scrollHeight
      }, 50)
    },
    textAreaAdjust (event) {
      event.target.style.height = '1px'
      event.target.style.height = (25 + event.target.scrollHeight) + 'px'
    },
    async logOut () {
      localStorage.clear()
      await this.$router.push({ path: '/' })
    },
    getReceiverStatus () {
      HttpService.get('user-status')
        .then(res => {
          console.log('data', res)
          this.receiver = res.data.data[0]
        })
    },
    getImageUrl (url) {
      return UtilityService.getImageUrl(url)
    },
    updateMessagesArray (serverMessage) {
      const index = this.messages.length - 1
      if (serverMessage.senderId === this.sender.id) {
        if (index > -1) {
          this.messages.splice(index, 1)
        }
        this.messages.push(serverMessage)
      } else {
        this.messages.push(serverMessage)
      }
      this.scrollConversationToBottom()
    }
  },
  async mounted () {
    this.sender = UtilityService.getUserData()
    await this.getRecentUsers()
    this.socket.emit('update-user-status', this.sender)
    this.socket.on('MESSAGE', (message) => {
      this.updateMessagesArray(message)
    })
    this.socket.on('offline-user', (offlineUserData) => {
      console.log('offline-user', offlineUserData)
      _.each(this.users, user => {
        if (offlineUserData._id === user.id) {
          user.isActive = offlineUserData.isActive
        }
      })
    })
    this.socket.on('online-user', (onlineUserData) => {
      console.log('online-user', onlineUserData)
      _.each(this.users, user => {
        if (onlineUserData.id === user.id) {
          user.isActive = true
        }
      })
    })
  }
})
