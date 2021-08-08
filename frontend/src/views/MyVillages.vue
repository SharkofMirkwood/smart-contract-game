<template>
  <div class="my-villages">

    <h2>My villages</h2>

    <b-table striped hover :items="villages">
      <template #cell(villageId)="data">
        <router-link :to="{ name: 'view-village', params: { villageId: data.item.villageId }}">{{ data.item.villageId }}</router-link>
      </template>
      <template #cell(buildings)="data">
        {{ data.item.buildings.map(x => x.building.name).join(', ') }}
      </template>
    </b-table>

    <h2>Create village</h2>

    <div>
      <b-form inline @submit="onSubmit">

        <b-form-input
          id="inline-form-input-name"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="Name"
          v-model="form.name"
          :disabled="!currentAddress"
        ></b-form-input>

        <b-form-input
          id="inline-form-input-x"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="X"
          v-model="form.x"
          :disabled="!currentAddress"
        ></b-form-input>

        <b-form-input
          id="inline-form-input-y"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="Y"
          v-model="form.y"
          :disabled="!currentAddress"
        ></b-form-input>

        <b-button :disabled="!currentAddress" type="submit" variant="primary">Submit</b-button>

      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Store } from 'vuex';
import { AppState } from '../store/index';
import { Village } from '../types';

@Component
export default class MyVillages extends Vue {
  $router: any;

  $store: Store<AppState>;

  villages: Village[] = [];

  form = {
    name: '',
    x: 0,
    y: 0,
  };

  get contract() {
    return this.$store.state.contract;
  }

  get currentAddress() {
    return this.$store.state.ethAddress;
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.form);
    this.createVillage(this.form.name, this.form.x, this.form.y);
  }

  async createVillage(name: string, x: number, y: number) {
    const result = await this.contract.methods.createVillage(name, x, y).send({ from: this.currentAddress });
    console.log('result', result);
    this.resetForm();
    this.getMyVillages();
  }

  private async getVillageOfOwnerByIndex(owner: string, index: number): Promise<Village> {
    const villageId = await this.contract.methods.tokenOfOwnerByIndex(owner, index).call();
    const village = await this.contract.methods.getVillage(villageId).call();
    return new Village(villageId, village);
  }

  // @Watch('contract')
  @Watch('currentAddress', { immediate: true })
  private async getMyVillages() {
    const balance = await this.contract.methods.balanceOf(this.currentAddress).call();
    console.log('bal', balance);
    this.villages = await Promise.all(
      Array.from({ length: balance }).map(async (x, i) => this.getVillageOfOwnerByIndex(this.currentAddress, i)),
    );
    console.log('tvill', this.villages);
  }

  resetForm() {
    this.form.name = '';
    this.form.x = 0;
    this.form.y = 0;
  }

  // created() {
  //   this.getMyVillages();
  // }
}
</script>
