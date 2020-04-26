import moment from 'moment'
import UtilityService from '../../services/utility.service'

export default {
  name: 'conversation-container',
  props: ['conversation', 'receiver'],
  data () {
    return {
      scrollHeight: ''
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
      return UtilityService.getImageUrl(url);
    }
  },
  mounted () {
    this.scrollToBottom()
  },
  updated () {
    this.scrollToBottom()
  }
}
