import TextBox from '../text-box/text-box.vue'

export default {
  props: ['messageObject'],
  components: {
    'text-box': TextBox
  },
  data() {
    return {
        hitSendMessage: false
    }
  },
  methods: {
    adjustHeight(event) {
      // const count = (event.target.value.match(/\n/g) || []).length;
      // console.log('count');
      // this.$refs.inputTextarea.style.height = 20 + event.target.clientHeight + 'px'
      // if (count > 0) {
      //   this.$refs.inputTextarea.style.height = 20 * count + 'px'
      // }
      // e.target.clientHeight = e.target.scrollHeight;
    },
    hideAttachmentsWindow() {
      this.messageObject.attachments = {};
      this.messageObject.message = '';
      this.$emit('hideWindow');
    }
  }
}
