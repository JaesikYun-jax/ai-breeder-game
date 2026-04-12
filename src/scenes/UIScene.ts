import Phaser from 'phaser';

interface UISceneData {
  gameScene?: Phaser.Scene;
}

export class UIScene extends Phaser.Scene {
  private gameScene?: Phaser.Scene;

  constructor() {
    super({ key: 'UIScene' });
  }

  init(data: UISceneData) {
    this.gameScene = data.gameScene;
  }

  create() {
    // HUD elements go here
    // e.g. score, health bar, minimap
    void this.gameScene;
  }

  update(_time: number, _delta: number) {
    // sync HUD state with game
  }
}
