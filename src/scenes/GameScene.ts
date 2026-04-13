/**
 * GameScene — 스토리 플레이 모듈 (MVP)
 *
 * 그래픽 최소: 텍스트 기반 대사 표시 + 선택지 + 화면 이펙트만 구현
 * StoryEngine ↔ Phaser 렌더링 연결
 */

import * as Phaser from 'phaser';
import { StoryEngine, type StoryEngineCallbacks } from '../systems/StoryEngine';
import { FlagManager } from '../systems/FlagManager';
import { LoopManager } from '../systems/LoopManager';
import type {
  StoryNode,
  DialogueLine,
  Choice,
  ChapterData,
  RegionId,
} from '../entities/StoryTypes';
import type { DeathType, GameSession } from '../entities/GameTypes';
import {
  TEXT_SPEED,
  GAME_WIDTH,
  GAME_HEIGHT,
  UI_LAYOUT,
  META_CHOICE_STYLE,
} from '../config/Constants';
import prologueData from '../data/story/shared/prologue.json';
import azeliaIntroData from '../data/story/azelia/ch1_intro.json';

export class GameScene extends Phaser.Scene {
  // ─── Systems ──────────────────────────────────────
  private storyEngine!: StoryEngine;
  private flagManager!: FlagManager;
  private loopManager!: LoopManager;

  // ─── Dialogue UI ──────────────────────────────────
  private dialogueBox!: Phaser.GameObjects.Rectangle;
  private speakerText!: Phaser.GameObjects.Text;
  private dialogueText!: Phaser.GameObjects.Text;
  private continueIndicator!: Phaser.GameObjects.Text;

  // ─── Choice UI ────────────────────────────────────
  private choiceContainer!: Phaser.GameObjects.Container;

  // ─── State ────────────────────────────────────────
  private isTyping = false;
  private typewriterTimer?: Phaser.Time.TimerEvent;
  private fullText = '';
  private currentCharIndex = 0;
  private waitingForInput = false;
  private waitingForChoice = false;
  private inputLocked = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Systems
    this.flagManager = new FlagManager();
    this.loopManager = new LoopManager();

    const session: GameSession = {
      currentRegion: 'azelia',
      currentChapter: 0,
      currentNodeId: '',
      flags: {},
      affinity: {},
      inventory: {},
      dialogueHistory: [],
      choiceHistory: [],
      visitedNodes: [],
    };

    this.storyEngine = new StoryEngine(
      session,
      this.flagManager,
      this.loopManager,
      this.createCallbacks(),
    );

    // UI
    this.buildDialogueUI();
    this.choiceContainer = this.add.container(0, 0).setDepth(20);
    this.setupInput();

    // HUD
    this.scene.launch('UIScene', { loopManager: this.loopManager });

