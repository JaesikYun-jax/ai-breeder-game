import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const { width, height } = this.scale;
    const bar = this.add.rectangle(width / 2, height / 2, 400, 20, 0x444466);
    const fill = this.add.rectangle(width / 2 - 200, height / 2, 0, 18, 0x8888ff);

    this.load.on('progress', (value: number) => {
      fill.width = 400 * value;
      fill.x = width / 2 - 200 + fill.width / 2;
    });

    // TODO: load assets here
    // this.load.image('key', 'assets/image.png');
    // this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });

    void bar;
  }

  create() {
    this.scene.start('MenuScene');
  }
}
