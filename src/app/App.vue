<template>
  <div id="app" class="h-screen">
    <router-view/>
  </div>
</template>
<script src="./app.js"></script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

  #app {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: url("../assets/images/bg-pattern.png");
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
