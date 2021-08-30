import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoins, faBox, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Navbar from '@/components/Navbar.vue';
import VillageTile from '@/components/VillageTile.vue';
import CreateVillageForm from '@/components/CreateVillageForm.vue';

import App from './App.vue';
import router from './router';
import store from './store';

import './style/app.scss';

library.add(faCoins, faBox, faBoxOpen);

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Vue.use(BootstrapVueIcons);
// Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin);

Vue.config.productionTip = false;

Vue.component('Navbar', Navbar);
Vue.component('CreateVillageForm', CreateVillageForm);
Vue.component('VillageTile', VillageTile);
Vue.component('FontAwesomeIcon', FontAwesomeIcon);

new Vue({
  router,
  store,
  render: (h) => h(App),
  // components: { Navbar, VillageTile },
}).$mount('#app');
