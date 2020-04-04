import Vue from 'vue'
import App from './app/App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@/assets/css/tailwind.css'
import Toasted from 'vue-toasted';

Vue.use(Toasted,
  {position: "top-right", duration: 2000, keepOnHover: true}
  );

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
