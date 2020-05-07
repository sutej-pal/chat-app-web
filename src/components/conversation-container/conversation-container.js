import moment from 'moment'
import { UtilityService } from '../../services/utility.service'
import { EventBus, Events } from '../../utils/eventBus'

export default {
  name: 'conversation-container',
  props: ['conversation', 'receiver', 'chatRoomId'],
  data () {
    return {
      scrollHeight: '',
      isScrollDownBtnVisible: false,
      newMessages: false
    }
  },
  methods: {
    checkCreatedAt (date) {
      return moment(date).isValid()
    },
    getMessageTime (creationTime) {
      const time = moment(creationTime).format('hh:mm a')
      if (time === 'Invalid date') {
        return moment().format('hh:mm a')
      } else {
        return time
      }
    },
    scrollToBottom () {
      const element = document.getElementById('conversation-container')
      this.scrollHeight = element.scrollHeight
      element.scrollTop = element.scrollHeight
    },
    getMediaUrl (url) {
      return UtilityService.getImageUrl(url)
    },
    handleScroll (event) {
      this.isScrollDownBtnVisible = event.target.scrollHeight - (event.target.scrollTop + event.target.clientHeight) > 200
      if (this.newMessages) {
        this.newMessages = event.target.scrollHeight === (event.target.scrollTop + event.target.clientHeight)
      }
    },
    showAttachments (messageId) {
      const object = {
        messageId,
        chatRoomId: this.chatRoomId
      }
      EventBus.$emit(Events.enableAttachmentsViewer, object)
    },
    showNewMessageIcon() {
      const ct = document.getElementById('conversation-container')
      if ((ct.scrollHeight - (ct.scrollTop + ct.clientHeight)) > 200) {
        this.newMessages = true
      } else {
        this.scrollToBottom()
      }
    }
  },
  mounted () {
    console.log('mounted')
    this.scrollToBottom()
  },
  updated () {
    console.log('updated')
    const ct = document.getElementById('conversation-container')
    if ((ct.scrollHeight - (ct.scrollTop + ct.clientHeight)) > 200) {
      this.newMessages = true
    } else {
      this.scrollToBottom()
    }
  },
  watch: {
    // conversation (newValue, oldValue) {
    //   console.log('newValue', this.conversation);
    //   console.log('oldValue', oldValue);
    //   this.showNewMessageIcon()
    // },
    isScrollDownBtnVisible (newValue) {
      this.$emit('toggleScrollBottomBtn', newValue)
    }
  }
}
