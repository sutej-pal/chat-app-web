<template>
  <div class="main-container">
    <button class="close-button absolute fa fa-times rounded-full" @click="$emit('toggleVisibility')"></button>
    <div class="media-viewer">
      <div class="media-preview h-full py-5">
        <img class="h-full w-auto m-auto" :src="activeMedia" alt="">
      </div>
    </div>
    <div class="border-gray-800 border-t flex flex-row media-list overflow-auto pt-2">
      <div class="media-thumbnail h-full p-2 flex-shrink-0 whitespace-normal" v-for="(x, index) in media" :key="index">
        <img class="h-full w-auto m-auto" @click="activeMedia = x" :src="x" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'underscore'
  import UtilityService from '../../services/utility.service'

  export default {
    name: 'attachments-viewer',
    props: ['messagesList'],
    data () {
      return {
        media: [],
        activeMedia: ''
      }
    },
    methods: {
      getMedia () {
        _.each(this.messagesList, (message) => {
          console.log('hi')
          if (message.attachments && message.attachments.file) {
            this.media.push(UtilityService.getImageUrl(message.attachments.file))
          }
        })
        this.activeMedia = this.media[this.media.length - 1]
      }
    },
    mounted () {
      console.log('messagesList', this.messagesList)
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
