<template>

  <div class="village-page">

    <b-navbar type="dark" class="village-toolbar">
      <b-navbar-nav>
        <b-nav-text>
          Town: {{ village.name }}, owner: {{ owner }}<span v-if="belongsToCurrentUser"> (You)</span>
        </b-nav-text>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">

        <b-nav-text class="top-nav-info-boxes" v-if="belongsToCurrentUser">
          <div class="box" v-b-tooltip.hover title="Mineable gold">
            <FontAwesomeIcon icon="coins" fixed-width></FontAwesomeIcon>
            {{ goldMineableAmount }}
          </div>
          <div class="box" v-b-tooltip.hover title="Max storable gold">
            <FontAwesomeIcon icon="box-open" fixed-width></FontAwesomeIcon>
            {{ maxStorageAmount }}
          </div>
        </b-nav-text>

        <!-- <b-nav-item-dropdown right>
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown> -->
      </b-navbar-nav>
    </b-navbar>
    <div v-if="!village">
      Village not found!
    </div>
    <div v-if="village">

      <div v-if="belongsToCurrentUser">
        <b-button @click="setCurrentlyPlacing(BuildingTypes.TownHall)">Town Hall</b-button>
        <b-button @click="setCurrentlyPlacing(BuildingTypes.GoldMine)">Gold Mine</b-button>
        <b-button @click="setCurrentlyPlacing(BuildingTypes.AdventurerHall)">Adventurer Hall</b-button>
      </div>

      <br />

      <b-row>
        <b-col col sm="12" lg="12">
          <div class="village-outer-container">
            <div class="village-container">
              <div></div>
              <div class="background" v-bind:style="{ 'min-height': `${tiles.length}%` }"></div>
              <village-tile
                  v-for="(obj, index) of grassTiles"
                  v-bind:key="`grasstile_${index}`"
                  :x="obj.x"
                  :y="obj.y"
                  :width="tileWidth"
                  :height="tileHeight"
                  :canBePlaced="false"
                  :imageSrc="require(`@/assets/map/terrain_cropped/grass_0${village.grassType}.png`)"
                >
              </village-tile>
              <village-tile
                  v-for="(obj, index) of tiles"
                  v-bind:key="`tile_${index}`"
                  :x="obj.x"
                  :y="obj.y"
                  :width="tileWidth"
                  :height="tileHeight"
                  :highlighted="isTileHighlighted(obj.x, obj.y)"
                  :hasBuilding="hasBuilding(obj.x, obj.y)"
                  :outOfBounds="currentTileOutOfBounds"
                  :canBePlaced="canBePlaced(obj.x, obj.y)"
                  v-on:on-click="tileClicked"
                  v-on:on-mouse-over="onMouseOverTile"
                  v-on:on-mouse-leave="onMouseLeaveTile"
                  :imageSrc="require(`@/assets/map/terrain_cropped/ground_0${village.groundType}.png`)"
                >
              </village-tile>
              <village-building
                  v-for="(obj, index) of village.buildings"
                  v-bind:key="`building_${index}`"
                  :x="obj.x"
                  :y="obj.y"
                  :width="obj.size"
                  :height="obj.size"
                  :tileWidth="tileWidth"
                  :tileHeight="tileHeight"
                  :imageSrc="obj.building.image"
                  v-on:on-click="buildingClicked"
                >
              </village-building>
              <village-building
                  v-for="(obj, index) of village.decorations"
                  v-bind:key="`decoration_${index}`"
                  :x="obj.x"
                  :y="obj.y"
                  :tileWidth="tileWidth"
                  :tileHeight="tileHeight"
                  :imageWidth="obj.imageWidth"
                  :imageFromBottom="obj.imageFromBottom"
                  :imageFromLeft="obj.imageFromLeft"
                  :imageSrc="obj.imageSrc"
                  :isClickable="false"
                >
              </village-building>
            </div>
          </div>
        </b-col>

        <!-- <b-col>
          <b-card style="">

          </b-card>
        </b-col> -->
      </b-row>
    </div>

  </div>
</template>

