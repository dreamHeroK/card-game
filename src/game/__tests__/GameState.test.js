import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../GameState.js';
import { CHARACTER } from '../../types/index.js';

describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState(CHARACTER.IRONCLAD);
  });

  it('应该正确初始化游戏状态', () => {
    expect(gameState.character).toBe(CHARACTER.IRONCLAD);
    expect(gameState.hp).toBe(80);
    expect(gameState.maxHp).toBe(80);
    expect(gameState.gold).toBe(99);
    expect(gameState.deck.length).toBeGreaterThan(0);
    expect(gameState.relics.length).toBe(1);
  });

  it('应该能够开始战斗', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    const battle = gameState.startBattle(monster);

    expect(battle).toBeDefined();
    expect(gameState.currentScreen).toBe('battle');
    expect(gameState.battle).toBe(battle);
  });

  it('应该能够结束战斗', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    const initialGold = gameState.gold;
    
    // 需要先移动到节点才能生成奖励
    const nodes = gameState.map.nodes.filter(n => n.floor === 0);
    if (nodes.length > 0) {
      gameState.map.moveToNode(nodes[0].id);
    }
    
    gameState.endBattle(true);

    // 胜利时显示奖励界面，battle暂时保留
    expect(gameState.battleReward).toBeDefined();
    expect(gameState.currentScreen).toBe('battle_reward');
    expect(gameState.battleReward.gold).toBeGreaterThan(0);
    
    // 接受奖励后清除
    gameState.acceptBattleReward(null, true, true);
    expect(gameState.battle).toBeNull();
    expect(gameState.currentScreen).toBe('map');
    expect(gameState.gold).toBeGreaterThan(initialGold);
  });

  it('应该能够进入商店', () => {
    gameState.enterShop();

    expect(gameState.currentScreen).toBe('shop');
    expect(gameState.shop).toBeDefined();
  });

  it('应该能够进入休息处', () => {
    gameState.enterRest();

    expect(gameState.currentScreen).toBe('rest');
  });
});
