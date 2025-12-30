import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../GameState.js';
import { BattleSystem } from '../BattleSystem.js';
import { CHARACTER } from '../../types/index.js';
import { getPotionById, POTIONS } from '../../data/potions.js';

describe('药水系统', () => {
  let gameState;
  let battle;

  beforeEach(() => {
    gameState = new GameState(CHARACTER.IRONCLAD);
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };
    battle = new BattleSystem(gameState, [monster]);
    battle.initBattle();
  });

  it('应该能够使用力量药水', () => {
    const potion = getPotionById('strength_potion');
    expect(potion).toBeDefined();
    
    const initialStrength = gameState.strength;
    const result = potion.effect(gameState, battle);
    
    expect(result).toBeDefined();
    expect(result.message).toBeDefined();
    expect(gameState.strength).toBe(initialStrength + 2);
  });

  it('应该能够使用格挡药水', () => {
    const potion = getPotionById('block_potion');
    expect(potion).toBeDefined();
    
    const initialBlock = battle.block;
    const result = potion.effect(gameState, battle);
    
    expect(result).toBeDefined();
    expect(battle.block).toBe(initialBlock + 12);
  });

  it('应该能够使用治疗药水', () => {
    const potion = getPotionById('heal_potion');
    expect(potion).toBeDefined();
    
    gameState.hp = 50;
    const initialHp = gameState.hp;
    const result = potion.effect(gameState, battle);
    
    expect(result).toBeDefined();
    expect(gameState.hp).toBe(initialHp + 10);
  });

  it('应该能够使用能量药水', () => {
    const potion = getPotionById('energy_potion');
    expect(potion).toBeDefined();
    
    const initialEnergy = battle.energy;
    const result = potion.effect(gameState, battle);
    
    expect(result).toBeDefined();
    expect(battle.energy).toBe(initialEnergy + 2);
  });

  it('应该能够使用火焰药水', () => {
    const potion = getPotionById('fire_potion');
    expect(potion).toBeDefined();
    
    const initialEnemyHp = battle.enemies[0].hp;
    const result = potion.effect(gameState, battle);
    
    expect(result).toBeDefined();
    expect(battle.enemies[0].hp).toBe(Math.max(0, initialEnemyHp - 20));
  });

  it('所有药水都应该有effect函数', () => {
    POTIONS.forEach(potion => {
      expect(potion.effect).toBeDefined();
      expect(typeof potion.effect).toBe('function');
    });
  });
});

