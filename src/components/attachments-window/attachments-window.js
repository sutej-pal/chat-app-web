import TextBox from '@/components/text-box/text-box.vue'

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
    hideAttachmentsWindow() {
      this.messageObject.attachments = {};
      this.messageObject.message = '';
      this.$emit('hideWindow');
    }
  }
}
