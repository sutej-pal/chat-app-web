<template>
  <div class="main-container" v-if="mediaList.length > 0">
    <button class="close-button absolute fa fa-times rounded-full" @click="$emit('toggleVisibility')"></button>
    <div class="media-viewer">
      <div class="media-preview h-full py-5">
        <img class="h-full w-auto m-auto" :src="getImageUrl(activeMedia.attachments.file)" alt="">
      </div>
    </div>
    <div class="border-gray-800 border-t flex flex-row media-list overflow-auto pt-2">
      <div class="media-thumbnail h-full p-2 flex-shrink-0 whitespace-normal" v-for="(x, index) in mediaList"
           :key="index">
        <img class="h-full w-auto m-auto" @click="activeMedia = x" :src="getImageUrl(x.attachments.file)" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'underscore'
  import UtilityService from '../../services/utility.service'
  import HttpService from '../../services/http.service'

  export default {
    name: 'attachments-viewer',
    props: ['messagesList', 'messageId', 'chatRoomId'],
    data () {
      return {
        mediaList: [],
        activeMedia: ''
      }
    },
    methods: {
      getMedia () {
        HttpService.get('get-chat-room-media/' + this.chatRoomId)
          .then((res) => {
            this.mediaList = res.data.data
            this.setActiveMedia();
          })
      },
      setActiveMedia () {
        _.each(this.mediaList, media => {
          if (media._id === this.messageId) {
            this.activeMedia = media
          }
        })
      },
      getImageUrl (url) {
        return UtilityService.getImageUrl(url)
      }
    },
    mounted () {
      this.getMedia()
    }
  }
</script>

<style scoped lang="scss">
  @import "src/assets/scss/common";

  .main-container {
    .close-button {
      @include close-button;
    }

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(162, 162, 162, 0.77);
    backdrop-filter: blur(5px);
    z-index: 1001;

    .media-viewer {
      height: 70%;

      .media-preview {
      }

    }

    .media-list {
      height: 30%;

      .media-thumbnail {
        img {
          cursor: pointer;
        }
      }
    }
  }
</style>
