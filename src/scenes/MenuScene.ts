import * as Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Title
    this.add
      .text(width / 2, height / 2 - 100, '이세계 회귀', {
        fontSize: '48px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 50, 'AI Breeder', {
        fontSize: '20px',
        color: '#666688',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    // Read button
    const readBtn = this.add
      .text(width / 2, height / 2 + 40, '[ 읽기 ]', {
        fontSize: '28px',
        color: '#aaaaff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    readBtn.on('pointerover', () => readBtn.setColor('#ffffff'));
    readBtn.on('pointerout', () => readBtn.setColor('#aaaaff'));
    readBtn.on('pointerdown', () => this.scene.start('ReaderScene'));

    // Subtitle
    this.add
      .text(width / 2, height / 2 + 90, '1화. 트럭이 오는 건 알고 있었다', {
        fontSize: '16px',
        color: '#555577',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);
  }
}