<style lang="scss">
nav.village-toolbar {
  margin-top: -20px;
  margin-left: -20px;
  margin-right: -20px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-bottom: 20px;
  background-color: rgba(170, 147, 115, 0.8);
}
.village-page {
  // height: 100%;
  .top-nav-info-boxes {
    // border: 1px solid #d2c6b5;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    .box {
      display: inline-block;
      padding-left: 10px;
      padding-right: 10px;
      border-right: 1px solid rgba(255, 255, 255, 0.6);
      &:last-of-type {
        border-right: none;
      }
    }
  }
}
.village-outer-container {
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
  padding-bottom: 60%;
  border: 2px solid #6f5d43;
}
.village-container {
  position: absolute;
  width: 100%;
  height: 82%;
  .background {
    background-color: #b7a48980;
    // background-color: rgba(81, 138, 81, 0.8);
    padding-top: 100%;
    position: absolute;
    width: 100%;
    margin-bottom: 20px;
    // border: 25px solid #6f5d43;
    // border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='75' height='75'%3E%3Cg fill='none' stroke='%23856f50' stroke-width='2'%3E%3Cpath d='M1 1h73v73H1z'/%3E%3Cpath d='M8 8h59v59H8z'/%3E%3Cpath d='M8 8h16v16H8zM51 8h16v16H51zM51 51h16v16H51zM8 51h16v16H8z'/%3E%3C/g%3E%3Cg fill='%23856f50'%3E%3Ccircle cx='16' cy='16' r='2'/%3E%3Ccircle cx='59' cy='16' r='2'/%3E%3Ccircle cx='59' cy='59' r='2'/%3E%3Ccircle cx='16' cy='59' r='2'/%3E%3C/g%3E%3C/svg%3E") 25;
  }
}
</style>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { Store } from 'vuex';
import { Contract as Web3Contract } from 'web3-eth-contract';
import { fromWei } from 'web3-utils';
import { AppState } from '../store';
import VillageTile from '../components/VillageTile.vue';
import VillageBuilding from '../components/VillageBuilding.vue';
import {
  buildings, BuildingTypes, IBuilding, Village,
} from '../types';

@Component({
  components: { VillageTile, VillageBuilding },
})
export default class VillageView extends Vue {
  @Prop() private villageId!: string;

  village: Village = null;

  // startY = 15;

  BuildingTypes = BuildingTypes;

  currentlyPlacing: IBuilding = null;

  mouseOverX: number = null;

  mouseOverY: number = null;

  goldMineableAmount: string = null;

  maxStorageAmount: string = null;

  owner: string = null;

  // tiles: any[][];

  // tiles = [
  //   { x: 0, y: 0 },
  //   { x: 0, y: 1 },
  // ];

  // buildings = [
  //   {
  //     x: 0, y: 0, size: 2, color: 'red', imageSrc: require('@/assets/map/castlekeep_13.png'),
  //   },
  //   {
  //     x: 0, y: 0, size: 2, color: 'red', imageSrc: require('@/assets/map/castlekeep_13.png'),
  //   },
  //   {
  //     x: 2, y: 2, size: 2, color: 'red', imageSrc: require('@/assets/map/chapel_01a.png'),
  //   },
  // ];

  // walls = [
  //   {
  //     x: -1, y: -1, image: require('@/assets/map/wall_04d_noshadow.png'),
  //   },
  //   {
  //     x: 0, y: -1, image: require('@/assets/map/wall_01d_noshadow.png'),
  //   },
  //   {
  //     x: 1, y: -1, image: require('@/assets/map/wall_01d_noshadow.png'),
  //   },
  //   {
  //     x: 2, y: -1, image: require('@/assets/map/wall_01d_noshadow.png'),
  //   },

  // ]

  $store: Store<AppState>;

  get currentAddress() {
    return this.$store.state.ethAddress;
  }

  get nftContract(): Web3Contract {
    return this.$store.state.nftContract;
  }

  get belongsToCurrentUser(): boolean {
    console.log(this.owner, this.currentAddress);
    return this.owner && this.owner.toLowerCase() === this.currentAddress;
  }

  get tileWidth(): number {
    if (!this.village) {
      return 0;
    }
    return 100 / (this.village.size);
  }

  get tileHeight(): number {
    if (!this.village) {
      return 0;
    }
    return 100 / (this.village.size);
  }

