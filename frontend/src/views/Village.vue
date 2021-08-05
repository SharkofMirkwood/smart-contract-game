<template>
  <div class="home">
    <div>VILLAGE {{ villageId }}</div>
    {{ tileHeight }}

    <div class="village-container">
      <div class="background" v-bind:style="{ 'min-height': `${tiles.length}%` }"></div>
      <village-tile
          v-for="(obj, index) of tiles"
          v-bind:key="index + 'tile' + keyCounter"
          :startX="startX"
          :startY="startY"
          :x="obj.x"
          :y="obj.y"
          :width="tileWidth"
          :height="tileHeight"
          :color="obj.color"
          v-on:on-click="tileClicked"
        >
      </village-tile>

      <village-building
          v-for="(obj, index) of buildings"
          v-bind:key="index + 'building' + keyCounter"
          :startX="startX"
          :startY="startY"
          :x="obj.x"
          :y="obj.y"
          :width="obj.width"
          :height="obj.height"
          :tileWidth="tileWidth"
          :tileHeight="tileHeight"
          :color="obj.color"
          :imageSrc="obj.imageSrc"
        >
      </village-building>

    </div>

  </div>
</template>

<style lang="scss">
.village-container {
  position: relative;
  width: 100%;
  height: 100%;
  .background {
    background-color: green;
    padding-top: 65%;
    position: absolute;
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>

<script lang="ts">
import {
  Component, Prop, Provide, Vue, Watch,
} from 'vue-property-decorator';
import { Store } from 'vuex';
import { AppState } from '../store';
import VillageTile from '../components/VillageTile.vue';
import VillageBuilding from '../components/VillageBuilding.vue';
import { Village } from '../types';

@Component({
  components: { VillageTile, VillageBuilding },
})
export default class VillageView extends Vue {
  @Prop() private villageId!: string;

  village: Village = null;

  villageSize = 6;

  keyCounter = 1;

  startY = 20;

  // tiles: any[][];

  // tiles = [
  //   { x: 0, y: 0 },
  //   { x: 0, y: 1 },
  // ];

  buildings = [
    {
      x: 0, y: 0, width: 2, height: 2, color: 'red', imageSrc: require('@/assets/map/castlekeep_13.png'),
    },
    {
      x: 0, y: 0, width: 2, height: 2, color: 'red', imageSrc: require('@/assets/map/castlekeep_13.png'),
    },
    {
      x: 2, y: 2, width: 2, height: 2, color: 'red', imageSrc: require('@/assets/map/chapel_01a.png'),
    },
  ];

  $store: Store<AppState>;

  get contract() {
    return this.$store.state.contract;
  }

  get tileWidth() {
    if (!this.village) {
      return 0;
    }
    return 100 / this.village.size;
  }

  get tileHeight() {
    if (!this.village) {
      return 0;
    }
    return 100 / this.village.size;
  }

  get tiles() {
    if (!this.village) {
      return [];
    }
    return Array.from(new Array(this.village.size)).reduce((acc, val1, index1) => ([...acc, ...Array.from(new Array(this.village.size)).map((val2, index2) => ({ x: index1, y: index2 }))]), []);
  }

  get startX() {
    return 50 - this.tileWidth / 2;
  }

  click() {
    console.log('click');
    this.buildings = [this.buildings[1]];
    this.keyCounter += 1;
  }

  tileClicked(x: number, y: number) {
    console.log('x, y', x, y);
  }

  @Watch('villageId', { immediate: true })
  async getVillage(villageId: number): Promise<void> {
    console.log('vid', villageId);
    const village = await this.contract.methods.getVillage(villageId).call();
    this.village = new Village(villageId, village);
    console.log('village', this.village);
  }
}
</script>
