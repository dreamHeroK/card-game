import { describe, it, expect, beforeEach } from 'vitest';
import { MapSystem } from '../MapSystem.js';
import { NODE_TYPE } from '../../types/index.js';

describe('MapSystem', () => {
  let mapSystem;

  beforeEach(() => {
    mapSystem = new MapSystem(1);
  });

  it('应该正确初始化地图', () => {
    expect(mapSystem.nodes.length).toBeGreaterThan(0);
    // 初始时没有当前节点，需要玩家选择起始节点
    expect(mapSystem.currentNodeId).toBeNull();
    expect(mapSystem.maxFloor).toBe(15);
    // 应该有4个起始节点（第0层）
    const startNodes = mapSystem.nodes.filter(n => n.floor === 0);
    expect(startNodes.length).toBe(4);
  });

  it('应该能够获取当前节点', () => {
    // 初始时没有当前节点
    let currentNode = mapSystem.getCurrentNode();
    expect(currentNode).toBeUndefined();
    
    // 选择一个起始节点
    const startNodes = mapSystem.nodes.filter(n => n.floor === 0);
    expect(startNodes.length).toBe(4);
    
    // 移动到第一个起始节点
    const movedNode = mapSystem.moveToNode(startNodes[0].id);
    expect(movedNode).toBeDefined();
    
    currentNode = mapSystem.getCurrentNode();
    expect(currentNode).toBeDefined();
    expect(currentNode.floor).toBe(0);
    expect(currentNode.type).toBe(NODE_TYPE.MONSTER);
  });

  it('应该能够检查节点是否可访问', () => {
    // 初始时没有当前节点，第0层的节点应该可访问
    const startNodes = mapSystem.nodes.filter(n => n.floor === 0);
    expect(startNodes.length).toBeGreaterThan(0);
    const isAccessible = mapSystem.isNodeAccessible(startNodes[0].id);
    expect(isAccessible).toBe(true);
    
    // 选择一个起始节点后，当前节点应该可访问
    mapSystem.moveToNode(startNodes[0].id);
    const currentNode = mapSystem.getCurrentNode();
    const isCurrentAccessible = mapSystem.isNodeAccessible(currentNode.id);
    expect(isCurrentAccessible).toBe(true);
  });

  it('应该能够移动到可访问的节点', () => {
    const availableNodes = mapSystem.getAvailableNextNodes();
    
    if (availableNodes.length > 0) {
      const targetNode = availableNodes[0];
      const movedNode = mapSystem.moveToNode(targetNode.id);
      
      expect(movedNode).toBeDefined();
      expect(movedNode.id).toBe(targetNode.id);
    }
  });

  it('应该能够标记节点为已访问', () => {
    // 先选择一个起始节点
    const startNodes = mapSystem.nodes.filter(n => n.floor === 0);
    mapSystem.moveToNode(startNodes[0].id);
    const currentNode = mapSystem.getCurrentNode();
    
    mapSystem.visitNode(currentNode.id);
    
    const visitedNode = mapSystem.nodes.find(n => n.id === currentNode.id);
    expect(visitedNode.visited).toBe(true);
  });

  it('应该能够获取可访问的下一层节点', () => {
    const availableNodes = mapSystem.getAvailableNextNodes();
    
    expect(Array.isArray(availableNodes)).toBe(true);
  });
});

