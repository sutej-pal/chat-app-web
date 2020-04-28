<template>
  <div class="relative w-full h-full">
    <div class="stars"></div>
    <div class="twinkling"></div>
    <div class="absolute flex justify-center items-center flex-col w-full h-full z-10 text-white">
      <div class="h404">404</div>
      <div class="msg">Sorry, you are lost in space. Go to
        <router-link class="underline" to="/">Home</router-link>
      </div>
    </div>
  </div>
</template>
<script src="./not-found.js"/>
<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');

  .h404 {
    font-size: 12vh;
    font-family: 'Monoton', cursive;
    line-height: 1;
  }

  .msg {
    font-size: 2.5vh;
    font-family: 'Roboto', sans-serif;
  }

  @keyframes move-twink-back {
    from {
      background-position: 0 0;
    }
    to {
      background-position: -10000px 5000px;
    }
  }

  .stars, .twinkling {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  .stars {
    background: #000 url(http://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
    z-index: 0;
  }

  .twinkling {
    background: transparent url(http://www.script-tutorials.com/demos/360/images/twinkling.png) repeat top center;
    z-index: 1;
    animation: move-twink-back 300s ease infinite;
  }
</style>
