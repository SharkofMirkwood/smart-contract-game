/* eslint-disable import/prefer-default-export, max-classes-per-file, no-shadow */

export enum BuildingTypes {
  TownHall = 0,
  GoldMine = 1,
  Wall = 2,
  AdventurerHall = 3,
  House = 4,
  Armoury = 5,
  Blacksmith = 6,
}

export interface IBuilding {
  name: string;

  buildingType: BuildingTypes;

  size: number;

  image: string;
}
export const buildings: { [key in BuildingTypes]: IBuilding } = {
  [BuildingTypes.TownHall]: {
    name: 'Town Hall',
    buildingType: BuildingTypes.TownHall,
    size: 3,
    image: require('@/assets/map/castlekeep_13.png'),
  },
  [BuildingTypes.GoldMine]: {
    name: 'Gold Mine',
    buildingType: BuildingTypes.GoldMine,
    size: 1,
    image: require('@/assets/map/chapel_01a.png'),
  },
  [BuildingTypes.Wall]: {
    name: 'Wall',
    buildingType: BuildingTypes.Wall,
    size: 0,
    image: require('@/assets/map/chapel_01a.png'),
  },
  [BuildingTypes.AdventurerHall]: {
    name: 'Adventurer Hall',
    buildingType: BuildingTypes.AdventurerHall,
    size: 1,
    image: require('@/assets/map/chapel_01a.png'),
  },
  [BuildingTypes.House]: {
    name: 'House',
    buildingType: BuildingTypes.House,
    size: 1,
    image: require('@/assets/map/chapel_01a.png'),
  },
  [BuildingTypes.Armoury]: {
    name: 'Armoury',
    buildingType: BuildingTypes.Armoury,
    size: 1,
    image: require('@/assets/map/chapel_01a.png'),
  },
  [BuildingTypes.Blacksmith]: {
    name: 'Blacksmith',
    buildingType: BuildingTypes.Blacksmith,
    size: 1,
    image: require('@/assets/map/chapel_01a.png'),
  },
};

export class BuildingPlacement {
  x: number;

  y: number;

  size: number;

  level: number;

  upgradeCompleteTime: Date;

  building: IBuilding;

  constructor(buildingData: any) {
    this.x = parseInt(buildingData.x, 10);
    this.y = parseInt(buildingData.y, 10);
    this.size = parseInt(buildingData.size, 10);
    this.level = parseInt(buildingData.level, 10);
    this.upgradeCompleteTime = new Date(parseInt(buildingData.upgradeCompleteTime, 10) * 1000);
    const buildingType: BuildingTypes = parseInt(buildingData.buildingType, 10);
    this.building = buildings[buildingType];
  }
}

export class Village {
  villageId: number;

  baseGoldRate: number;

  buildings: BuildingPlacement[];

  name: string;

  readyToMineTime: Date;

  size: number;

  x: number;

  y: number;

  stats: string;

  constructor(villageId: string, villageData: any) {
    this.villageId = parseInt(villageId, 10);
    this.buildings = villageData.buildings.map((x: unknown) => new BuildingPlacement(x));
    this.name = villageData.name;
    this.readyToMineTime = new Date(parseInt(villageData.readyToMineTime, 10) * 1000);
    this.baseGoldRate = parseInt(villageData.baseGoldRate, 10);
    this.size = parseInt(villageData.size, 10);
    this.x = parseInt(villageData.x, 10);
    this.y = parseInt(villageData.y, 10);
    this.stats = villageData.stats;
  }

  private selectFromStats(startPos: number, digits: number, odds: number[]) {
    const statsChunk = parseInt(this.stats.substr(startPos, digits), 10);
    const maxAllowed = 10 ** digits;
    const summedOdds = odds.reduce((a, b) => a + b, 0);
    if (summedOdds !== maxAllowed) {
      throw new Error(`Error in code: odds sum to ${summedOdds} instead of ${maxAllowed}`);
    }
    let counter = 0;
    for (let i = 0; i <= odds.length; i += 1) {
      counter += odds[i];
      if (statsChunk < counter) {
        return i;
      }
    }
    throw new Error('Code should be unreachable!');
  }

  get bannerType(): number {
    const odds = [4, 7, 6, 6, 8, 5, 5, 1, 2, 6, 3, 5, 8, 7, 8, 5, 2, 4, 8];
    return this.selectFromStats(0, 2, odds) + 1;
  }

  get groundType(): number {
    return 1; // Hardcode for now...
  }

  get grassType(): number {
    const odds = [3, 3, 2, 1, 1];
    return this.selectFromStats(3, 1, odds) + 1;
  }

