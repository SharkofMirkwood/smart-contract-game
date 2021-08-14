<template>
  <div id="app">
    <Navbar />
    <b-container>
      <b-card style="margin-top: 20px;">

      <b-aspect aspect="1.6" v-if="$store.state.contract">
        <router-view />
      </b-aspect>
  </b-card>
    </b-container>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  padding-bottom: 20px;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    // color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script lang="ts">
import {
  Component, Prop, Provide, Vue,
} from 'vue-property-decorator';
import { Store } from 'vuex';
import { AppState } from './store';

@Component({
  components: { },
})
export default class App extends Vue {
  @Prop() private villageId!: string;

  $store: Store<AppState>;

  beforeCreate() {
    console.log('registerWeb3 Action dispatched from App.vue');
    this.$store.dispatch('registerWeb3');
  }
}
</script>
