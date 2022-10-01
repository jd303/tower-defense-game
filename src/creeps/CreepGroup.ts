import { Creep } from "./Creep";

export class CreepGroup {
  /**
   * Stats
   * */
  id: string;
  creeps: Creep[] = [];

  /**
   * Constructor
   * */
  constructor(id: string) {
    this.id = id;

    return this;
  }
}
