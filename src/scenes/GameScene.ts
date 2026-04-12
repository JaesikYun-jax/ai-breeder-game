import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(_data: Record<string, unknown>) {
    // receive data from MenuScene if needed
  }

  preload() {
    // dynamic asset loading if needed
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, 'GameScene — TBD', {
        fontSize: '24px',
        color: '#cccccc',
      })
      .setOrigin(0.5);

    // Launch HUD in parallel
    this.scene.launch('UIScene', { gameScene: this });

    // ESC → back to menu
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => {
      this.scene.stop('UIScene');
      this.scene.start('MenuScene');
    });
  }

  update(_time: number, _delta: number) {
    // main game loop
  }
}
