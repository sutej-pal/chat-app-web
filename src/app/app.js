export default {
  watch: {
    '$route' (to) {
      document.title = to.meta.title || 'Chat App'
    }
  }
};
