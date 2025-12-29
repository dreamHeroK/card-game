// 地图系统
import { NODE_TYPE } from '../types/index.js';
import { getRandomMonster, MONSTER_TYPE } from '../data/monsters.js';

export class MapSystem {
  constructor(act = 1) {
    this.act = act;
    this.maxFloor = 15;
    this.nodes = [];
    this.connections = [];
    this.currentNodeId = null;
    this.generateMap();
  }

  // 生成地图
  generateMap() {
    this.nodes = [];
    this.connections = [];
    
    // 创建4个起始节点（第0层），都是战斗类型
    const startNodes = [];
    for (let i = 0; i < 4; i++) {
      const startNode = this.createNode(0, NODE_TYPE.MONSTER, this.act);
      startNodes.push(startNode);
      this.nodes.push(startNode);
    }
    // 不设置当前节点，让玩家选择起始节点
    this.currentNodeId = null;
    
    // 第一层：创建4个节点，形成4条路径的起点
    const firstFloorNodes = [];
    for (let i = 0; i < 4; i++) {
      const nodeType = this.getNodeTypeForFloor(1);
      const node = this.createNode(1, nodeType, this.act);
      firstFloorNodes.push(node);
      this.nodes.push(node);
      // 每个节点都连接到对应的起始节点（形成4条独立路径）
      this.connections.push({ from: startNodes[i].id, to: node.id });
    }
    
    // 生成中间层（2到maxFloor-2）
    // 每层保持4条路径，但允许路径合并和交叉
    let previousFloorNodes = firstFloorNodes;
    
    for (let floor = 2; floor < this.maxFloor - 2; floor++) {
      const nodeCount = this.getNodeCountForFloor(floor);
      const floorNodes = [];
      
      for (let i = 0; i < nodeCount; i++) {
        const nodeType = this.getNodeTypeForFloor(floor);
        const node = this.createNode(floor, nodeType, this.act);
        floorNodes.push(node);
        this.nodes.push(node);
      }
      
      // 连接到上一层：确保每个节点至少连接到一个上层节点
      // 允许交叉连接（一个节点可以连接到多个上层节点）
      floorNodes.forEach(node => {
        // 每个节点连接到1-3个上层节点（允许路径合并）
        const connectionCount = Math.min(3, previousFloorNodes.length);
        const connectedNodes = new Set();
        
        for (let i = 0; i < connectionCount; i++) {
          const prevNode = previousFloorNodes[Math.floor(Math.random() * previousFloorNodes.length)];
          if (!connectedNodes.has(prevNode.id)) {
            connectedNodes.add(prevNode.id);
            if (!this.connections.some(c => c.from === prevNode.id && c.to === node.id)) {
              this.connections.push({ from: prevNode.id, to: node.id });
            }
          }
        }
      });
      
      previousFloorNodes = floorNodes;
    }
    
    // 创建休息节点（maxFloor-2层）
    const restNode = this.createNode(this.maxFloor - 2, NODE_TYPE.REST, this.act);
    this.nodes.push(restNode);
    
    // 连接到休息节点：所有上一层的节点都连接到休息节点
    previousFloorNodes.forEach(prevNode => {
      this.connections.push({ from: prevNode.id, to: restNode.id });
    });
    
    // 创建Boss节点（最后一层）
    const bossNode = this.createNode(this.maxFloor - 1, NODE_TYPE.BOSS, this.act);
    this.nodes.push(bossNode);
    this.connections.push({ from: restNode.id, to: bossNode.id });
  }

  // 获取每层节点数量
  getNodeCountForFloor(floor) {
    // 确保有足够的节点来支持4条路径，同时允许路径合并和交叉
    if (floor === 1) return 4; // 第一层固定4个节点
    if (floor <= 3) return 4; // 保持4条路径
    if (floor <= 6) return 4; // 保持4条路径，允许交叉
    if (floor <= 9) return 3; // 路径开始合并
    return 3; // 继续合并
  }
  
  // 获取所有连接
  getConnections() {
    return this.connections;
  }

  // 获取节点类型
  getNodeTypeForFloor(floor) {
    const rand = Math.random();
    if (rand < 0.1 && floor > 3) return NODE_TYPE.ELITE;
    if (rand < 0.15) return NODE_TYPE.SHOP;
    if (rand < 0.2) return NODE_TYPE.TREASURE;
    if (rand < 0.25) return NODE_TYPE.EVENT;
    return NODE_TYPE.MONSTER;
  }

