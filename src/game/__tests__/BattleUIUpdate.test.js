import { describe, it, expect, beforeEach } from 'vitest';
import { BattleSystem } from '../BattleSystem.js';

describe('战斗UI更新和伤害显示测试', () => {
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

  it('应该返回正确的伤害信息结构', () => {
    const attackCard = battle.hand.find(card => card.damage > 0);
    expect(attackCard).toBeDefined();
    
    const cardIndex = battle.hand.indexOf(attackCard);
    const initialEnemyHp = battle.enemies[0].hp;
    
    const result = battle.playCard(cardIndex, 0);
    
    // 验证返回结构
    expect(result).toBeDefined();
    expect(result.status).toBe(true);
    expect(result.damageInfo).toBeDefined();
    expect(result.damageInfo.targetIndex).toBe(0);
    expect(result.damageInfo.displayedDamage).toBeGreaterThan(0);
    expect(result.damageInfo.actualDamage).toBeGreaterThanOrEqual(0);
    
    // 验证敌人生命值确实减少了
    expect(battle.enemies[0].hp).toBeLessThan(initialEnemyHp);
  });

  it('应该正确计算和返回显示的伤害值', () => {
    const attackCard = battle.hand.find(card => card.damage > 0);
    const cardIndex = battle.hand.indexOf(attackCard);
    const initialHp = battle.enemies[0].hp;
    
    const result = battle.playCard(cardIndex, 0);
    
    expect(result.damageInfo.displayedDamage).toBe(attackCard.damage);
    expect(result.damageInfo.actualDamage).toBeGreaterThanOrEqual(0);
    expect(result.damageInfo.actualDamage).toBeLessThanOrEqual(result.damageInfo.displayedDamage);
    
    // 验证生命值减少等于实际伤害
    const hpLost = initialHp - battle.enemies[0].hp;
    expect(hpLost).toBe(result.damageInfo.actualDamage);
  });

  it('应该在有易伤时正确计算伤害', () => {
    // 给敌人添加易伤
    battle.enemies[0].vulnerable = 2;
    
    const attackCard = battle.hand.find(card => card.damage > 0);
    const cardIndex = battle.hand.indexOf(attackCard);
    
    const result = battle.playCard(cardIndex, 0);
    
    // 易伤应该让伤害增加50%
    const expectedDamage = Math.floor(attackCard.damage * 1.5);
    expect(result.damageInfo.displayedDamage).toBe(expectedDamage);
  });

  it('应该在有虚弱时正确计算伤害', () => {
    // 给玩家添加虚弱
    battle.player.weak = 1;
    
    const attackCard = battle.hand.find(card => card.damage > 0);
    const cardIndex = battle.hand.indexOf(attackCard);
    
    const result = battle.playCard(cardIndex, 0);
    
    // 虚弱应该让伤害减少25%
    const expectedDamage = Math.floor(attackCard.damage * 0.75);
    expect(result.damageInfo.displayedDamage).toBe(expectedDamage);
  });

  it('应该在有格挡时正确计算实际伤害', () => {
    // 给敌人添加格挡
    battle.enemies[0].block = 3;
    
    const attackCard = battle.hand.find(card => card.damage > 0);
    const cardIndex = battle.hand.indexOf(attackCard);
    
    const result = battle.playCard(cardIndex, 0);
    
    // 实际伤害应该考虑格挡
    expect(result.damageInfo.displayedDamage).toBe(attackCard.damage);
    expect(result.damageInfo.actualDamage).toBeLessThanOrEqual(result.damageInfo.displayedDamage);
    expect(result.damageInfo.blocked).toBeGreaterThan(0);
  });

  it('应该在手牌变化后正确更新', () => {
    const initialHandSize = battle.hand.length;
    const attackCard = battle.hand.find(card => card.damage > 0);
    const cardIndex = battle.hand.indexOf(attackCard);
    
    battle.playCard(cardIndex, 0);
    
    // 手牌应该减少1
    expect(battle.hand.length).toBe(initialHandSize - 1);
    // 手牌中不应该再包含打出的卡牌
    expect(battle.hand.find(card => card.id === attackCard.id && card === attackCard)).toBeUndefined();
  });

  it('应该在能量消耗后正确更新', () => {
    const initialEnergy = battle.energy;
    const attackCard = battle.hand.find(card => card.damage > 0);
    const cardIndex = battle.hand.indexOf(attackCard);
    
    battle.playCard(cardIndex, 0);
    
    // 能量应该减少
    expect(battle.energy).toBe(initialEnergy - attackCard.cost);
  });

  it('应该正确更新buff状态', () => {
    // 给敌人添加易伤
    battle.enemies[0].vulnerable = 2;
    battle.enemies[0].weak = 1;
    
    // 结束回合
    battle.endTurn();
    
    // 易伤和虚弱应该减少1
    expect(battle.enemies[0].vulnerable).toBe(1);
    expect(battle.enemies[0].weak).toBe(0);
  });
});

