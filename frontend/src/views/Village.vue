<template>
  <div class="home">
    <div>VILLAGE {{ villageId }}</div>

    <div class="village-container">
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
  background: green;
}
</style>

<script lang="ts">
import {
  Component, Prop, Provide, Vue,
} from 'vue-property-decorator';
import VillageTile from '../components/VillageTile.vue';
import VillageBuilding from '../components/VillageBuilding.vue';

@Component({
  components: { VillageTile, VillageBuilding },
})
export default class Village extends Vue {
  @Prop() private villageId!: string;

  villageSize = 6;

  keyCounter = 1;

  tileWidth = 100 / this.villageSize;

  tileHeight = 100 / this.villageSize;

  startX = 50 - this.tileWidth / 2;

  startY = 20;

  tiles = Array.from(new Array(this.villageSize)).reduce((acc, val1, index1) => ([...acc, ...Array.from(new Array(this.villageSize)).map((val2, index2) => ({ x: index1, y: index2 }))]), []);

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

  click() {
    console.log('click');
    this.buildings = [this.buildings[1]];
    this.keyCounter += 1;
  }

  tileClicked(x: number, y: number) {
    console.log('x, y', x, y);
    console.log('xx', process.env);
  }
}
</script>