  get decorations(): any[] {
    const tiles = [];

    // Banners
    const paddedBanner = this.bannerType > 9 ? `${this.bannerType}` : `0${this.bannerType}`;
    tiles.push({
      x: this.size,
      y: this.size - 1,
      imageSrc: require(`@/assets/map/banners/banner_${paddedBanner}a.png`),
      imageWidth: 50,
      imageFromBottom: 30,
      imageFromLeft: 30,
    },
    {
      x: this.size - 1,
      y: this.size,
      imageSrc: require(`@/assets/map/banners/banner_${paddedBanner}b.png`),
      imageWidth: 50,
      imageFromBottom: 30,
      imageFromLeft: 30,
    });

    const topRightDecorationTiles = {
      river: [{
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
      }],
      cairn: [{
        x: -1,
        y: 1,
        imageSrc: require('@/assets/map/architecture/cairn_01a.png'),
        imageWidth: 48,
        imageFromBottom: 7,
        imageFromLeft: 46,
      }],
      stonecircle: [{
        x: -1,
        y: 3,
        imageSrc: require('@/assets/map/architecture/stonecircle_01a.png'),
        imageWidth: 50,
        imageFromBottom: 11,
        imageFromLeft: 28,
      }],
      trees: [{
        x: -1,
        y: 0,
        imageSrc: require('@/assets/map/trees/tree_08.png'),
        imageWidth: 37,
        imageFromBottom: 26,
        imageFromLeft: 17,
      },
      {
        x: -1,
        y: 0,
        imageSrc: require('@/assets/map/trees/tree_01.png'),
        imageWidth: 36,
        imageFromBottom: 46,
        imageFromLeft: 41,
      },
      {
        x: -1,
        y: 0,
        imageSrc: require('@/assets/map/trees/tree_03.png'),
        imageWidth: 36,
        imageFromBottom: 13,
        imageFromLeft: 40,
      }],
      singletree: [{
        x: -1,
        y: 1,
        imageSrc: require('@/assets/map/trees/tree_04.png'),
        imageWidth: 48,
        imageFromBottom: 7,
        imageFromLeft: 46,
      }],
    };

    const topRightDecorations = [
      { name: 'none', odds: 50, tiles: [] },
      { name: 'river', odds: 2, tiles: topRightDecorationTiles.river },
      { name: 'stonecircle', odds: 5, tiles: topRightDecorationTiles.stonecircle },
      { name: 'cairn', odds: 5, tiles: topRightDecorationTiles.cairn },
      { name: 'stonecircle_cairn', odds: 2, tiles: [...topRightDecorationTiles.river, ...topRightDecorationTiles.cairn] },
      { name: 'trees', odds: 20, tiles: topRightDecorationTiles.trees },
      { name: 'trees_stonecircle', odds: 3, tiles: [...topRightDecorationTiles.trees, ...topRightDecorationTiles.stonecircle] },
      { name: 'singletree', odds: 8, tiles: topRightDecorationTiles.singletree },
      { name: 'trees_singletree', odds: 5, tiles: [...topRightDecorationTiles.trees, ...topRightDecorationTiles.singletree] },
    ];

    const selectedTopRightDecoration = this.selectFromStats(4, 2, topRightDecorations.map((x) => x.odds));
    tiles.push(...topRightDecorations[selectedTopRightDecoration].tiles);

    const topLeftDecorationTiles = {
      cairn: [{
        x: -1,
        y: 1,
        imageSrc: require('@/assets/map/architecture/cairn_01a.png'),
        imageWidth: 48,
        imageFromBottom: 7,
        imageFromLeft: 46,
      }],
      trees: [{
        x: this.size - 2,
        y: -1,
        imageSrc: require('@/assets/map/trees/tree_01.png'),
        imageWidth: 37,
        imageFromBottom: 26,
        imageFromLeft: 17,
      },
      {
        x: this.size - 2,
        y: -1,
        imageSrc: require('@/assets/map/trees/tree_04.png'),
        imageWidth: 36,
        imageFromBottom: 46,
        imageFromLeft: 41,
      },
      {
        x: this.size - 2,
        y: -1,
        imageSrc: require('@/assets/map/trees/tree_08.png'),
        imageWidth: 36,
        imageFromBottom: 5,
        imageFromLeft: 36,
      }],
      bushes: [{
        x: this.size - 2,
        y: -1,
        imageSrc: require('@/assets/map/trees/tree_09.png'),
        imageWidth: 25,
        imageFromBottom: 67,
        imageFromLeft: 32,
      },
      {
        x: this.size - 2,
        y: -1,
        imageSrc: require('@/assets/map/trees/tree_09.png'),
        imageWidth: 25,
        imageFromBottom: 54,
        imageFromLeft: 18,
      },
      {
        x: this.size - 2,
        y: -1,
        imageSrc: require('@/assets/map/trees/tree_09.png'),
        imageWidth: 25,
        imageFromBottom: 41,
        imageFromLeft: 4,
      }],
      graveyard: [{
        x: 1,
        y: -1,
        imageSrc: require('@/assets/map/architecture/graveyard_01a.png'),
        imageWidth: 83,
        imageFromBottom: 0,
        imageFromLeft: 12,
      }],
      well: [{
        x: 1,
        y: -1,
        imageSrc: require('@/assets/map/misc/well_03.png'),
        imageWidth: 48,
        imageFromBottom: 7,
        imageFromLeft: 46,
      }],
    };

    const topLeftDecorations = [
      { name: 'none', odds: 50, tiles: [] },
      { name: 'trees', odds: 20, tiles: topLeftDecorationTiles.trees },
      { name: 'bushes', odds: 20, tiles: topLeftDecorationTiles.bushes },
      { name: 'cairn', odds: 5, tiles: topLeftDecorationTiles.cairn },
      { name: 'graveyard', odds: 1, tiles: topLeftDecorationTiles.graveyard },
      { name: 'graveyard_bushes', odds: 1, tiles: [...topLeftDecorationTiles.graveyard, ...topLeftDecorationTiles.bushes] },
      { name: 'well', odds: 2, tiles: topLeftDecorationTiles.well },
      { name: 'well_bushes', odds: 1, tiles: [...topLeftDecorationTiles.well, ...topLeftDecorationTiles.bushes] },
    ];

    const selectedTopLeftDecoration = this.selectFromStats(6, 2, topLeftDecorations.map((x) => x.odds));
    tiles.push(...topLeftDecorations[selectedTopLeftDecoration].tiles);

    return tiles;
  }
}
