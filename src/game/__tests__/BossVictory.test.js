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
    // 移动到boss节点
    const bossNode = mapSystem.nodes.find(n => n.type === NODE_TYPE.BOSS);
    expect(bossNode).toBeDefined();
    
    // 移动到boss节点
    mapSystem.moveToNode(bossNode.id);
    
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
    
    // 模拟击败boss（设置敌人HP为0）
    gameState.battle.enemies[0].hp = 0;
    
    // 结束战斗（胜利）
    gameState.endBattle(true);
    
    // 应该返回地图
    expect(gameState.currentScreen).toBe('map');
    
    // 检查是否进入下一层
    if (gameState.act > 1) {
      // 进入了下一层，地图已重新生成
      expect(gameState.map.act).toBe(2);
      expect(gameState.map.currentNodeId).toBeNull(); // 新地图没有当前节点
    } else {
      // 还在当前层（act >= 3的情况），检查boss节点是否已访问
      const currentMap = gameState.map;
      const visitedBossNode = currentMap.nodes.find(n => n.id === bossNode.id);
      // 如果地图没变，boss节点应该已访问
      if (currentMap === mapSystem) {
        expect(visitedBossNode?.visited).toBe(true);
      }
    }
    
    // 如果act < 3，应该进入下一层（act会增加，地图会重新生成）
    // 如果act >= 3，应该返回victory状态
    if (gameState.act < 3) {
      // 进入下一层，act应该增加
      expect(gameState.act).toBeGreaterThan(1);
      // 地图应该重新生成
      expect(gameState.map).toBeDefined();
    } else {
      // 最后一层，应该返回victory
      const gameStateResult = gameState.checkGameState();
      expect(gameStateResult).toBe('victory');
    }
  });

  it('击败boss后应该能够进入下一层（act+1）', () => {
    const initialAct = gameState.act;
    expect(initialAct).toBe(1);
    
    // 找到boss节点
    const bossNode = gameState.map.nodes.find(n => n.type === NODE_TYPE.BOSS);
    expect(bossNode).toBeDefined();
    
    // 移动到boss节点（使用gameState.map）
    gameState.map.moveToNode(bossNode.id);
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
    
    // 检查是否进入下一层
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
});

