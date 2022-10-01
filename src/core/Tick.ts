import * as THREE from "three";

export class Tick {
  clock = new THREE.Clock();
  game_callbacks: Function[] = [];
  ui_callbacks: Function[] = [];

  /**
   * State
   * */
  pausedGame = false;
  pausedUI = false;
  lastTimeUpdate: number = 0;

  constructor() {
    this.tick();
  }

  /**
   * Animates and updates objects
   * */
  tick = function () {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.lastTimeUpdate;
    this.lastTimeUpdate = elapsedTime;

    // Pause Game Feature
    if (!this.pausedGame) {
      this.game_callbacks.forEach((callback: Function) =>
        callback.bind(this, { elapsedTime, deltaTime })()
      );
    }

    // Pause UI Feature
    if (!this.pausedUI) {
      this.ui_callbacks.forEach((callback: Function) =>
        callback.bind(this, { elapsedTime, deltaTime })()
      );
    }

    // Loop
    window.requestAnimationFrame(this.tick.bind(this));
  };

  /**
   * Pauses game objects
   * */
  pauseGame() {
    this.pausedGame = true;
  }

  /**
   * Unpauses game objects
   * */
  unpauseGame() {
    this.pausedGame = false;
  }

  /**
   * Register a Tick callback
   * */
  registerCallback = function (callback: Function, game = true) {
    if (game) this.game_callbacks.push(callback);
    else this.ui_callbacks.push(callback);
  };

  /**
   * Deregister a Tick callback
   * */
  deregisterCallback(callback: Function, game = true) {
    if (game)
      this.game_callbacks = this.game_callbacks.filter(
        (thisCallback: Function) => thisCallback !== callback
      );
    else
      this.ui_callbacks = this.ui_callbacks.filter(
        (thisCallback: Function) => thisCallback !== callback
      );
  }
}

export interface TickTimeProperties {
  elapsedTime: number;
  deltaTime: number;
}
