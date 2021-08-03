<template>
  <div id="app">
    <Navbar />
    <b-container>
      <b-aspect aspect="2">
        <router-view/>
      </b-aspect>
    </b-container>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-bottom: 20px;
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

<script lang="ts">
import {
  Component, Prop, Provide, Vue,
} from 'vue-property-decorator';

@Component({
  components: { },
})
export default class Village extends Vue {
  @Prop() private villageId!: string;

  beforeCreate() {
    console.log('registerWeb3 Action dispatched from App.vue');
    this.$store.dispatch('registerWeb3');
  }
}
</script>
