import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../GameState.js';
import { MapSystem } from '../MapSystem.js';
import { CHARACTER } from '../../types/index.js';
import { NODE_TYPE } from '../../types/index.js';

describe('Boss Victory and Next Act', () => {
  let gameState;
  let mapSystem;

  beforeEach(() => {
    gameState = new GameState(CHARACTER.IRONCLAD);
    mapSystem = gameState.map;
  });

  it('应该能够检测boss节点', () => {
    // 找到boss节点
    const bossNode = mapSystem.nodes.find(n => n.type === NODE_TYPE.BOSS);
    expect(bossNode).toBeDefined();
    expect(bossNode.type).toBe(NODE_TYPE.BOSS);
  });

  it('击败boss后应该进入下一层', () => {
    // 使用gameState.map而不是mapSystem
    const bossNode = gameState.map.nodes.find(n => n.type === NODE_TYPE.BOSS);
    expect(bossNode).toBeDefined();
    
    // 直接设置当前节点为boss节点（模拟已经移动到boss节点）
    gameState.map.currentNodeId = bossNode.id;
    const currentNodeBeforeBattle = gameState.map.getCurrentNode();
    expect(currentNodeBeforeBattle).toBeDefined();
    expect(currentNodeBeforeBattle.type).toBe(NODE_TYPE.BOSS);
    
    // 开始boss战斗
    const monster = bossNode.data?.monster;
    expect(monster).toBeDefined();
    
    const enemy = {
      ...monster,
      hp: monster.maxHp,
      block: 0,
      vulnerable: 0,
      weak: 0
    };
    
    gameState.startBattle(enemy);
    expect(gameState.currentScreen).toBe('battle');
    
    // 确保当前节点仍然是boss节点
    const currentNodeDuringBattle = gameState.map.getCurrentNode();
    expect(currentNodeDuringBattle).toBeDefined();
    expect(currentNodeDuringBattle.type).toBe(NODE_TYPE.BOSS);
    
    // 模拟击败boss（设置敌人HP为0）
    gameState.battle.enemies[0].hp = 0;
    
    // 结束战斗（胜利）
    gameState.endBattle(true);
    
    // 现在会显示奖励界面
    expect(gameState.currentScreen).toBe('battle_reward');
    expect(gameState.battleReward).toBeDefined();
    
    // 接受奖励后返回地图并进入下一层
    gameState.acceptBattleReward(null, true, true);
    expect(gameState.currentScreen).toBe('map');
    
    // 检查是否进入下一层（act 1应该进入act 2）
    expect(gameState.act).toBe(2);
    expect(gameState.map.act).toBe(2);
    expect(gameState.map.currentNodeId).toBeNull(); // 新地图没有当前节点
  });

  it('击败boss后应该能够进入下一层（act+1）', () => {
    const initialAct = gameState.act;
    expect(initialAct).toBe(1);
    
    // 找到boss节点（使用gameState.map）
    const bossNode = gameState.map.nodes.find(n => n.type === NODE_TYPE.BOSS);
    expect(bossNode).toBeDefined();
    
    // 直接设置当前节点为boss节点（模拟已经移动到boss节点）
    gameState.map.currentNodeId = bossNode.id;
    const currentNode = gameState.map.getCurrentNode();
    expect(currentNode).toBeDefined();
    expect(currentNode.type).toBe(NODE_TYPE.BOSS);
    
    // 开始并击败boss
    const monster = bossNode.data?.monster;
    const enemy = {
      ...monster,
      hp: monster.maxHp,
      block: 0,
      vulnerable: 0,
      weak: 0
    };
    
    gameState.startBattle(enemy);
    gameState.battle.enemies[0].hp = 0;
    gameState.endBattle(true);
    
    // 现在会显示奖励界面
    expect(gameState.currentScreen).toBe('battle_reward');
    expect(gameState.battleReward).toBeDefined();
    
    // 接受奖励
    gameState.acceptBattleReward(null, true, true);
    expect(gameState.currentScreen).toBe('map');
    
    // act应该增加（如果act < 3）
    if (initialAct < 3) {
      expect(gameState.act).toBe(initialAct + 1);
      // 地图应该重新生成
      expect(gameState.map).toBeDefined();
      expect(gameState.map.act).toBe(initialAct + 1);
      expect(gameState.map.currentNodeId).toBeNull(); // 新地图没有当前节点
    } else {
      // 最后一层，应该返回victory
      const gameStateResult = gameState.checkGameState();
      expect(gameStateResult).toBe('victory');
    }
  });
  
  it('最后一层boss胜利后应该返回victory状态', () => {
    // 设置act为3（最后一层）
    gameState.act = 3;
    // 生成新的地图
    gameState.map = new MapSystem(3);
    
    const bossNode = gameState.map.nodes.find(n => n.type === NODE_TYPE.BOSS);
    expect(bossNode).toBeDefined();
    
    // 直接设置当前节点为boss节点
    gameState.map.currentNodeId = bossNode.id;
    
    // 开始并击败boss
    const monster = bossNode.data?.monster;
    const enemy = {
      ...monster,
      hp: monster.maxHp,
      block: 0,
      vulnerable: 0,
      weak: 0
    };
    
    gameState.startBattle(enemy);
    gameState.battle.enemies[0].hp = 0;
    gameState.endBattle(true);
    
    // 现在会显示奖励界面
    expect(gameState.currentScreen).toBe('battle_reward');
    expect(gameState.battleReward).toBeDefined();
    
    // 接受奖励后返回地图
    gameState.acceptBattleReward(null, true, true);
    expect(gameState.currentScreen).toBe('map');
    
    // act不应该增加（已经是最后一层）
    expect(gameState.act).toBe(3);
    
    // 应该返回victory状态
    const gameStateResult = gameState.checkGameState();
    expect(gameStateResult).toBe('victory');
  });
});
