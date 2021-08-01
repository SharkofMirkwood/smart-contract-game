<template>
  <div class="home">
    <div>VILLAGE {{ villageId }}</div>

    <!-- <canvas ref="my-canvas" @mousemove="mouseMove" @click="click"></canvas> -->

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

  @Provide('provider') provider: { context?: CanvasRenderingContext2D } = {
    context: null,
  };

  provide() {
    return {
      provider: this.provider,
    };
  }

  keyCounter = 1;

  tileWidth = 20;

  tileHeight = 20;

  startX = 40;

  startY = 20;

  tiles = [
    { x: 0, y: 0, color: 'red' },
    { x: 0, y: 1, color: 'green' },
    { x: 0, y: 2, color: 'green' },
    { x: 0, y: 3, color: 'green' },
    { x: 1, y: 0, color: 'blue' },
    { x: 1, y: 1, color: 'black' },
    { x: 1, y: 2, color: 'black' },
    { x: 1, y: 3, color: 'black' },
    { x: 2, y: 0, color: 'black' },
    { x: 2, y: 1, color: 'black' },
    { x: 2, y: 2, color: 'black' },
    { x: 2, y: 3, color: 'black' },
    { x: 3, y: 0, color: 'black' },
    { x: 3, y: 1, color: 'black' },
    { x: 3, y: 2, color: 'black' },
    { x: 3, y: 3, color: 'black' },
  ];

  buildings = [
    {
      x: 0, y: 0, width: 2, height: 2, color: 'red', imageSrc: require('@/assets/map/castlekeep_13.png'),
    },
    {
      x: 2, y: 2, width: 2, height: 2, color: 'red', imageSrc: require('@/assets/map/chapel_01a.png'),
    },
  ];

  // mounted(): void {
  //   const canvas = this.$refs['my-canvas'] as HTMLCanvasElement;
  //   this.provider.context = canvas.getContext('2d');

  //   console.log('this.provider', this.provider);

  //   canvas.width = canvas.parentElement.clientWidth;
  //   canvas.height = canvas.parentElement.clientHeight;
  // }

  mouseMove(e: MouseEvent): void {
    // console.log('x, y', e.screenX, e.screenY);
  }

  click() {
    console.log('click');
    this.buildings = [this.buildings[1]];
    this.keyCounter += 1;
  }

  tileClicked(x: number, y: number) {
    console.log('x, y', x, y);
  }
}
</script>
