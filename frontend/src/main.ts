import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

import Navbar from '@/components/Navbar.vue';
import VillageTile from '@/components/VillageTile.vue';

import App from './App.vue';
import router from './router';
import store from './store';

import './style/app.scss';

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

Vue.component('Navbar', Navbar);
Vue.component('VillageTile', VillageTile);

new Vue({
  router,
  store,
  render: (h) => h(App),
  // components: { Navbar, VillageTile },
}).$mount('#app');
