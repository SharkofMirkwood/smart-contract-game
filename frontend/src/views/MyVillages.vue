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

    <CreateVillageForm :v-on:success="getMyVillages()"></CreateVillageForm>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Store } from 'vuex';
import CreateVillageForm from '../components/CreateVillageForm.vue';
import { AppState } from '../store/index';
import { Village } from '../types';

@Component({
  components: { CreateVillageForm },
})
export default class MyVillages extends Vue {
  $router: any;

  $store: Store<AppState>;

  villages: Village[] = [];

  get contract() {
    return this.$store.state.contract;
  }

  get currentAddress() {
    return this.$store.state.ethAddress;
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

  // created() {
  //   this.getMyVillages();
  // }
}
</script>
