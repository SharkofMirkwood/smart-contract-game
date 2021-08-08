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

  get bannerType(): number {
    console.log('this.stats', this.stats);
    const digits = parseInt(this.stats.substr(0, 2), 10);
    return digits;
  }
}
