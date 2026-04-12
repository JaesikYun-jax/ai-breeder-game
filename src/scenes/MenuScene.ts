import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 80, 'GAME TITLE', {
        fontSize: '64px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const startBtn = this.add
      .text(width / 2, height / 2 + 40, '[ START ]', {
        fontSize: '32px',
        color: '#aaaaff',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startBtn.on('pointerover', () => startBtn.setColor('#ffffff'));
    startBtn.on('pointerout', () => startBtn.setColor('#aaaaff'));
    startBtn.on('pointerdown', () => this.scene.start('GameScene'));
  }
}