  get tiles(): { x: number, y: number }[] {
    if (!this.village) {
      return [];
    }
    // return Array.from(new Array(this.village.size + 2)).reduce((acc, val1, index1) => ([...acc, ...Array.from(new Array(this.village.size + 2)).map((val2, index2) => ({ x: index1 - 1, y: index2 - 1 }))]), []);
    return Array.from(new Array(this.village.size)).reduce((acc, val1, index1) => ([...acc, ...Array.from(new Array(this.village.size)).map((val2, index2) => ({ x: index1, y: index2 }))]), []);
  }

  get grassTiles(): { x: number, y: number }[] {
    if (!this.village) {
      return [];
    }
    return Array.from(new Array(this.village.size + 2)).reduce((acc, val1, index1) => ([...acc, ...Array.from(new Array(this.village.size + 2)).map((val2, index2) => ({ x: index1 - 1, y: index2 - 1 }))]), []);
  }

  get decorations(): { x: number, y: number, imageSrc: string, imageWidth: number, imageFromBottom: number, imageFromLeft: number }[] {
    if (!this.village) {
      return [];
    }
    const paddedBanner = this.village.bannerType > 9 ? `${this.village.bannerType}` : `0${this.village.bannerType}`;
    console.log('paddedBanner', paddedBanner);
    return [
      // banners
      {
        x: this.village.size,
        y: this.village.size - 1,
        imageSrc: require(`@/assets/map/banners/banner_${paddedBanner}a.png`),
        imageWidth: 50,
        imageFromBottom: 30,
        imageFromLeft: 30,
      },
      {
        x: this.village.size - 1,
        y: this.village.size,
        imageSrc: require(`@/assets/map/banners/banner_${paddedBanner}b.png`),
        imageWidth: 50,
        imageFromBottom: 30,
        imageFromLeft: 30,
      },
      // Top-right stream
      {
        x: -1,
        y: 1,
        imageSrc: require('@/assets/map/terrain_cropped/moat_01h.png'),
        imageWidth: 48,
        imageFromBottom: 7,
        imageFromLeft: 46,
      },
      {
        x: -1,
        y: 2,
        imageSrc: require('@/assets/map/terrain_cropped/moat_01c.png'),
        imageWidth: 83,
        imageFromBottom: 8,
        imageFromLeft: 10,
      },
      {
        x: -1,
        y: 3,
        imageSrc: require('@/assets/map/terrain_cropped/moat_01i.png'),
        imageWidth: 80,
        imageFromBottom: 31,
        imageFromLeft: 11,
      },
    ];
  }

  // get wallsBehind() {
  //   const walls = [];
  //   // // Top
  //   // walls.push({
  //   //   x: -1, y: -1, pos: 'top', image: require('@/assets/map/walls_cropped/wall_06d_noshadow.png'),
  //   // });
  //   // // Top-left wall
  //   // for (let i = 0; i < this.village.size; i += 1) {
  //   //   walls.push({
  //   //     x: i, y: -1, pos: 'top-left', image: require('@/assets/map/walls_cropped/wall_06d_noshadow.png'),
  //   //   });
  //   // }
  //   // // Left
  //   // walls.push({
  //   //   x: this.village.size, y: -1, pos: 'left', image: require('@/assets/map/walls_cropped/wall_04b_noshadow.png'),
  //   // });
  //   // // Top-right wall
  //   // for (let i = 0; i < this.village.size; i += 1) {
  //   //   walls.push({
  //   //     x: -1, y: i, pos: 'top-right', image: require('@/assets/map/walls_cropped/wall_06c_noshadow.png'),
  //   //   });
  //   // }
  //   // // Right
  //   // walls.push({
  //   //   x: -1, y: this.village.size, pos: 'right', image: require('@/assets/map/walls_cropped/wall_06d_noshadow.png'),
  //   // });
  //   return walls;
  // }

