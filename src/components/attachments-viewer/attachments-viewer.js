import _ from 'underscore'
import UtilityService from '../../services/utility.service'
import HttpService from '../../services/http.service'

export default {
  name: 'attachments-viewer',
  props: ['messagesList', 'messageId', 'chatRoomId'],
  data () {
    return {
      mediaList: [],
      activeMedia: '',
      activeIndex: ''
    }
  },
  methods: {
    getMedia () {
      HttpService.get('get-chat-room-media/' + this.chatRoomId)
        .then((res) => {
          this.mediaList = res.data.data
          _.each(this.mediaList, (media, index) => {
            if (media._id === this.messageId) {
              this.activeIndex = index
              this.activeMedia = media
              this.$nextTick(() => {
                this.$refs.mediaList.scrollLeft = 100 * index
              })
            }
          })
        })
    },
    setActiveMedia (index) {
      if (index > this.mediaList.length - 1 || index < 0) {
        return
      }
      this.activeIndex = index
      this.$refs.mediaList.scrollLeft = 100 * index
    },
    getImageUrl (url) {
      return UtilityService.getImageUrl(url)
    },
    handleKeypressEvents (e) {
      console.log('handleKeypressEvents', e);
      if (e.keyCode === 27) {
        this.$emit('toggleVisibility');
      }
      if (e.keyCode === 37) {
        this.setActiveMedia(this.activeIndex - 1)
      }
      if (e.keyCode === 39) {
        this.setActiveMedia(this.activeIndex + 1)
      }
    }
  },
  mounted () {
    this.getMedia()
    window.addEventListener('keydown', this.handleKeypressEvents)
  },
  destroyed () {
    window.removeEventListener('keydown', this.handleKeypressEvents)
    console.log('destroyed')
  }
}
