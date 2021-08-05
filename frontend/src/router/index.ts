import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Village from '../views/Village.vue';
import CreateVillage from '../views/CreateVillage.vue';

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
    component: Village,
    props: true,
  },
  {
    path: '/create',
    name: 'create',
    component: CreateVillage,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