  // get wallsInFront() {
  //   const walls = [];
  //   // // Bottom-left wall
  //   // for (let i = 0; i < this.village.size; i += 1) {
  //   //   walls.push({
  //   //     x: this.village.size, y: i, image: require('@/assets/map/walls_cropped/wall_06c_noshadow.png'),
  //   //   });
  //   // }
  //   // // Bottom-right wall
  //   // for (let i = 0; i < this.village.size; i += 1) {
  //   //   walls.push({
  //   //     x: i, y: this.village.size, image: require('@/assets/map/walls_cropped/wall_06d_noshadow.png'),
  //   //   });
  //   // }
  //   // // Bottom
  //   // walls.push({
  //   //   x: this.village.size, y: this.village.size, image: require('@/assets/map/walls_cropped/wall_04a_noshadow.png'),
  //   // });
  //   return walls;
  // }

  // get startX(): number {
  //   return 50 - this.tileWidth / 2;
  // }

  get highlightAddtionalTilesSize(): number {
    if (!this.currentlyPlacing) {
      return 0;
    }
    return this.currentlyPlacing.size - 1;
  }

  get currentTileOutOfBounds(): boolean {
    if (this.currentlyPlacing === null) {
      return false;
    }
    const xOutOfBounds = this.mouseOverX + this.currentlyPlacing.size > this.village.size;
    const yOutOfBounds = this.mouseOverY + this.currentlyPlacing.size > this.village.size;
    return xOutOfBounds || yOutOfBounds;
  }

  isTileHighlighted(x: number, y: number): boolean {
    if (this.currentlyPlacing === null || this.mouseOverX === null || this.mouseOverY === null) {
      return false;
    }
    const xInRange = x >= this.mouseOverX && x <= this.mouseOverX + this.highlightAddtionalTilesSize;
    const yInRange = y >= this.mouseOverY && y <= this.mouseOverY + this.highlightAddtionalTilesSize;
    return xInRange && yInRange;
  }

  canBePlaced(x: number, y: number): boolean {
    if (this.currentTileOutOfBounds || this.currentlyPlacing === null) {
      return false;
    }
    for (let i = x; i <= x + this.highlightAddtionalTilesSize; i += 1) {
      for (let j = y; j <= y + this.highlightAddtionalTilesSize; j += 1) {
        if (this.hasBuilding(i, j)) {
          return false;
        }
      }
    }
    return true;
  }

  hasBuilding(x: number, y: number): boolean {
    /* eslint-disable-next-line no-restricted-syntax */
    for (const building of this.village.buildings) {
      const buildingUpperX = building.x + building.size - 1;
      const buildingUpperY = building.y + building.size - 1;
      if (x >= building.x && x <= buildingUpperX && y >= building.y && y <= buildingUpperY) {
        return true;
      }
    }
    return false;
  }

  tileClicked(x: number, y: number): void {
    console.log('x, y', x, y);
    this.placeBuilding(this.currentlyPlacing, x, y);
  }

  buildingClicked(building: any): void {
    console.log('building', building);
  }

  async placeBuilding(building: IBuilding, x: number, y: number): Promise<void> {
    const result = await this.nftContract.methods.placeBuilding(this.villageId, building.buildingType, x, y).send({ from: this.currentAddress });
    return this.updateVillage(this.villageId);
  }

  onMouseOverTile(x: number, y: number): void {
    if (x < 0 || y < 0 || x >= this.village.size || y >= this.village.size) {
      return;
    }
    this.mouseOverX = x;
    this.mouseOverY = y;
  }

  onMouseLeaveTile(x: number, y: number): void {
    this.mouseOverX = null;
    this.mouseOverY = null;
  }

  setCurrentlyPlacing(type: BuildingTypes): void {
    this.currentlyPlacing = buildings[type];
  }

  @Watch('villageId', { immediate: true })
  async updateVillage(villageId: string): Promise<void> {
    console.log('vid', villageId);
    try {
      const [village, goldMineable, maxStorage, owner] = await Promise.all([
        this.nftContract.methods.getVillage(villageId).call(),
        this.nftContract.methods.getGoldMineableAmount(villageId).call(),
        this.nftContract.methods.getGoldMaxStorageAmount(villageId).call(),
        this.nftContract.methods.ownerOf(villageId).call(),
      ]);
      this.village = new Village(villageId, village);
      this.goldMineableAmount = fromWei(goldMineable);
      this.maxStorageAmount = fromWei(maxStorage);
      this.owner = owner;
      console.log('vill', this.village);
    } catch (e: any) {
      console.error(e);
      this.village = null;
      this.goldMineableAmount = null;
    }
  }
}
</script>
