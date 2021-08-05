/* eslint-disable import/prefer-default-export */
export class Village {
  villageId: number;

  baseGoldRate: number;

  buildings: any[];

  name: string;

  readyToMineTime: Date;

  size: number;

  x: number;

  y: number;

  constructor(villageId: number, villageData: any) {
    this.villageId = villageId;
    this.buildings = villageData.buildings;
    this.name = villageData.name;
    this.readyToMineTime = new Date(parseInt(villageData.readyToMineTime, 10) * 1000);
    this.baseGoldRate = parseInt(villageData.baseGoldRate, 10);
    this.size = parseInt(villageData.size, 10);
    this.x = parseInt(villageData.x, 10);
    this.y = parseInt(villageData.y, 10);
  }
}
