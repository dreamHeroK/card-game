import { describe, it, expect, beforeEach } from 'vitest';
import { BattleSystem } from '../BattleSystem.js';

describe('BattleSystem', () => {
  let player;
  let enemy;
  let battle;

  beforeEach(() => {
    player = {
      hp: 80,
      maxHp: 80,
      deck: [
        { id: 'strike', name: '打击', type: 'attack', rarity: 'basic', cost: 1, damage: 6 },
        { id: 'strike', name: '打击', type: 'attack', rarity: 'basic', cost: 1, damage: 6 },
        { id: 'defend', name: '防御', type: 'skill', rarity: 'basic', cost: 1, block: 5 },
        { id: 'defend', name: '防御', type: 'skill', rarity: 'basic', cost: 1, block: 5 },
        { id: 'bash', name: '重击', type: 'attack', rarity: 'basic', cost: 2, damage: 8 }
      ],
      relics: [],
      strength: 0,
      weak: 0
    };

    enemy = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      block: 0,
      vulnerable: 0,
      weak: 0,
      intents: [
        { type: 'ritual', value: 3 },
        { type: 'attack', value: 6 }
      ]
    };

    battle = new BattleSystem(player, enemy);
    battle.initBattle();
  });

  it('应该正确初始化战斗', () => {
    expect(battle.playerTurn).toBe(true);
    expect(battle.energy).toBe(3);
    expect(battle.hand.length).toBe(5);
    expect(battle.enemies.length).toBe(1);
    expect(battle.enemies[0].hp).toBe(48);
  });

  it('应该能够打出卡牌', () => {
    const initialEnergy = battle.energy;
    const initialHandSize = battle.hand.length;
    const initialEnemyHp = battle.enemies[0].hp;

    // 找到一张有伤害的卡牌
    const attackCardIndex = battle.hand.findIndex(card => card.damage > 0);
    expect(attackCardIndex).toBeGreaterThanOrEqual(0); // 确保找到了攻击牌

    const card = battle.hand[attackCardIndex];
    const cardCost = card.cost || 0;

    const result = battle.playCard(attackCardIndex, 0);

    expect(result).toBeTruthy();
    expect(result.status).toBe(true);
    expect(battle.energy).toBe(initialEnergy - cardCost);
    expect(battle.hand.length).toBe(initialHandSize - 1);
    expect(battle.enemies[0].hp).toBeLessThan(initialEnemyHp);
  });

  it('应该正确计算伤害', () => {
    const initialHp = battle.enemies[0].hp;
    // 找到一张有6点伤害的卡牌（打击）
    const strikeCardIndex = battle.hand.findIndex(card => card.damage === 6);
    if (strikeCardIndex >= 0) {
      battle.playCard(strikeCardIndex, 0);
      expect(battle.enemies[0].hp).toBe(initialHp - 6);
    } else {
      // 如果没有找到，使用第一张有伤害的卡牌
      const attackCardIndex = battle.hand.findIndex(card => card.damage > 0);
      if (attackCardIndex >= 0) {
        const card = battle.hand[attackCardIndex];
        battle.playCard(attackCardIndex, 0);
        expect(battle.enemies[0].hp).toBe(initialHp - card.damage);
      }
    }
  });

  it('应该能够结束回合', () => {
    battle.playCard(0, 0); // 先打出一张牌
    
    const result = battle.endTurn();

    expect(battle.playerTurn).toBe(true); // 敌人回合后应该回到玩家回合
    expect(battle.hand.length).toBe(5); // 应该抽5张牌
    expect(battle.energy).toBe(3); // 应该恢复能量
    expect(typeof result).toBe('string'); // 应该返回状态字符串
  });

  it('应该在敌人生命值为0时结束战斗', () => {
    // 将敌人生命值设为0
    battle.enemies[0].hp = 0;

    const state = battle.checkBattleState();
    expect(state).toBe('victory');
  });

  it('应该在玩家生命值为0时结束战斗', () => {
    battle.player.hp = 0;

    const state = battle.checkBattleState();
    expect(state).toBe('defeat');
  });

  it('应该正确处理格挡', () => {
    const blockCard = battle.hand.find(card => card.id === 'defend');
    const blockIndex = battle.hand.indexOf(blockCard);
    
    if (blockIndex >= 0) {
      battle.playCard(blockIndex, 0);
      expect(battle.block).toBeGreaterThan(0);
    }
  });

  it('应该正确消耗能量', () => {
    const initialEnergy = battle.energy;
    const expensiveCard = battle.hand.find(card => card.cost === 2);
    
    if (expensiveCard) {
      const cardIndex = battle.hand.indexOf(expensiveCard);
      battle.playCard(cardIndex, 0);
      expect(battle.energy).toBe(initialEnergy - 2);
    }
  });
});

