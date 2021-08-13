<template>

<div
  class="village-tile"
  v-bind:style="{ left: calculatedBox.x + '%', top: calculatedBox.y + '%', width: calculatedBox.w + '%', height: calculatedBox.h + '%' }"
  v-bind:class="{ hover: highlighted, 'has-building': hasBuilding, 'out-of-bounds': outOfBounds, 'cannot-be-placed': !canBePlaced }">
  <img :src="imageSrc" />
  <div class="clicker" @click="onClick()" @mouseover="onMouseOver()" @mouseleave="onMouseLeave()"></div>
</div>

</template>

<style lang="scss">
.village-tile {
  position: absolute;
  background-color: transparent;
  pointer-events: none;

  img {
    width: 101%;
    // height: 100%;
    position: absolute;
    bottom: 0px;
    left: 0px;
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

    .clicker {
      cursor: pointer;
    }

    &.cannot-be-placed {
      .clicker {
        cursor: auto;
      }
    }

    img {
      // filter: drop-shadow(1px 0px 7px black);
      filter: drop-shadow(1px 0px 7px black) saturate(100%) hue-rotate(20deg);

      z-index: 100;
    }

    &.has-building, &.out-of-bounds {
      img {
        filter: drop-shadow(1px 0px 7px black) saturate(100%) hue-rotate(300deg);
      }
    }
  }
}
</style>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

@Component
export default class VillageTile extends Vue {
  @Prop() x: number;

  @Prop() y: number;

  @Prop() width: number;

  @Prop() height: number;

  @Prop() highlighted: boolean;

  @Prop() hasBuilding: boolean;

  @Prop() outOfBounds: boolean;

  @Prop() canBePlaced: boolean;

  @Prop() imageSrc: any;

  get calculatedBox() {
    const startX = 50 - this.width * 0.5;
    const startY = this.height * 0.5;
    const x = startX - (this.x * this.width * 0.5) + (this.y * this.height * 0.5);
    const y = startY + (this.x * this.width * 0.5) + (this.y * this.height * 0.5);

    return {
      x,
      y,
      w: this.width,
      h: this.height,
    };
  }

  onMouseOver() {
    this.$emit('on-mouse-over', this.x, this.y);
  }

  onMouseLeave() {
    this.$emit('on-mouse-leave', this.x, this.y);
  }

  onClick() {
    if (this.canBePlaced) {
      this.$emit('on-click', this.x, this.y);
    }
  }
}
</script>
