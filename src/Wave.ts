import { Creep } from "./creeps/Creep";
import { CreepGroup } from "./creeps/CreepGroup";
import { LevelPath } from "./LevelPath";

export class Wave {
  /**
   * Wave Properties
   * */
  corePath: LevelPath;
  duration: number;
  creepGroups: CreepGroup[] = [];

  /**
   * Constructor
   * */
  constructor() {}

  /**
   * Add Creep
   * */
  addCreep(creep: Creep, groupID: string) {
    let group = this.creepGroups.find((group) => group.id == groupID);
    if (!group) {
      const newGroup = new CreepGroup(groupID);
      this.creepGroups.push(newGroup);
    } else {
      this.creepGroups.push(group);
    }
  }

  /**
   * Launches a wave
   * */
  launchWave() {}
}
