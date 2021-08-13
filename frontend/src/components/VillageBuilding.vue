<template>

<div
  class="village-building"
  v-bind:style="{ left: calculatedBox.x + '%', top: calculatedBox.y + '%', width: calculatedBox.w + '%', height: calculatedBox.h + '%' }"
  v-bind:class="{ hover: isClickable && isMouseOver, wall: isWall }">
  <img
  :src="imageSrc"
  v-bind:style="{ left: `${imageFromLeft}%`, bottom: `${imageFromBottom}%`, width: `${imageWidth}%` }"
  />
  <div class="clicker" @click="onClick()" @mouseover="onMouseOver()" @mouseleave="onMouseLeave()"></div>
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
  }
  &.hover {
    // opacity: 0.8;
    cursor: pointer;

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

  @Prop({ default: 1 }) width: number;

  @Prop({ default: 1 }) height: number;

  @Prop({ default: 90 }) imageWidth: number;

  @Prop({ default: 5 }) imageFromLeft: number;

  @Prop({ default: 5 }) imageFromBottom: number;

  @Prop() tileWidth: number;

  @Prop() tileHeight: number;

  @Prop() color: string;

  @Prop() imageSrc: string;

  @Prop() pos: string;

  @Prop({ default: false }) isWall: boolean;

  @Prop({ default: true }) isClickable: boolean;

  private isMouseOver = false;

  get calculatedBox() {
    const startX = 50 - this.tileWidth * 0.5;
    const startY = this.tileHeight * 0.5;
    const x = startX - ((this.x + this.width - 1) * this.tileWidth * 0.5) + ((this.y) * this.tileHeight * 0.5);
    const y = startY + (this.x * this.tileWidth * 0.5) + (this.y * this.tileHeight * 0.5);

    return {
      x,
      y,
      w: this.height * this.tileWidth,
      h: this.height * this.tileHeight,
    };
  }

  onMouseOver() {
    this.isMouseOver = true;
    this.$emit('on-mouse-over', this.x, this.y);
  }

  onMouseLeave() {
    this.isMouseOver = false;
    this.$emit('on-mouse-leave', this.x, this.y);
  }

  onClick() {
    this.$emit('on-click', this.x, this.y);
  }
}
</script>
