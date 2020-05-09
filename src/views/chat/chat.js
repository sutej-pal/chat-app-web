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
      recentContacts: [],
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
      isAttachmentsViewerVisible: false,
      isChatHistoryFetched: false
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
      this.scrollToBottom()
      this.messageObject = {
        message: '',
        attachments: {
          type: '',
          file: ''
        }
      }
      this.isAttachmentUploadVisible = false
    },
    async setReceiverOnTopOfList (userId) {
      const temp = [...this.recentContacts]
      const index = temp.findIndex(i => i.id === userId)
      if (index === -1) {
        const user = await UtilityService.getUser(userId)
        temp.splice(0, 0, user)
      } else {
        temp.splice(index, 1)
        temp.splice(0, 0, this.recentContacts[index])
      }
      this.recentContacts = temp
    },
    async getRecentUsers () {
      HttpService.get('recent-users', true).then(response => {
        this.recentContacts = response.data.data
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
          this.isChatHistoryFetched = true
          if (res.data.data.length === 0) {
            this.chatRoom = new ChatRoom()
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
    async updateRecentContacts (serverMessage) {
      if (serverMessage.senderId === this.sender.id) {
        if (this.recentContacts.length === 0) {
          await this.getRecentUsers()
        } else {
          _.each(this.recentContacts, async (contact, index) => {
            if (serverMessage.senderId === this.sender.id) {
              await this.setReceiverOnTopOfList(serverMessage.receiverId)
              this.chatRoom.messages.splice(this.chatRoom.messages.length - 1, 1)
              this.chatRoom.messages.push(serverMessage)
              return
            }
            if (index === this.recentContacts.length - 1) {
              await this.setReceiverOnTopOfList(serverMessage.receiverId)
            }
          })
        }
      } else {
        if (this.recentContacts.length === 0) {
          await this.setReceiverOnTopOfList(serverMessage.senderId)
        } else {
          _.each(this.recentContacts, async (contact, index) => {
            if (contact.id === serverMessage.senderId) {
              await this.setReceiverOnTopOfList(serverMessage.senderId, '')
              if (this.receiver.id === serverMessage.senderId) {
                this.chatRoom.messages.push(serverMessage)
              }
              return
            }
            if (index === this.recentContacts.length - 1) {
              await this.setReceiverOnTopOfList(serverMessage.senderId)
            }
          })
        }
      }
    },
    async addAttachment (event) {
      const type = await UtilityService.getAttachmentFileType(event)
      if (type) {
        const file = event.target.files[0]
        this.isAttachmentUploadVisible = true
        this.messageObject.attachments = {
          type,
          file,
          objectUrl: URL.createObjectURL(file)
        }
      }
    },
    scrollToBottom () {
      UtilityService.scrollToBottomConversation('conversation-container')
    }
  },
  async mounted () {
    this.sender = UtilityService.getUserData()
    await this.getRecentUsers()
    socketConn.emit('update-user-status', this.sender)
    socketConn.on('message', (message) => {
      this.updateRecentContacts(message)
      setTimeout(() => {
        if (message.receiverId === this.sender.id && message.senderId === this.receiver.id) {
          const element = document.getElementById('conversation-container')
          if ((element.scrollTop + element.clientHeight) === element.scrollHeight) {
            const data = {
              chatRoomId: this.chatRoom._id,
              message: message
            }
            socketConn.emit('messages-read', data)
          }
        }
      }, 300)
    })
    socketConn.on('offline-user', (offlineUserData) => {
      _.each(this.recentContacts, user => {
        if (offlineUserData._id === user.id) {
          user.isActive = offlineUserData.isActive
        }
      })
    })
    socketConn.on('online-user', (onlineUserData) => {
      _.each(this.recentContacts, user => {
        if (onlineUserData.id === user.id) {
          user.isActive = true
        }
      })
    })
    socketConn.on('message-seen', (message) => {
      if (message.senderId === this.sender.id && message.receiverId === this.receiver.id) {
        this.chatRoom.messages = _.map(this.chatRoom.messages, (msg) => {
          msg.seen = true
          return msg
        })
      }
      if (message.receiverId === this.sender.id && message.senderId === this.receiver.id) {
        this.chatRoom.messages = _.map(this.chatRoom.messages, (msg) => {
          msg.seen = true
          return msg
        })
      }
    });
  }
})
