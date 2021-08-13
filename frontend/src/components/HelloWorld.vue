<template>
  <div class="village-map-page">
    <div class="village-map-container">
      <div class="village-map" v-if="map">
        <div class="map-row" v-for="i in 100" v-bind:key="`y-${i}`">
          <div
            class="map-cell"
            v-for="j in 100"
            v-bind:key="`x-${j}`"
            v-bind:class="{ occupied: isOccupied(-50 + j, -50 + i) }"
            v-on:click="onVillageClick(-50 + j, -50 + i)">
            <!-- v-b-tooltip.hover
            :title="`(${-50 + j},${-50 + i})`" -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.village-map-container {
  margin-top: 20px;
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 80%;
  .village-map {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: red;
    .map-row {
      display: flex;
      height: 1%;
      width: 100%;
      .map-cell {
        height: 100%;
        width: 1%;
        outline: 1px solid black;
        background-color: green;
        display: inline-block;
        cursor: pointer;

        &.occupied {
          background-color: yellow;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { Store } from 'vuex';
import { AppState } from '../store';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  $store: Store<AppState>;

  $router: any;

  map: { [key: number]: { [key: number]: number } } = null;

  get contract() {
    return this.$store.state.contract;
  }

  @Watch('contract', { immediate: true })
  private async getVillageMap(): Promise<void> {
    const mapSize = 100;
    console.log('this.contract.methods', this.contract);

    // for (let x = -mapSize; x < mapSize; x += 1) {
    //   for (let y = -mapSize; y < mapSize; y += 1) {
    //     map[x][y] = null;
    //   }
    // }

    const map: { [key: number]: { [key: number]: number } } = {};
    const events = await this.contract.getPastEvents('NewVillage', { fromBlock: 'earliest', toBlock: 'latest' });
    /* eslint-disable-next-line no-restricted-syntax */
    for (const event of events) {
      /* eslint-disable-next-line no-underscore-dangle */
      const x = parseInt(event.returnValues._x, 10);
      /* eslint-disable-next-line no-underscore-dangle */
      const y = parseInt(event.returnValues._y, 10);
      map[x] = map[x] || {};
      map[x][y] = parseInt(event.returnValues.villageId, 10);
    }
    console.log('map', map);
    this.map = map;
  }

  isOccupied(x: number, y: number): boolean {
    if (!this.map[x]) {
      return false;
    }
    return this.map[x][y] > 0;
  }

  onVillageClick(x: number, y: number): void {
    if (this.isOccupied(x, y)) {
      // goto village
      this.$router.push({ name: 'view-village', params: { villageId: this.map[x][y] } });
    }
    // create village
  }
}
</script>
