import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../GameState.js';
import { CHARACTER } from '../../types/index.js';

describe('战斗奖励流程', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState(CHARACTER.IRONCLAD);
    // 移动到节点以便生成奖励
    const nodes = gameState.map.nodes.filter(n => n.floor === 0);
    if (nodes.length > 0) {
      gameState.map.moveToNode(nodes[0].id);
    }
  });

  it('战斗胜利后应该显示奖励界面', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    expect(gameState.currentScreen).toBe('battle');
    
    // 模拟战斗胜利
    gameState.battle.enemies[0].hp = 0;
    gameState.endBattle(true);
    
    // 应该显示奖励界面
    expect(gameState.currentScreen).toBe('battle_reward');
    expect(gameState.battleReward).toBeDefined();
    expect(gameState.battleReward.gold).toBeGreaterThan(0);
  });

  it('接受奖励后应该返回地图', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    gameState.battle.enemies[0].hp = 0;
    gameState.endBattle(true);
    
    expect(gameState.currentScreen).toBe('battle_reward');
    
    // 接受奖励
    gameState.acceptBattleReward(null, true, true);
    
    expect(gameState.currentScreen).toBe('map');
    expect(gameState.battle).toBeNull();
    expect(gameState.battleReward).toBeNull();
  });

  it('接受奖励后应该增加金币', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    const initialGold = gameState.gold;
    gameState.battle.enemies[0].hp = 0;
    gameState.endBattle(true);
    
    const rewardGold = gameState.battleReward.gold;
    gameState.acceptBattleReward(null, true, true);
    
    expect(gameState.gold).toBe(initialGold + rewardGold);
  });

  it('选择卡牌后应该加入牌组', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    const initialDeckSize = gameState.deck.length;
    gameState.battle.enemies[0].hp = 0;
    gameState.endBattle(true);
    
    // 选择第一张卡牌
    if (gameState.battleReward.cardChoices.length > 0) {
      gameState.acceptBattleReward(0, true, true);
      
      expect(gameState.deck.length).toBe(initialDeckSize + 1);
    }
  });

  it('接受遗物后应该加入遗物列表', () => {
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
      const initialRelicsCount = gameState.relics.length;
      gameState.battle.enemies[0].hp = 0;
      gameState.endBattle(true);
      
      if (gameState.battleReward.relic) {
        gameState.acceptBattleReward(null, true, true);
        
        expect(gameState.relics.length).toBe(initialRelicsCount + 1);
      }
    }
  });

  it('接受药水后应该加入药水列表', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    const initialPotionsCount = gameState.potions.length;
    gameState.battle.enemies[0].hp = 0;
    gameState.endBattle(true);
    
    if (gameState.battleReward.potion) {
      gameState.acceptBattleReward(null, true, true);
      
      expect(gameState.potions.length).toBe(initialPotionsCount + 1);
    }
  });

  it('可以跳过卡牌选择', () => {
    const monster = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      intents: [{ type: 'attack', value: 6 }]
    };

    gameState.startBattle(monster);
    const initialDeckSize = gameState.deck.length;
    gameState.battle.enemies[0].hp = 0;
    gameState.endBattle(true);
    
    // 跳过卡牌选择
    gameState.acceptBattleReward(null, true, true);
    
    expect(gameState.deck.length).toBe(initialDeckSize);
  });

  it('可以拒绝遗物', () => {
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
      const initialRelicsCount = gameState.relics.length;
      gameState.battle.enemies[0].hp = 0;
      gameState.endBattle(true);
      
      if (gameState.battleReward.relic) {
        // 拒绝遗物
        gameState.acceptBattleReward(null, false, true);
        
        expect(gameState.relics.length).toBe(initialRelicsCount);
      }
    }
  });
});

