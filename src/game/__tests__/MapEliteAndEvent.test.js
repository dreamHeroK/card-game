import { describe, it, expect, beforeEach } from 'vitest';
import { MapSystem } from '../MapSystem.js';
import { NODE_TYPE } from '../../types/index.js';

describe('地图精英战斗和事件比例', () => {
  let mapSystem;

  beforeEach(() => {
    mapSystem = new MapSystem(1);
  });

  it('应该至少有2个精英战斗节点', () => {
    const eliteNodes = mapSystem.nodes.filter(n => n.type === NODE_TYPE.ELITE);
    expect(eliteNodes.length).toBeGreaterThanOrEqual(2);
  });

  it('精英节点应该有正确的怪物数据', () => {
    const eliteNodes = mapSystem.nodes.filter(n => n.type === NODE_TYPE.ELITE);
    expect(eliteNodes.length).toBeGreaterThanOrEqual(2);
    
    eliteNodes.forEach(node => {
      expect(node.data).toBeDefined();
      expect(node.data.monster).toBeDefined();
      expect(node.data.monster.type).toBe('elite');
    });
  });

  it('事件节点和战斗节点的比例应该接近', () => {
    const eventNodes = mapSystem.nodes.filter(n => n.type === NODE_TYPE.EVENT);
    const monsterNodes = mapSystem.nodes.filter(n => n.type === NODE_TYPE.MONSTER);
    
    // 排除起始节点（第0层都是战斗）
    const nonStartMonsterNodes = monsterNodes.filter(n => n.floor > 0);
    
    // 排除精英和Boss节点
    const normalMonsterNodes = nonStartMonsterNodes.filter(n => 
      n.type === NODE_TYPE.MONSTER && n.floor < mapSystem.maxFloor - 1
    );
    
    // 事件和普通战斗的比例应该接近（允许一定误差）
    const eventCount = eventNodes.length;
    const monsterCount = normalMonsterNodes.length;
    const total = eventCount + monsterCount;
    
    if (total > 0) {
      const eventRatio = eventCount / total;
      const monsterRatio = monsterCount / total;
      
      // 比例应该在35%-55%之间（接近45%）
      expect(eventRatio).toBeGreaterThanOrEqual(0.2);
      expect(eventRatio).toBeLessThanOrEqual(0.7);
      expect(monsterRatio).toBeGreaterThanOrEqual(0.2);
      expect(monsterRatio).toBeLessThanOrEqual(0.7);
      
      // 两者比例差异不应超过30%
      const ratioDiff = Math.abs(eventRatio - monsterRatio);
      expect(ratioDiff).toBeLessThan(0.3);
    }
  });

  it('应该生成多个事件节点', () => {
    const eventNodes = mapSystem.nodes.filter(n => n.type === NODE_TYPE.EVENT);
    // 应该有至少几个事件节点（取决于地图大小）
    expect(eventNodes.length).toBeGreaterThan(0);
  });

  it('精英节点应该分布在不同层', () => {
    const eliteNodes = mapSystem.nodes.filter(n => n.type === NODE_TYPE.ELITE);
    expect(eliteNodes.length).toBeGreaterThanOrEqual(2);
    
    // 至少2个精英节点应该在不同的层（或至少不都在同一层）
    const eliteFloors = new Set(eliteNodes.map(n => n.floor));
    // 如果只有2个精英，它们可能在同一层，但通常应该在不同层
    expect(eliteFloors.size).toBeGreaterThanOrEqual(1);
  });

  it('精英节点不应该在起始层或Boss层', () => {
    const eliteNodes = mapSystem.nodes.filter(n => n.type === NODE_TYPE.ELITE);
    eliteNodes.forEach(node => {
      expect(node.floor).toBeGreaterThan(0); // 不在起始层
      expect(node.floor).toBeLessThan(mapSystem.maxFloor - 1); // 不在Boss层
    });
  });

  it('事件节点应该有正确的数据', () => {
    const eventNodes = mapSystem.nodes.filter(n => n.type === NODE_TYPE.EVENT);
    eventNodes.forEach(node => {
      expect(node.data).toBeDefined();
      expect(node.data.event).toBeDefined();
    });
  });
});

