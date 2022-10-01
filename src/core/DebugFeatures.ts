import * as lil from "lil-gui";
import { Tick } from "./Tick";

export class DebugFeatures {
  /**
   * Properties
   * */
  lilGUI: lil.GUI;

  /**
   * Constructor
   * */
  constructor(debugMode: boolean, tick: Tick) {
    if (debugMode) {
      this.lilGUI = new lil.GUI();

      this.lilGUI.add(tick, "pauseGame").name("Pause Game");
      this.lilGUI.add(tick, "unpauseGame").name("Unpause Game");
    }

    return this;
  }

  addGUIDebugProperty(
    objectParent: any,
    property: string,
    name: string | null = null
  ) {
    this.lilGUI.add(objectParent, property).name(name || property);
  }

  addGUIDebugFunction(
    objectParent: any,
    property: string,
    callback: Function,
    name: string | null = null
  ) {
    this.lilGUI.add(objectParent, property).name(name || property);
  }
}
