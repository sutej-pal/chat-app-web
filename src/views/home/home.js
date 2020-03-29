import Vue from 'vue'
import _ from 'underscore'
import io from 'socket.io-client'

export default Vue.extend({
  data() {
    return {
      contacts: [
        {
          id: 1,
          name: 'Sonu'
        },
        {
          id: 2,
          name: 'Shubham'
        },
        {
          id: 3,
          name: 'Abhay'
        },
        {
          id: 4,
          name: 'Tushar'
        },
        {
          id: 5,
          name: 'Vikrant'
        }
      ],
      user: '',
      message: '',
      messages: [],
      socket: io('localhost:3000')
    }
  },
  methods: {
    selectContact: function (cardId) {
      _.each(this.$refs, (card) => {
        card[0].classList.remove('active');
      });
      const card = this.$refs['card' + cardId];
      card[0].classList.add('active');
    }
  },
  mounted() {
    this.socket.on('MESSAGE', (data) => {
      this.messages = [...this.messages, data]
      // you can also do this.messages.push(data)
    })
    console.log('hi')
  }
})
