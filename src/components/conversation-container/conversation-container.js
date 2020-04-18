import moment from 'moment'

export default {
  name: 'conversation-container',
  props: ['conversation', 'receiver'],
  methods: {
    checkCreatedAt(date) {
      console.log('date', date, moment(date).isValid());
      return moment(date).isValid();
    },
    getMessageTime(creationTime) {
     const time = moment(creationTime).format('hh:mm a')
      if (time === 'Invalid date') {
        return moment().format('hh:mm a')
      } else {
        return time
      }
    },
    scrollConversationToBottom() {
      setTimeout(() => {
        const element = this.$refs['conversation-container']
        element.scrollTop = element.scrollHeight;
      }, 50);
    }
  }
}
