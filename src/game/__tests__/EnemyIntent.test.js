import { describe, it, expect, beforeEach } from 'vitest';
import { BattleSystem } from '../BattleSystem.js';
import { GameState } from '../GameState.js';
import { CHARACTER } from '../../types/index.js';

describe('敌人意图显示', () => {
  let player;
  let enemy;
  let battle;

  beforeEach(() => {
    player = new GameState(CHARACTER.IRONCLAD);
    enemy = {
      id: 'cultist',
      name: '邪教徒',
      hp: 48,
      maxHp: 48,
      block: 0,
      vulnerable: 0,
      weak: 0,
      strength: 0,
      intents: [
        { type: 'ritual', value: 3 },
        { type: 'attack', value: 6 }
      ],
      turnPattern: [0, 1]
    };
    battle = new BattleSystem(player, [enemy]);
    battle.initBattle();
  });

  it('应该能够获取敌人当前回合的意图', () => {
    // 设置turn为1（第一回合）
    battle.turn = 1;
    const intent = battle.getEnemyIntent(enemy);
    expect(intent).toBeDefined();
    expect(intent.type).toBeDefined();
    expect(intent.icon).toBeDefined();
    expect(intent.text).toBeDefined();
  });

  it('第一回合应该显示第一个意图（ritual）', () => {
    // 第一回合（turn = 1），应该显示turnPattern[0]对应的意图
    battle.turn = 1;
    const intent = battle.getEnemyIntent(enemy);
    expect(intent).toBeDefined();
    expect(intent.type).toBe('buff');
    expect(intent.text).toContain('强化');
  });

  it('第二回合应该显示第二个意图（attack）', () => {
    // 第二回合（turn = 2），应该显示turnPattern[1]对应的意图
    battle.turn = 2;
    const intent = battle.getEnemyIntent(enemy);
    expect(intent).toBeDefined();
    expect(intent.type).toBe('attack');
    expect(intent.text).toContain('攻击');
  });

  it('攻击意图应该包含伤害值', () => {
    battle.turn = 2;
    const intent = battle.getEnemyIntent(enemy);
    expect(intent.type).toBe('attack');
    expect(intent.damage).toBe(6); // 基础伤害
    expect(intent.text).toContain('6');
  });

  it('有力量的敌人攻击意图应该包含力量加成', () => {
    enemy.strength = 3;
    battle.turn = 2;
    const intent = battle.getEnemyIntent(enemy);
    expect(intent.type).toBe('attack');
    expect(intent.damage).toBe(9); // 6 + 3
    expect(intent.text).toContain('9');
  });

  it('应该正确格式化强化意图', () => {
    battle.turn = 1;
    const intent = battle.getEnemyIntent(enemy);
    expect(intent.type).toBe('buff');
    expect(intent.icon).toBe('⬆️');
    expect(intent.text).toContain('强化');
    expect(intent.value).toBe(3);
  });

  it('应该正确格式化虚弱意图', () => {
    const weakEnemy = {
      ...enemy,
      intents: [{ type: 'weak', value: 1 }],
      turnPattern: [0]
    };
    battle.turn = 1;
    const intent = battle.getEnemyIntent(weakEnemy);
    expect(intent.type).toBe('debuff');
    expect(intent.icon).toBe('⬇️');
    expect(intent.text).toBe('虚弱');
  });

  it('应该正确格式化格挡意图', () => {
    const blockEnemy = {
      ...enemy,
      intents: [{ type: 'charge_up', value: 15 }],
      turnPattern: [0]
    };
    battle.turn = 1;
    const intent = battle.getEnemyIntent(blockEnemy);
    expect(intent.type).toBe('block');
    expect(intent.icon).toBe('🛡️');
    expect(intent.text).toContain('格挡');
    expect(intent.value).toBe(15);
  });

  it('没有意图的敌人应该返回null', () => {
    const noIntentEnemy = {
      ...enemy,
      intents: []
    };
    const intent = battle.getEnemyIntent(noIntentEnemy);
    expect(intent).toBeNull();
  });

  it('意图应该根据turnPattern循环', () => {
    // 第1回合：turnPattern[0] = 0 -> intents[0] = ritual
    battle.turn = 1;
    let intent = battle.getEnemyIntent(enemy);
    expect(intent.type).toBe('buff');
    
    // 第2回合：turnPattern[1] = 1 -> intents[1] = attack
    battle.turn = 2;
    intent = battle.getEnemyIntent(enemy);
    expect(intent.type).toBe('attack');
    
    // 第3回合：turnPattern[0] = 0 -> intents[0] = ritual（循环）
    battle.turn = 3;
    intent = battle.getEnemyIntent(enemy);
    expect(intent.type).toBe('buff');
  });
});

