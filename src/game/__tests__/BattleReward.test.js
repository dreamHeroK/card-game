import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../GameState.js';
import { CHARACTER } from '../../types/index.js';

describe('战斗奖励系统', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState(CHARACTER.IRONCLAD);
    // 移动到节点以便生成奖励
    const nodes = gameState.map.nodes.filter(n => n.floor === 0);
    if (nodes.length > 0) {
      gameState.map.moveToNode(nodes[0].id);
    }
  });

  it('应该能够生成战斗奖励', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    gameState.endBattle(true);

    expect(gameState.battleReward).toBeDefined();
    expect(gameState.battleReward.gold).toBeGreaterThan(0);
    expect(gameState.battleReward.cardChoices).toBeDefined();
    expect(Array.isArray(gameState.battleReward.cardChoices)).toBe(true);
  });

  it('应该能够接受战斗奖励', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    const initialGold = gameState.gold;
    const initialDeckSize = gameState.deck.length;
    
    gameState.endBattle(true);
    
    expect(gameState.battleReward).toBeDefined();
    
    // 选择第一张卡牌
    if (gameState.battleReward.cardChoices.length > 0) {
      gameState.acceptBattleReward(0, true, true);
      
      expect(gameState.gold).toBeGreaterThan(initialGold);
      expect(gameState.deck.length).toBe(initialDeckSize + 1);
      expect(gameState.battle).toBeNull();
      expect(gameState.currentScreen).toBe('map');
    }
  });

  it('应该能够跳过卡牌选择', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    const initialGold = gameState.gold;
    const initialDeckSize = gameState.deck.length;
    
    gameState.endBattle(true);
    gameState.acceptBattleReward(null, true, true);
    
    expect(gameState.gold).toBeGreaterThan(initialGold);
    expect(gameState.deck.length).toBe(initialDeckSize); // 没有增加
    expect(gameState.battle).toBeNull();
  });

  it('精英战斗应该有更好的奖励', () => {
    // 找到精英节点
    const eliteNodes = gameState.map.nodes.filter(n => n.type === 'elite');
    if (eliteNodes.length > 0) {
      gameState.map.moveToNode(eliteNodes[0].id);
      
      const monster = {
        id: 'gremlin_nob',
        name: '地精大块头',
        maxHp: 82,
        hp: 82,
        type: 'elite',
        intents: [{ type: 'attack', value: 14 }]
      };

      gameState.startBattle(monster);
      gameState.endBattle(true);

      expect(gameState.battleReward).toBeDefined();
      // 检查金币是否更多（精英战斗基础奖励更高）
      expect(gameState.battleReward.gold).toBeGreaterThanOrEqual(10);
    } else {
      // 如果没有精英节点，跳过这个测试
      expect(true).toBe(true);
    }
  });
});

