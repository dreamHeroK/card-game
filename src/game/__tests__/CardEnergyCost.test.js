import { describe, it, expect, beforeEach } from 'vitest';
import { BattleSystem } from '../BattleSystem.js';
import { GameState } from '../GameState.js';
import { CHARACTER } from '../../types/index.js';

describe('卡牌能量消耗', () => {
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
      weak: 0
    };
    battle = new BattleSystem(player, [enemy]);
    battle.initBattle();
  });

  it('未升级的卡牌应该使用原始cost', () => {
    // 找到一张cost为1的卡牌（打击）
    const strikeCard = battle.hand.find(card => card.id === 'strike');
    if (strikeCard) {
      expect(strikeCard.cost).toBe(1);
      expect(strikeCard.upgraded).toBe(false);
      const cost = battle.getCardCost(strikeCard);
      expect(cost).toBe(1);
    }
  });

  it('升级后的卡牌cost应该减少1', () => {
    // 找到一张cost为2的卡牌（重击）
    const bashCard = battle.hand.find(card => card.id === 'bash');
    if (bashCard) {
      expect(bashCard.cost).toBe(2);
      expect(bashCard.upgraded).toBe(false);
      
      // 升级卡牌
      bashCard.upgraded = true;
      const cost = battle.getCardCost(bashCard);
      expect(cost).toBe(1); // 升级后cost从2变成1
    }
  });

  it('升级后的0 cost卡牌应该保持为0', () => {
    // 创建一个0 cost的卡牌
    const zeroCostCard = {
      id: 'test',
      name: '测试',
      cost: 0,
      upgraded: true
    };
    
    const cost = battle.getCardCost(zeroCostCard);
    expect(cost).toBe(0);
  });

  it('升级后的1 cost卡牌应该变成0', () => {
    const strikeCard = battle.hand.find(card => card.id === 'strike');
    if (strikeCard) {
      strikeCard.upgraded = true;
      const cost = battle.getCardCost(strikeCard);
      expect(cost).toBe(0); // 升级后cost从1变成0
    }
  });

  it('打出升级后的卡牌应该消耗更少的能量', () => {
    const bashCard = battle.hand.find(card => card.id === 'bash');
    if (bashCard) {
      const initialEnergy = battle.energy;
      const originalCost = bashCard.cost;
      
      // 升级卡牌
      bashCard.upgraded = true;
      const upgradedCost = battle.getCardCost(bashCard);
      
      expect(upgradedCost).toBe(originalCost - 1);
      
      // 打出升级后的卡牌
      const cardIndex = battle.hand.indexOf(bashCard);
      battle.playCard(cardIndex, 0);
      
      expect(battle.energy).toBe(initialEnergy - upgradedCost);
    }
  });
});

