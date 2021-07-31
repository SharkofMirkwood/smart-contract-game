<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">---</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-nav-form @submit="onSearch">
                <b-form-input size="sm" class="mr-sm-2" placeholder="Village ID" v-model="villageId"></b-form-input>
                <b-button size="sm" class="my-2 my-sm-0" type="submit">Find</b-button>
            </b-nav-form>

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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Navbar extends Vue {
  $router: any;

  private villageId = '';

  onSearch(event: Event): void {
    event.preventDefault();
    this.$router.push({ name: 'view-village', params: { villageId: this.villageId } });
  }
}
</script>