  // 创建节点
  createNode(floor, type, act) {
    const id = `node_${floor}_${Date.now()}_${Math.random()}`;
    return {
      id,
      floor,
      type,
      visited: false,
      data: this.generateNodeData(type, act)
    };
  }

  // 生成节点数据
  generateNodeData(type, act) {
    switch (type) {
      case NODE_TYPE.MONSTER: {
        const normalMonster = getRandomMonster(MONSTER_TYPE.NORMAL, act);
        if (!normalMonster) {
          return {
            monster: {
              id: 'cultist',
              name: '邪教徒',
              type: MONSTER_TYPE.NORMAL,
              act: 1,
              maxHp: 48,
              intents: [{ type: 'attack', value: 6 }],
              description: '默认怪物'
            }
          };
        }
        return {
          monster: { ...normalMonster }
        };
      }
      case NODE_TYPE.ELITE: {
        const eliteMonster = getRandomMonster(MONSTER_TYPE.ELITE, act);
        if (!eliteMonster) {
          return {
            monster: {
              id: 'gremlin_nob',
              name: '地精大块头',
              type: MONSTER_TYPE.ELITE,
              act: 1,
              maxHp: 82,
              intents: [{ type: 'attack', value: 14 }],
              description: '默认精英'
            }
          };
        }
        return {
          monster: { ...eliteMonster }
        };
      }
      case NODE_TYPE.BOSS: {
        const bossMonster = getRandomMonster(MONSTER_TYPE.BOSS, act);
        if (!bossMonster) {
          return {
            monster: {
              id: 'slime_boss',
              name: '史莱姆Boss',
              type: MONSTER_TYPE.BOSS,
              act: 1,
              maxHp: 140,
              intents: [{ type: 'attack', value: 18 }],
              description: '默认Boss'
            }
          };
        }
        return {
          monster: { ...bossMonster }
        };
      }
      case NODE_TYPE.REST:
        return {
          options: ['rest', 'upgrade', 'smith']
        };
      case NODE_TYPE.SHOP:
        return {
          shop: true
        };
      case NODE_TYPE.TREASURE:
        return {
          relic: this.generateTreasureRelic()
        };
      case NODE_TYPE.EVENT:
        return {
          event: 'random_event'
        };
      default:
        return {};
    }
  }

  // 生成宝箱遗物
  generateTreasureRelic() {
    return {
      id: 'test_relic',
      name: '测试遗物',
      rarity: 'common',
      description: '测试用遗物'
    };
  }

  // 获取当前节点
  getCurrentNode() {
    return this.nodes.find(n => n.id === this.currentNodeId);
  }

  // 获取节点
  getNode(nodeId) {
    return this.nodes.find(n => n.id === nodeId);
  }

  // 检查节点是否可访问
  isNodeAccessible(nodeId) {
    if (!this.currentNodeId) {
      // 如果没有当前节点，第一层的节点都可以访问
      const node = this.nodes.find(n => n.id === nodeId);
      return node && node.floor === 0;
    }
    
    const currentNode = this.getCurrentNode();
    const targetNode = this.nodes.find(n => n.id === nodeId);
    
    if (!currentNode || !targetNode) return false;
    
    // 当前节点总是可访问（可以点击当前节点触发事件）
    if (currentNode.id === nodeId) return true;
    
    // 检查是否有连接（从当前节点到目标节点）
    return this.connections.some(
      conn => conn.from === this.currentNodeId && conn.to === nodeId
    );
  }

  // 移动到节点
  moveToNode(nodeId) {
    if (!this.isNodeAccessible(nodeId)) return null;
    
    this.currentNodeId = nodeId;
    return this.getCurrentNode();
  }

  // 标记节点为已访问
  visitNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.visited = true;
    }
  }

  // 获取可访问的下一层节点
  getAvailableNextNodes() {
    if (!this.currentNodeId) {
      return this.nodes.filter(n => n.floor === 0);
    }
    
    return this.connections
      .filter(conn => conn.from === this.currentNodeId)
      .map(conn => this.nodes.find(n => n.id === conn.to))
      .filter(n => n && !n.visited);
  }

  // 按层获取节点
  getNodesByFloor() {
    const grouped = {};
    this.nodes.forEach(node => {
      if (!grouped[node.floor]) {
        grouped[node.floor] = [];
      }
      grouped[node.floor].push(node);
    });
    return grouped;
  }
}

