import moment from 'moment'
import UtilityService from '../../services/utility.service'

export default {
  name: 'conversation-container',
  props: ['conversation', 'receiver'],
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
    getImageUrl (url) {
      return UtilityService.getImageUrl(url)
    },
    handleScroll (event) {
      this.isScrollDownBtnVisible = event.target.scrollHeight - (event.target.scrollTop + event.target.clientHeight) > 200
    },
    showAttachments (messageId) {
      this.$emit('showAttachmentsViewer', messageId);
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
