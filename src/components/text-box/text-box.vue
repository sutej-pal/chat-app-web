<template>
  <div class="flex items-center relative" >
    <div v-if="isEmojisCardVisible" class="emojis-card absolute border shadow rounded overflow-auto bg-white"
         tabindex="-1" @focusout="isEmojisCardVisible = false">
      <span class="p-1 inline-block hover:bg-gray-300 hover:shadow hover:rounded" @click="$refs.msg.innerText += emoji" v-for="(emoji, index) in emojis" :key="index">{{emoji}}</span>
    </div>
    <div class="p-2" ref="emoji-toggle">
      <i class="fa fa-smile-o text-xl"></i>
    </div>
    <div class="text-box-container w-full">
      <div contenteditable="true" spellcheck="value" class="edit" ref='msg' @keydown.enter="sendMessage"></div>
    </div>
  </div>
</template>

<script src="./text-box.js"/>

<style lang="scss" scoped>
  @import "src/assets/scss/common.scss";

  .fa {
    cursor: pointer;
  }

  .emojis-card {
    width: 300px;
    height: 200px;
    top: -220px;
    left: 6px;
    @include scrollbar;
    &:focus {
      outline: none;
    }
    span {
      cursor: pointer;
    }
  }

  .text-box-container {
    background: #fff;
    border-radius: 25px;
    padding: 10px 15px;
    .edit {
      max-height: 80px;
      width: 95%;
      font-size: 14px;
      overflow-x: hidden;
      height: auto;
      transition: height 2s;
      @include scrollbar;

      &:focus {
        outline: none;
      }
    }
  }
</style>
