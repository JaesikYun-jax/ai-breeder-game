/**
 * UIScene — 최소 HUD 오버레이 (MVP)
 *
 * GameScene과 병렬 실행, 루프 카운트 + ESC 힌트 표시
 */

import * as Phaser from 'phaser';
import type { LoopManager } from '../systems/LoopManager';

interface UISceneData {
  loopManager?: LoopManager;
}

export class UIScene extends Phaser.Scene {
  private loopCount = 0;

  constructor() {
    super({ key: 'UIScene' });
  }

  init(data: UISceneData) {
    this.loopCount = data.loopManager?.getLoopCount() ?? 0;
  }

  create() {
    const { width } = this.scale;

    this.add
      .text(16, 10, `Loop: ${this.loopCount}`, {
        fontSize: '14px',
        color: '#555577',
        fontFamily: 'monospace',
      })
      .setDepth(100);

    this.add
      .text(width - 16, 10, 'ESC: 메뉴', {
        fontSize: '14px',
        color: '#444455',
        fontFamily: 'monospace',
      })
      .setOrigin(1, 0)
      .setDepth(100);
  }
}
