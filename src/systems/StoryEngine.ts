/**
 * StoryEngine — 스토리 노드 그래프 처리 엔진
 *
 * 책임:
 * - JSON 챕터 데이터 로드
 * - 노드 진행 (텍스트 → 선택지 → 다음 노드)
 * - 조건 평가 & 선택지 필터링
 * - 이벤트 실행 (플래그, 호감도, 사망, 엔딩, 지역 해금)
 * - 사망 → 회귀 트리거
 */

import type {
  StoryNode,
  ChapterData,
  Choice,
  RegionId,
  DialogueLine,
} from '../entities/StoryTypes';
import type {
  ConditionDef,
  GameEventDef,
  DeathType,
  GameSession,
  DialogueLogEntry,
} from '../entities/GameTypes';
import type { FlagManager } from './FlagManager';
import type { LoopManager } from './LoopManager';

// ─── 이벤트 콜백 ─────────────────────────────────────

export interface StoryEngineCallbacks {
  onNodeEnter(node: StoryNode): void;
  onDialogue(line: DialogueLine, index: number, total: number): void;
  onChoicesAvailable(choices: Choice[], metaChoices: Choice[]): void;
  onAutoAdvance(nextNodeId: string): void;
  onDeath(deathType: DeathType, deathText?: string): void;
  onEnding(endingId: string): void;
  onScreenEffect(effect: string, duration?: number): void;
  onPlaySound(soundKey: string): void;
  onMetaFlagUnlocked(flagId: string): void;
  onMelodyCollected(region: RegionId): void;
  onRegionUnlocked(region: RegionId, hint?: string): void;
}

// ─── StoryEngine 클래스 ──────────────────────────────

export class StoryEngine {
  private chapters: Map<string, ChapterData> = new Map();
  private currentNode: StoryNode | null = null;
  private currentDialogueIndex = 0;
  private session: GameSession;
  private flagManager: FlagManager;
  private loopManager: LoopManager;
  private callbacks: StoryEngineCallbacks;

  constructor(
    session: GameSession,
    flagManager: FlagManager,
    loopManager: LoopManager,
    callbacks: StoryEngineCallbacks,
  ) {
    this.session = session;
    this.flagManager = flagManager;
    this.loopManager = loopManager;
    this.callbacks = callbacks;
  }

  // ─── 챕터 로드 ───────────────────────────────────

  loadChapter(data: ChapterData): void {
    const key = `${data.region}_ch${data.chapter}`;
    this.chapters.set(key, data);
  }

  startChapter(region: RegionId, chapter: number): void {
    const key = `${region}_ch${chapter}`;
    const chapterData = this.chapters.get(key);
    if (!chapterData) {
      throw new Error(`Chapter not loaded: ${key}`);
    }

    this.session.currentRegion = region;
    this.session.currentChapter = chapter;
    this.processNode(chapterData.startNodeId);
  }

  // ─── 노드 처리 ───────────────────────────────────

