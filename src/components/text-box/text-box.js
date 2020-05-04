import emojis from 'node-emoji'

export default {
  props: ['hitSendMessage'],
  name: 'text-box',
  data() {
    return {
      emojis: emojis.emoji,
      isEmojisCardVisible: false
    }
  },
  methods: {
    sendMessage (event) {
      const msgInput = this.$refs.msg
      if (event === undefined) {
        this.$emit('sendMessage', msgInput.innerText)
        msgInput.innerText = ''
        return
      }
      if (event && event.shiftKey) {
        return
      }
      if (event && event.key === 'Enter' && event.target.innerText === '') {
        event.preventDefault()
        return
      }
      const regex = new RegExp(/^(\n*)$/g)
      if (regex.test(msgInput.innerText)) {
        while (msgInput.firstChild) {
          msgInput.removeChild(msgInput.lastChild)
        }
        return
      }
      if (msgInput.innerText !== '') {
        this.$emit('sendMessage', msgInput.innerText)
        msgInput.innerText = ''
        event.preventDefault()
      }
    },
    handleClickEvents(event) {
      if (event.target.parentNode === this.$refs['emoji-toggle'] || event.target === this.$refs['emoji-toggle']) {
        this.isEmojisCardVisible = true
        return
      }
      this.isEmojisCardVisible = event.target.tagName === 'SPAN' && event.target.parentNode.className.includes('emojis-card');
    }
  },
  mounted () {
    this.$refs.msg.focus();
    window.addEventListener('click', this.handleClickEvents);
  },
  watch: {
    hitSendMessage () {
      this.sendMessage()
    }
  },
  destroy () {
    window.removeEventListener('click', this.handleClickEvents);
  }
}
