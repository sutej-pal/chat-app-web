import Vue from 'vue'
import _ from 'underscore'
import HttpService from '../../services/http.service.ts'
import UtilityService from '../../services/utility.service.ts'
import RecentUserList from '../../components/recent-users-list/recent-users-list.vue'
import AllUserList from '../../components/all-users-list/all-users-list.vue'
import ConversationContainer from '../../components/conversation-container/conversation-container.vue'
import AttachmentsWindow from '../../components/attachments-window/attachments-window.vue'
import TextBox from '../../components/text-box/text-box.vue'
import socket from '../../utils/socket'
import { EventBus, Events } from '../../utils/eventBus'

const socketConn = socket

export default Vue.extend({
  components: {
    'recent-user-list': RecentUserList,
    'all-user-list': AllUserList,
    'conversation-container': ConversationContainer,
    'attachments-window': AttachmentsWindow,
    'text-box': TextBox
  },
  data () {
    return {
      searchText: '',
      users: [],
      messageObject: {
        message: '',
        attachments: {
          type: '',
          file: ''
        }
      },
      messagesList: [],
      receiver: {},
      sender: {},
      isAttachmentUploadVisible: false,
      isScrollDownBtnVisible: false
    }
  },
  methods: {
    selectReceiver (receiver) {
      if (this.receiver.id === receiver.id) {
        return
      }
      this.searchText = '';
      this.receiver = receiver;
      this.getChatHistory();
    },
    async sendMessage (msg) {
      this.messageObject.message = msg
      if (this.messageObject.message === '' && !(this.messageObject.attachments && this.messageObject.attachments.file)) {
        return
      }
      const data = {
        senderId: this.sender.id,
        receiverId: this.receiver.id,
        message: this.messageObject.message.trim(),
        createdAt: ''
      }
      if (this.messageObject.attachments && this.messageObject.attachments.file) {
        data.attachments = {
          type: 'image',
          file: this.messageObject.attachments.file,
          fileName: this.messageObject.attachments.file.name
        }
      }
      this.messagesList.push(data);
      socketConn.emit('send-message', data);
      await this.setReceiverOnTopOfList();
      this.messageObject = {
        message: '',
        attachments: {
          type: '',
          file: ''
        }
      }
      this.isAttachmentUploadVisible = false;
    },
    async setReceiverOnTopOfList () {
      const temp = [...this.users]
      const index = temp.indexOf(this.receiver)
      if (index === -1) {
        await this.getRecentUsers()
        return
      }
      temp.splice(index, 1)
      temp.splice(0, 0, this.receiver)
      this.users = temp
    },
    async getRecentUsers () {
      HttpService.get('recent-users', true).then(response => {
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
          this.messagesList = res.data.data;
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
          this.receiver = res.data.data[0]
        })
    },
    getImageUrl (url) {
      return UtilityService.getImageUrl(url)
    },
    updateMessagesArray (serverMessage) {
      const index = this.messagesList.length - 1
      if (serverMessage.senderId === this.sender.id) {
        if (index > -1) {
          this.messagesList.splice(index, 1)
        }
        this.messagesList.push(serverMessage)
      } else if (serverMessage.senderId === this.receiver.id) {
        this.messagesList.push(serverMessage)
      }
    },
    async addAttachment (event) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0]
        // const object = await UtilityService.onImageUpload(event)
        this.isAttachmentUploadVisible = true;
        this.messageObject.attachments = {
          type: 'image',
          file: file,
          objectUrl: URL.createObjectURL(file)
        }
      }
    },
    scrollToBottom() {
      document.querySelectorAll('.conversation-body')[0]
        .lastElementChild.scrollIntoView({behavior: 'smooth'})
    }
  },
  async mounted () {
    this.sender = UtilityService.getUserData()
    await this.getRecentUsers()
    socketConn.emit('update-user-status', this.sender)
    socketConn.on('message', (message) => {
      console.log('message', message);
      this.updateMessagesArray(message)
    })
    socketConn.on('offline-user', (offlineUserData) => {
      _.each(this.users, user => {
        if (offlineUserData._id === user.id) {
          user.isActive = offlineUserData.isActive
        }
      })
    })
    socketConn.on('online-user', (onlineUserData) => {
      _.each(this.users, user => {
        if (onlineUserData.id === user.id) {
          user.isActive = true
        }
      })
    })
  }
})
