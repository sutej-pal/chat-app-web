import moment from 'moment'
import { UtilityService } from '../../services/utility.service'
import { EventBus, Events } from '../../utils/eventBus'

export default {
  name: 'conversation-container',
  props: ['conversation', 'receiver', 'chatRoomId'],
  data () {
    return {
      scrollHeight: '',
      isScrollDownBtnVisible: false
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
    },
    showAttachments (messageId) {
      const object = {
        messageId,
        chatRoomId: this.chatRoomId
      }
      EventBus.$emit(Events.enableAttachmentsViewer, object);
    }
  },
  mounted () {
    this.scrollToBottom()
  },
  updated () {
    this.scrollToBottom()
  },
  watch: {
    isScrollDownBtnVisible (newValue) {
      this.$emit('toggleScrollBottomBtn', newValue)
    }
  }
}
