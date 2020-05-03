import _ from 'underscore'
import UtilityService from '../../services/utility.service'
import HttpService from '../../services/http.service'
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'attachments-viewer',
  props: ['messagesList', 'messageId', 'chatRoomId'],
  components: {
    Carousel,
    Slide
  },
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
                this.$refs.mediaList.scrollLeft = 100 * index;
              });
            }
          })
        })
    },
    setActiveMedia (index) {
      this.activeIndex = index
      this.$refs.mediaList.scrollLeft = 100 * index;
    },
    getImageUrl (url) {
      return UtilityService.getImageUrl(url)
    }
  },
  mounted () {
    this.getMedia()
  }
}
