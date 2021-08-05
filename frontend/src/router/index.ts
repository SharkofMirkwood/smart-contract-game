import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import VillageView from '../views/Village.vue';
import MyVillages from '../views/MyVillages.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/village/:villageId',
    name: 'view-village',
    component: VillageView,
    props: true,
  },
  {
    path: '/my-villages',
    name: 'my-villages',
    component: MyVillages,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
