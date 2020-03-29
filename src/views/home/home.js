import Vue from 'vue'
import _ from 'underscore'

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
      ]
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
    console.log('hi')
  }
})
