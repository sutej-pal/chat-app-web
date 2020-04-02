import Vue from 'vue'
import io from 'socket.io-client'

export default Vue.extend({
  data () {
    return {
      leftVideo: '',
      stream: '',
      socket: io(process.env.VUE_APP_base_url)
    }
  },
  methods: {
    maybeCreateStream() {
      if (this.stream) {
        return;
      }
      if (this.leftVideo.captureStream) {
        this.stream = this.leftVideo.captureStream();
        console.log('Captured stream from leftVideo with captureStream',
          this.stream);
        this.call();
      } else if (this.leftVideo.mozCaptureStream) {
        this.stream = this.leftVideo.mozCaptureStream();
        console.log('Captured stream from leftVideo with mozCaptureStream()',
          this.stream);
        this.call();
      } else {
        console.log('captureStream() not supported');
      }
    },
    call() {
      console.log('call()', this.stream)
      this.socket.emit('video_chat', {hi: this.stream})
    }
  },
  mounted () {
    this.leftVideo = document.getElementById('leftVideo');
    this.leftVideo.oncanplay = this.maybeCreateStream;
    if (this.leftVideo.readyState >= 3) { // HAVE_FUTURE_DATA
      // Video is already ready to play, call maybeCreateStream in case oncanplay
      // fired before we registered the event handler.
      this.maybeCreateStream();
    }
    this.leftVideo.play();
  }
});
