import * as Phaser from 'phaser';
import { GameConfig } from './config/GameConfig';

const game = new Phaser.Game(GameConfig);

// 디버그: 콘솔에서 game 인스턴스 접근 가능
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__PHASER_GAME__ = game;
}