    // Story start — load all available chapters
    this.storyEngine.loadChapter(prologueData as unknown as ChapterData);
    this.storyEngine.loadChapter(azeliaIntroData as unknown as ChapterData);
    this.storyEngine.processNode(prologueData.startNodeId);
  }

  // ─── Dialogue UI ──────────────────────────────────

  private buildDialogueUI(): void {
    const box = UI_LAYOUT.DIALOGUE_BOX;

    // Semi-transparent box
    this.dialogueBox = this.add
      .rectangle(
        box.x + box.width / 2,
        box.y + box.height / 2,
        box.width - 40,
        box.height - 20,
        0x000000,
        0.75,
      )
      .setStrokeStyle(1, 0x555577)
      .setDepth(5);

    // Speaker name
    this.speakerText = this.add
      .text(box.x + box.padding + 20, box.y + 12, '', {
        fontSize: '18px',
        color: '#88ccff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setDepth(10);

    // Dialogue text (typewriter target)
    this.dialogueText = this.add
      .text(box.x + box.padding + 20, box.y + 42, '', {
        fontSize: '22px',
        color: '#e0e0e0',
        fontFamily: 'monospace',
        wordWrap: { width: box.width - 100 },
        lineSpacing: 8,
      })
      .setDepth(10);

    // ▼ blink indicator
    this.continueIndicator = this.add
      .text(GAME_WIDTH - 80, GAME_HEIGHT - 40, '▼', {
        fontSize: '18px',
        color: '#aaaaff',
        fontFamily: 'monospace',
      })
      .setDepth(10)
      .setVisible(false);

    this.tweens.add({
      targets: this.continueIndicator,
      alpha: { from: 1, to: 0.3 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });
  }

  // ─── Input ────────────────────────────────────────

  private setupInput(): void {
    this.input.on('pointerdown', () => this.handleAdvance());

    const kb = this.input.keyboard;
    if (!kb) return;

    kb.addKey('ENTER').on('down', () => this.handleAdvance());
    kb.addKey('SPACE').on('down', () => this.handleAdvance());
    kb.addKey('ONE').on('down', () => this.pickChoice(0));
    kb.addKey('TWO').on('down', () => this.pickChoice(1));
    kb.addKey('THREE').on('down', () => this.pickChoice(2));

    kb.addKey('ESC').on('down', () => {
      this.scene.stop('UIScene');
      this.scene.start('MenuScene');
    });
  }

  private handleAdvance(): void {
    if (this.waitingForChoice || this.inputLocked) return;

    if (this.isTyping) {
      this.finishTypewriter();
      return;
    }

    if (this.waitingForInput) {
      this.waitingForInput = false;
      this.continueIndicator.setVisible(false);
      this.storyEngine.advanceDialogue();
    }
  }

  private pickChoice(index: number): void {
    if (!this.waitingForChoice) return;
    const choices = this.choiceContainer.getData('choices') as Choice[] | undefined;
    if (choices && index < choices.length) {
      this.doSelectChoice(choices[index]);
    }
  }

  // ─── Typewriter ───────────────────────────────────

  private startTypewriter(text: string, speedMs: number): void {
    this.isTyping = true;
    this.fullText = text;
    this.currentCharIndex = 0;
    this.dialogueText.setText('');
    this.waitingForInput = false;
    this.continueIndicator.setVisible(false);

    this.typewriterTimer = this.time.addEvent({
      delay: speedMs,
      repeat: text.length - 1,
      callback: () => {
        this.currentCharIndex++;
        this.dialogueText.setText(this.fullText.substring(0, this.currentCharIndex));
        if (this.currentCharIndex >= this.fullText.length) {
          this.finishTypewriter();
        }
      },
    });
  }

  private finishTypewriter(): void {
    this.typewriterTimer?.destroy();
    this.typewriterTimer = undefined;
    this.isTyping = false;
    this.dialogueText.setText(this.fullText);
    this.waitingForInput = true;
    this.continueIndicator.setVisible(true);
  }

  // ─── Choice Display ───────────────────────────────

  private showChoices(normal: Choice[], meta: Choice[]): void {
    this.waitingForChoice = true;
    this.waitingForInput = false;
    this.continueIndicator.setVisible(false);
    this.clearChoices();
    this.setDialogueVisible(false);

    const all = [...normal, ...meta];
    const cb = UI_LAYOUT.CHOICE_BOX;
    const startY = cb.y;

    all.forEach((choice, i) => {
      const isMeta = meta.includes(choice);
      const y = startY + i * (cb.itemHeight + cb.itemGap);

      const bg = this.add
        .rectangle(GAME_WIDTH / 2, y, cb.width, cb.itemHeight, 0x222244, 0.85)
        .setStrokeStyle(1, isMeta ? 0xc5a0ff : 0x555577)
        .setInteractive({ useHandCursor: true });

      const prefix = isMeta && choice.metaLabel ? `${choice.metaLabel} ` : '';
      const label = `${i + 1}. ${prefix}${choice.text}`;

      const txt = this.add
        .text(GAME_WIDTH / 2, y, label, {
          fontSize: '20px',
          color: isMeta ? META_CHOICE_STYLE.textColor : '#cccccc',
          fontFamily: 'monospace',
          align: 'center',
          wordWrap: { width: cb.width - 40 },
        })
        .setOrigin(0.5);

      bg.on('pointerover', () => {
        bg.setFillStyle(0x334466, 0.95);
        txt.setColor('#ffffff');
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(0x222244, 0.85);
        txt.setColor(isMeta ? META_CHOICE_STYLE.textColor : '#cccccc');
      });
      bg.on('pointerdown', () => this.doSelectChoice(choice));

      this.choiceContainer.add([bg, txt]);
    });

    this.choiceContainer.setData('choices', all);
  }

  private doSelectChoice(choice: Choice): void {
    // Lock input briefly so scene-level pointerdown doesn't also fire
    this.inputLocked = true;
    this.time.delayedCall(50, () => { this.inputLocked = false; });

    this.waitingForChoice = false;
    this.clearChoices();
    this.setDialogueVisible(true);

    try {
      this.storyEngine.selectChoice(choice);
    } catch {
      this.showEndScreen();
    }
  }

  private clearChoices(): void {
    this.choiceContainer.removeAll(true);
    this.choiceContainer.setData('choices', null);
  }

  // ─── Visibility ───────────────────────────────────

  private setDialogueVisible(visible: boolean): void {
    this.dialogueBox.setVisible(visible);
    this.speakerText.setVisible(visible);
    this.dialogueText.setVisible(visible);
  }

  // ─── End / Death Screens ──────────────────────────

  private showEndScreen(): void {
    this.resetState();

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, '— To be continued —', {
        fontSize: '32px',
        color: '#8888cc',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(50);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, '프롤로그 완료', {
        fontSize: '20px',
        color: '#666688',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(50);

    const hint = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 70, 'ENTER — 타이틀로', {
        fontSize: '16px',
        color: '#555577',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(50);

    this.tweens.add({
      targets: hint,
      alpha: { from: 0.5, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.bindExitInput();
  }

  private showDeathScreen(deathText?: string): void {
    this.resetState();
    this.cameras.main.flash(500, 200, 0, 0);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, deathText ?? '당신은 죽었습니다.', {
        fontSize: '28px',
        color: '#ff4444',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(50);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, '회귀합니다...', {
        fontSize: '18px',
        color: '#884444',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(50);

    this.input.removeAllListeners();
    this.input.keyboard?.removeAllListeners();

    this.time.delayedCall(3000, () => {
      this.scene.stop('UIScene');
      this.scene.restart();
    });
  }

  private showEndingScreen(endingId: string): void {
    this.resetState();

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, `엔딩 해금: ${endingId}`, {
        fontSize: '28px',
        color: '#ffdd44',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(50);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 'ENTER — 타이틀로', {
        fontSize: '16px',
        color: '#888866',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(50);

    this.bindExitInput();
  }

  /** 공통: 상태 초기화, UI 숨김 */
  private resetState(): void {
    this.waitingForInput = false;
    this.waitingForChoice = false;
    this.isTyping = false;
    this.typewriterTimer?.destroy();
    this.clearChoices();
    this.setDialogueVisible(false);
    this.continueIndicator.setVisible(false);
  }

  /** 공통: ENTER/클릭 → 메뉴 이동 */
  private bindExitInput(): void {
    this.input.removeAllListeners();
    this.input.keyboard?.removeAllListeners();

    const goMenu = () => {
      this.scene.stop('UIScene');
      this.scene.start('MenuScene');
    };

    this.input.on('pointerdown', goMenu);
    this.input.keyboard?.addKey('ENTER').on('down', goMenu);
  }

  // ─── Screen Effects (MVP: minimal) ────────────────

  private playEffect(effect: string, duration?: number): void {
    const dur = duration ?? 300;
    const cam = this.cameras.main;

    switch (effect) {
      case 'shake':
        cam.shake(dur, 0.01);
        break;
      case 'flash':
        cam.flash(dur, 255, 255, 255);
        break;
      case 'fade':
        cam.fadeOut(dur / 2, 0, 0, 0);
        this.time.delayedCall(dur / 2, () => cam.fadeIn(dur / 2, 0, 0, 0));
        break;
      case 'glitch':
        cam.flash(100, 150, 50, 255);
        break;
      case 'redVignette':
        cam.flash(dur, 200, 0, 0);
        break;
    }
  }

  // ─── Notification Toast ───────────────────────────

  private showNotification(text: string, color: string): void {
    const notif = this.add
      .text(GAME_WIDTH / 2, 50, text, {
        fontSize: '16px',
        color,
        fontFamily: 'monospace',
        backgroundColor: '#000000',
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5)
      .setAlpha(0.9)
      .setDepth(100);

    this.tweens.add({
      targets: notif,
      alpha: 0,
      y: 30,
      duration: 2000,
      delay: 1500,
      onComplete: () => notif.destroy(),
    });
  }

  // ─── StoryEngine Callbacks ────────────────────────

  private createCallbacks(): StoryEngineCallbacks {
    return {
      onNodeEnter: (_node: StoryNode) => {
        // MVP: no visual changes per node
      },

      onDialogue: (line: DialogueLine, _index: number, _total: number) => {
        // Speaker
        if (line.speaker) {
          this.speakerText.setText(line.speaker).setVisible(true);
        } else {
          this.speakerText.setText('').setVisible(false);
        }

        // Style
        let color = '#e0e0e0';
        let text = line.text;

        switch (line.style) {
          case 'narration':
            color = '#aaaaaa';
            break;
          case 'monologue':
            color = '#88aadd';
            break;
          case 'whisper':
            color = '#7766aa';
            break;
          case 'system':
            color = '#ff6666';
            break;
        }

        this.dialogueText.setColor(color);

        // Effect
        if (line.effect) {
          this.playEffect(line.effect);
        }

        // Typewriter
        const speed = TEXT_SPEED[line.speed ?? 'normal'];
        this.startTypewriter(text, speed);

        // Auto-advance (e.g. "..." with 2000ms pause)
        if (line.autoDelay !== undefined) {
          const totalMs = text.length * speed + line.autoDelay;
          this.time.delayedCall(totalMs, () => {
            if (this.waitingForInput) {
              this.waitingForInput = false;
              this.continueIndicator.setVisible(false);
              this.storyEngine.advanceDialogue();
            }
          });
        }
      },

      onChoicesAvailable: (choices: Choice[], metaChoices: Choice[]) => {
        this.showChoices(choices, metaChoices);
      },

      onAutoAdvance: (nextNodeId: string) => {
        try {
          this.storyEngine.processNode(nextNodeId);
        } catch {
          this.showEndScreen();
        }
      },

      onDeath: (deathType: DeathType, deathText?: string) => {
        this.loopManager.recordDeath(deathType);
        this.loopManager.incrementLoop();
        this.flagManager.resetSessionFlags();
        this.showDeathScreen(deathText);
      },

      onEnding: (endingId: string) => {
        this.loopManager.unlockEnding(endingId);
        this.showEndingScreen(endingId);
      },

      onScreenEffect: (effect: string, duration?: number) => {
        this.playEffect(effect, duration);
      },

      onPlaySound: (_key: string) => {
        // MVP: no audio
      },

      onMetaFlagUnlocked: (flagId: string) => {
        this.showNotification(`메타 플래그 해금: ${flagId}`, '#ffd700');
      },

      onMelodyCollected: (region: RegionId) => {
        this.showNotification(`♪ 멜로디 수집: ${region}`, '#88ff88');
      },

      onRegionUnlocked: (_region: RegionId, hint?: string) => {
        this.showNotification(hint ?? '새로운 지역이 해금되었습니다', '#88ccff');
      },
    };
  }
}
