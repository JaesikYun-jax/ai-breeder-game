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

    // Chapter list
    const chapters = [
      '1화. 트럭이 오는 건 알고 있었다',
      '2화. 아젤리아 왕궁의 밤은 길다',
      '3화. 용사라는 직업의 현실',
      '4화. 이 세계에도 편의점은 없다',
      '5화. 축복이라 쓰고 제물이라 읽는다',
    ];

    const startY = height / 2 + 20;
    chapters.forEach((title, i) => {
      const btn = this.add
        .text(width / 2, startY + i * 36, title, {
          fontSize: '18px',
          color: '#8888aa',
          fontFamily: 'monospace',
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setColor('#ffffff'));
      btn.on('pointerout', () => btn.setColor('#8888aa'));
      btn.on('pointerdown', () => this.scene.start('ReaderScene', { chapter: i }));
    });
  }
}
