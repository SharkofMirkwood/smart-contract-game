<template>

<div
  class="village-building"
  v-bind:style="{ left: calculatedBox.x + '%', top: calculatedBox.y + '%', width: calculatedBox.w + '%', height: calculatedBox.h + '%' }"
  v-bind:class="{ hover: isMouseOver, wall: isWall }">
  <img :src="imageSrc" />
  <div class="clicker" @mouseover="isMouseOver = true" @mouseleave="isMouseOver = false"></div>
</div>

</template>

<style lang="scss">
.village-building {
  position: absolute;
  background-color: transparent;
  pointer-events: none;

  img {
    width: 90%;
    // height: 100%;
    position: absolute;
    bottom: 5%;
    left: 5%;
    z-index: 200;
    // border: 1px solid black;
  }

  .clicker {
    // background: rgba(0,0,255,0.1);
    position: absolute;
    top: 50%;
    left: 0px;
    width: 71%;
    height: 141%;
    transform: rotateX(-60deg) rotateZ(-45deg);
    transform-style: preserve-3d;
    transform-origin: top left;
    pointer-events: all;
    cursor: pointer;
  }
  &.hover {
    // opacity: 0.8;

    img {
      filter: drop-shadow(1px 0px 7px black);
      // z-index: 250;
    }
  }

  &.wall {
    img {
      width: 54%;
      left: 5%;
      height: auto;
    }
  }
}
</style>

<script lang="ts">
import {
  Component, Inject, Prop, Vue,
} from 'vue-property-decorator';

@Component
export default class VillageTile extends Vue {
  @Prop() x: number;

  @Prop() y: number;

  @Prop() startX: number;

  @Prop() startY: number;

  @Prop() width: number;

  @Prop() height: number;

  @Prop() tileWidth: number;

  @Prop() tileHeight: number;

  @Prop() color: string;

  @Prop() imageSrc: string;

  @Prop() pos: string;

  @Prop({ default: false }) isWall: boolean;

  private isMouseOver = false;

  get calculatedBox() {
    const x = this.startX - ((this.x + this.width - 1) * this.tileWidth * 0.5) + ((this.y) * this.tileHeight * 0.5);
    const y = this.startY + (this.x * this.tileWidth * 0.5) + (this.y * this.tileHeight * 0.5);

    return {
      x,
      y,
      w: this.height * this.tileWidth,
      h: this.height * this.tileHeight,
    };
  }
}
</script>
