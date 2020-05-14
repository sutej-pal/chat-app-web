import { EventBus, Events } from '../../utils/eventBus'
import AttachmentsViewer from '@/components/attachments-viewer/attachments-viewer.vue'

export default {
  components: {
    'attachments-viewer': AttachmentsViewer
  },
  data () {
    return {
      isAttachmentsViewerVisible: false,
      propsForAttachmentsViewer: {}
    }
  },
  methods: {},
  mounted () {
    EventBus.$on(Events.enableAttachmentsViewer, (data) => {
      this.isAttachmentsViewerVisible = true;
      this.propsForAttachmentsViewer.messageId = data.messageId;
      this.propsForAttachmentsViewer.chatRoomId = data.chatRoomId
    })
  }
};
