import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../GameState.js';
import { MapSystem } from '../MapSystem.js';
import { CHARACTER } from '../../types/index.js';
import { getRandomEvent, getEventById, EVENTS } from '../../data/events.js';
import { NODE_TYPE } from '../../types/index.js';

describe('事件系统', () => {
  let gameState;
  let mapSystem;

  beforeEach(() => {
    gameState = new GameState(CHARACTER.IRONCLAD);
    mapSystem = new MapSystem(1);
  });

  it('应该能够生成随机事件', () => {
    const event = getRandomEvent();
    expect(event).toBeDefined();
    expect(event.id).toBeDefined();
    expect(event.name).toBeDefined();
    expect(event.description).toBeDefined();
    expect(event.options).toBeDefined();
    expect(Array.isArray(event.options)).toBe(true);
  });

  it('应该能够根据ID获取事件', () => {
    const event = getEventById('cleric');
    expect(event).toBeDefined();
    expect(event.id).toBe('cleric');
    expect(event.name).toBe('牧师');
  });

  it('事件节点应该包含事件数据', () => {
    mapSystem.generateMap();
    const eventNodes = mapSystem.nodes.filter(n => n.type === NODE_TYPE.EVENT);
    
    if (eventNodes.length > 0) {
      const eventNode = eventNodes[0];
      expect(eventNode.data).toBeDefined();
      expect(eventNode.data.event).toBeDefined();
      expect(eventNode.data.event.id).toBeDefined();
      expect(eventNode.data.event.name).toBeDefined();
    }
  });

  it('应该能够进入事件', () => {
    const event = getRandomEvent();
    gameState.enterEvent(event);
    
    expect(gameState.currentScreen).toBe('event');
    expect(gameState.currentEvent).toBe(event);
  });

  it('应该能够离开事件', () => {
    const event = getRandomEvent();
    gameState.enterEvent(event);
    gameState.leaveEvent();
    
    expect(gameState.currentScreen).toBe('map');
    expect(gameState.currentEvent).toBeNull();
  });

  it('牧师事件应该能够恢复生命值', () => {
    const event = getEventById('cleric');
    expect(event).toBeDefined();
    
    const player = new GameState(CHARACTER.IRONCLAD);
    player.hp = 50;
    const initialHp = player.hp;
    
    // 测试免费恢复选项
    const freeOption = event.options.find(opt => opt.text.includes('免费'));
    if (freeOption) {
      const result = freeOption.effect(player);
      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
      expect(player.hp).toBeGreaterThan(initialHp);
    }
  });

  it('宝箱事件应该能够获得遗物', () => {
    const event = getEventById('treasure');
    expect(event).toBeDefined();
    
    const player = new GameState(CHARACTER.IRONCLAD);
    const initialRelicsCount = player.relics.length;
    
    const openOption = event.options.find(opt => opt.text.includes('打开'));
    if (openOption) {
      const result = openOption.effect(player);
      expect(result).toBeDefined();
      // 如果获得了遗物，遗物数量应该增加
      if (result.relic) {
        expect(player.relics.length).toBeGreaterThan(initialRelicsCount);
      }
    }
  });

  it('战斗事件应该返回战斗标记', () => {
    const event = getEventById('random_battle');
    expect(event).toBeDefined();
    
    const player = new GameState(CHARACTER.IRONCLAD);
    const battleOption = event.options[0];
    
    const result = battleOption.effect(player);
    expect(result).toBeDefined();
    expect(result.battle).toBe(true);
  });

  it('所有事件都应该有至少一个选项', () => {
    EVENTS.forEach(event => {
      expect(event.options).toBeDefined();
      expect(Array.isArray(event.options)).toBe(true);
      expect(event.options.length).toBeGreaterThan(0);
    });
  });

  it('所有事件选项都应该有文本和效果函数', () => {
    EVENTS.forEach(event => {
      event.options.forEach(option => {
        expect(option.text).toBeDefined();
        expect(typeof option.text).toBe('string');
        expect(option.effect).toBeDefined();
        expect(typeof option.effect).toBe('function');
      });
    });
  });
});

