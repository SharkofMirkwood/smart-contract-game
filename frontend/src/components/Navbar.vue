<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#" class="navbar-brand-title">Village Game</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/my-villages">My Villages</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-nav-form style="margin-right: 20px;" @submit="onSearch">
                <b-form-input size="sm" class="mr-sm-2" placeholder="Village ID" v-model="villageId"></b-form-input>
                <b-button size="sm" class="my-2 my-sm-0" type="submit">Find</b-button>
            </b-nav-form>

            <div class="gold-balance">
              <FontAwesomeIcon icon="coins" fixed-width></FontAwesomeIcon>
              &nbsp;<span>0</span>
            </div>

            <b-button v-if="ethAccountAccessed" pill variant="primary">{{ ethAddress }}</b-button>
            <b-button v-if="!ethAccountAccessed" pill variant="primary" @click="requestEthAccount">Connect</b-button>

            <!-- <b-nav-item-dropdown right>
                <template #button-content>
                    <em>User</em>
                </template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown> -->
        </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</div>
</template>

<style lang="scss">
.navbar-brand.navbar-brand-title {
  font-family: 'MedievalSharp', cursive;
  margin-top: -20px;
  margin-bottom: -20px;
  font-size: 45px;
  text-shadow: 5px 0px 10px #2c251b;
}

.gold-balance {
  font-weight: bold;
  padding: 10px;
  @media only screen and (min-width: 992px) {
    background: url('../assets/backgrounds/wood.png'), #7c4029;padding: 10px;
    border: 1px solid rgba(255,255,255,0.4);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    margin-top: -17px;
    padding-top: 26px;
    margin-bottom: -3px;
    margin-right: 20px;
    margin-left: 20px;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { AppState } from '../store/index';

@Component
export default class Navbar extends Vue {
  $router: any;

  private villageId = '';

  $store: Store<AppState>;

  get web3() {
    return this.$store.state.web3Instance;
  }

  get ethAccountAccessed() {
    return this.$store.state.ethAccountAccessed;
  }

  get ethAddress() {
    return this.$store.state.ethAddress;
  }

  requestEthAccount() {
    this.$store.dispatch('requestEthAccounts');
  }

  onSearch(event: Event): void {
    event.preventDefault();
    this.$router.push({ name: 'view-village', params: { villageId: this.villageId } });
  }
}
</script>
