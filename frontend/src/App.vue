<template>
  <div id="app">
    <Navbar />
    <b-container>
      <div class="main-container" style="margin-top: 20px;">
        <b-aspect aspect="1.6" v-if="$store.state.nftContract">
          <router-view />
        </b-aspect>
      </div>
    </b-container>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
