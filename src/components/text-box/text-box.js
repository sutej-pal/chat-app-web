export default {
  name: 'text-box',
  methods: {
    sendMessage (event) {
      const msgInput = this.$refs.msg
      if (event && event.shiftKey) {
        return
      }
      if (event && event.key === 'Enter' && event.target.innerText === '') {
        event.preventDefault();
        return
      }
      const regex = new RegExp(/^(\n*)$/g);
      if (regex.test(msgInput.innerText)) {
        while (msgInput.firstChild) {
          msgInput.removeChild(msgInput.lastChild)
        }
        return
      }
      console.log('innerText', msgInput.innerText)
      if (msgInput.innerText !== '') {
        this.$emit('sendMessage', msgInput.innerText)
        msgInput.innerText = '';
        event.preventDefault();
      }
    }
  }
}
