import Vue from 'vue'
import _ from 'underscore'
import HttpService from '../../services/http.service.ts'
import { UtilityService, ChatRoom } from '../../services/utility.service.ts'
import RecentUserList from '../../components/recent-users-list/recent-users-list.vue'
import AllUserList from '../../components/all-users-list/all-users-list.vue'
import ConversationContainer from '../../components/conversation-container/conversation-container.vue'
import AttachmentsWindow from '../../components/attachments-window/attachments-window.vue'
import AttachmentsViewer from '../../components/attachments-viewer/attachments-viewer.vue'
import TextBox from '../../components/text-box/text-box.vue'
import socket from '../../utils/socket'

const socketConn = socket

export default Vue.extend({
  components: {
    'recent-user-list': RecentUserList,
    'all-user-list': AllUserList,
    'conversation-container': ConversationContainer,
    'attachments-viewer': AttachmentsViewer,
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
      chatRoom: {
        messages: []
      },
      receiver: {},
      sender: {},
      isAttachmentUploadVisible: false,
      isScrollDownBtnVisible: false,
      isAttachmentsViewerVisible: false
    }
  },
  methods: {
    selectReceiver (receiver) {
      if (this.receiver.id === receiver.id) {
        return
      }
      this.searchText = ''
      this.receiver = receiver
      this.getChatHistory()
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
          type: this.messageObject.attachments.type,
          file: this.messageObject.attachments.file,
          fileName: this.messageObject.attachments.file.name
        }
      }
      this.chatRoom.messages.push(data)
      socketConn.emit('send-message', data)
      await this.setReceiverOnTopOfList()
      this.messageObject = {
        message: '',
        attachments: {
          type: '',
          file: ''
        }
      }
      this.isAttachmentUploadVisible = false
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
          if (res.data.data.length === 0) {
            this.chatRoom = new ChatRoom();
          } else {
            this.chatRoom = res.data.data
          }
        })
    },
    async logOut () {
      localStorage.clear()
      await this.$router.push({ path: '/' })
    },
    getImageUrl (url) {
      return UtilityService.getImageUrl(url)
    },
    async updateMessagesArray (serverMessage) {
      const index = this.chatRoom.messages.length - 1
      if (serverMessage.senderId === this.sender.id) {
        if (index > -1) {
          this.chatRoom.messages.splice(index, 1)
        }
        this.chatRoom.messages.push(serverMessage)
      } else if (serverMessage.senderId === this.receiver.id) {
        this.chatRoom.messages.push(serverMessage)
      }
      await this.setReceiverOnTopOfList();
    },
    async addAttachment (event) {
      const type = await UtilityService.getAttachmentFileType(event);
      if (type) {
        const file = event.target.files[0]
        this.isAttachmentUploadVisible = true
        this.messageObject.attachments = {
          type, file, objectUrl: URL.createObjectURL(file)
        }
      }
    },
    scrollToBottom () {
      document.querySelectorAll('.conversation-body')[0]
        .lastElementChild.scrollIntoView({ behavior: 'smooth' })
    }
  },
  async mounted () {
    this.sender = UtilityService.getUserData()
    await this.getRecentUsers()
    socketConn.emit('update-user-status', this.sender)
    socketConn.on('message', (message) => {
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