  processNode(nodeId: string): void {
    const node = this.findNode(nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    if (node.condition && !this.evaluateCondition(node.condition)) {
      if (node.next) {
        this.processNode(node.next);
      }
      return;
    }

    this.currentNode = node;
    this.currentDialogueIndex = 0;
    this.session.currentNodeId = nodeId;

    if (!this.session.visitedNodes.includes(nodeId)) {
      this.session.visitedNodes.push(nodeId);
    }

    if (node.onEnter) {
      for (const event of node.onEnter) {
        this.executeEvent(event);
      }
    }

    if (node.bgm) {
      this.callbacks.onPlaySound(node.bgm);
    }
    if (node.sfx) {
      this.callbacks.onPlaySound(node.sfx);
    }

    this.callbacks.onNodeEnter(node);

    if (node.dialogue.length > 0) {
      this.showCurrentDialogue();
    } else {
      this.handlePostDialogue();
    }
  }

  // ─── 대사 진행 ───────────────────────────────────

  private showCurrentDialogue(): void {
    if (!this.currentNode) return;

    const line = this.currentNode.dialogue[this.currentDialogueIndex];
    if (!line) return;

    const logEntry: DialogueLogEntry = {
      nodeId: this.currentNode.id,
      speaker: line.speaker,
      text: line.text,
      timestamp: Date.now(),
    };
    this.session.dialogueHistory.push(logEntry);

    if (line.effect) {
      this.callbacks.onScreenEffect(line.effect);
    }
    if (line.sfx) {
      this.callbacks.onPlaySound(line.sfx);
    }

    this.callbacks.onDialogue(
      line,
      this.currentDialogueIndex,
      this.currentNode.dialogue.length,
    );
  }

  advanceDialogue(): void {
    if (!this.currentNode) return;

    this.currentDialogueIndex++;

    if (this.currentDialogueIndex < this.currentNode.dialogue.length) {
      this.showCurrentDialogue();
    } else {
      this.handlePostDialogue();
    }
  }

  private handlePostDialogue(): void {
    if (!this.currentNode) return;

    if (this.currentNode.onExit) {
      for (const event of this.currentNode.onExit) {
        this.executeEvent(event);
      }
    }

    if (this.currentNode.choices && this.currentNode.choices.length > 0) {
      const { normal, meta } = this.getAvailableChoices();
      this.callbacks.onChoicesAvailable(normal, meta);
    } else if (this.currentNode.next) {
      this.callbacks.onAutoAdvance(this.currentNode.next);
    }
  }

  // ─── 선택지 처리 ─────────────────────────────────

  getAvailableChoices(): { normal: Choice[]; meta: Choice[] } {
    if (!this.currentNode?.choices) return { normal: [], meta: [] };

    const normal: Choice[] = [];
    const meta: Choice[] = [];

    for (const choice of this.currentNode.choices) {
      if (choice.condition && !this.evaluateCondition(choice.condition)) {
        continue;
      }

      if (choice.metaCondition) {
        if (this.evaluateCondition(choice.metaCondition)) {
          meta.push(choice);
        }
        continue;
      }

      normal.push(choice);
    }

    return { normal, meta };
  }

  selectChoice(choice: Choice): void {
    if (this.currentNode) {
      const choiceIndex = this.currentNode.choices?.indexOf(choice) ?? -1;
      this.session.choiceHistory.push({
        nodeId: this.currentNode.id,
        choiceIndex,
      });
    }

    if (choice.effects) {
      for (const event of choice.effects) {
        this.executeEvent(event);
      }
    }

    this.processNode(choice.next);
  }

  // ─── 조건 평가 ───────────────────────────────────

  evaluateCondition(cond: ConditionDef): boolean {
    switch (cond.type) {
      case 'flag':
        return this.flagManager.getFlag(cond.flag) === (cond.value ?? true);

      case 'meta':
        return this.flagManager.getMetaFlag(cond.metaFlag);

      case 'loop':
        return this.loopManager.getLoopCount() >= cond.minLoop;

      case 'visited':
        return this.loopManager.hasVisitedRegion(cond.region);

      case 'affinity': {
        const aff = this.session.affinity[cond.character] ?? 0;
        if (cond.min !== undefined && aff < cond.min) return false;
        if (cond.max !== undefined && aff > cond.max) return false;
        return true;
      }

      case 'regionUnlocked':
        return this.loopManager.isRegionUnlocked(cond.region);

      case 'and':
        return cond.conditions.every((c) => this.evaluateCondition(c));

      case 'or':
        return cond.conditions.some((c) => this.evaluateCondition(c));

      case 'not':
        return !this.evaluateCondition(cond.condition);

      default:
        return false;
    }
  }

  // ─── 이벤트 실행 ─────────────────────────────────

  executeEvent(event: GameEventDef): void {
    switch (event.type) {
      case 'setFlag':
        this.flagManager.setFlag(event.flag, event.value);
        break;

      case 'setMeta': {
        const wasSet = this.flagManager.getMetaFlag(event.flag);
        this.flagManager.setMetaFlag(event.flag, event.value);
        if (!wasSet && event.value) {
          this.callbacks.onMetaFlagUnlocked(event.flag);
        }
        break;
      }

      case 'setAffinity': {
        const current = this.session.affinity[event.character] ?? 0;
        this.session.affinity[event.character] = Math.max(-100, Math.min(100,
          current + event.delta,
        ));
        break;
      }

      case 'unlockRegion':
        this.loopManager.unlockRegion(event.region);
        this.callbacks.onRegionUnlocked(event.region, event.hint);
        break;

      case 'playSound':
        this.callbacks.onPlaySound(event.sound);
        break;

      case 'screenEffect':
        this.callbacks.onScreenEffect(event.effect, event.duration);
        break;

      case 'death':
        this.callbacks.onDeath(event.deathType, event.deathText);
        break;

      case 'ending':
        this.callbacks.onEnding(event.endingId);
        break;

      case 'setBgm':
        this.callbacks.onPlaySound(event.bgm);
        break;

      case 'showCG':
        break;

      case 'unlockMelody':
        this.flagManager.setMetaFlag(`melody_${event.region}`, true);
        this.callbacks.onMelodyCollected(event.region);
        break;

      case 'addItem': {
        const qty = this.session.inventory[event.itemId] ?? 0;
        this.session.inventory[event.itemId] = qty + (event.quantity ?? 1);
        break;
      }
    }
  }

  // ─── 유틸리티 ────────────────────────────────────

  private findNode(nodeId: string): StoryNode | null {
    for (const chapter of this.chapters.values()) {
      if (chapter.nodes[nodeId]) {
        return chapter.nodes[nodeId];
      }
    }
    return null;
  }

  getCurrentNode(): StoryNode | null {
    return this.currentNode;
  }

  getSession(): GameSession {
    return this.session;
  }

  /** 세션 초기화 (새 루프) */
  resetSession(region: RegionId): GameSession {
    this.session = {
      currentRegion: region,
      currentChapter: 1,
      currentNodeId: '',
      flags: {},
      affinity: {},
      inventory: {},
      dialogueHistory: [],
      choiceHistory: [],
      visitedNodes: [],
    };
    return this.session;
  }
}
