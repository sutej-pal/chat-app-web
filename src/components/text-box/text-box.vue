<template>
  <div class="text-box-container">
    <div contenteditable="true" class="edit" ref='msg' @keydown.enter="sendMessage"></div>
  </div>
</template>

<script src="./text-box.js"/>

<style lang="scss" scoped>
  @import "src/assets/scss/common.scss";

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
