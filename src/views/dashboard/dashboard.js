import Vue from 'vue'
import { EventBus, Events } from '../../utils/eventBus'
import AttachmentsViewer from '../../components/attachments-viewer/attachments-viewer.vue'

export default Vue.extend({
  components: {
    'attachments-viewer': AttachmentsViewer
  },
  data () {
    return {
      enableAttachmentsViewer: false,
      propsForAttachmentsViewer: {}
    }
  },
  methods: {},
  mounted () {
    EventBus.$on(Events.enableAttachmentsViewer, (data) => {
      this.enableAttachmentsViewer = true;
      this.propsForAttachmentsViewer.messageId = data.messageId;
      this.propsForAttachmentsViewer.chatRoomId = data.chatRoomId
    })
  }
})
