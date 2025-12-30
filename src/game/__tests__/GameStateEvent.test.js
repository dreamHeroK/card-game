import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../GameState.js';
import { CHARACTER } from '../../types/index.js';
import { getRandomEvent, getEventById } from '../../data/events.js';

describe('GameState 事件处理', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState(CHARACTER.IRONCLAD);
  });

  it('构造函数应该初始化 currentEvent 为 null', () => {
    expect(gameState.currentEvent).toBeNull();
  });

  it('应该能够进入事件', () => {
    const event = getRandomEvent();
    expect(event).toBeDefined();
    
    gameState.enterEvent(event);
    
    expect(gameState.currentScreen).toBe('event');
    expect(gameState.currentEvent).toBe(event);
    expect(gameState.currentEvent.id).toBe(event.id);
    expect(gameState.currentEvent.name).toBe(event.name);
  });

  it('应该能够离开事件', () => {
    const event = getRandomEvent();
    gameState.enterEvent(event);
    
    expect(gameState.currentScreen).toBe('event');
    expect(gameState.currentEvent).toBe(event);
    
    // 测试 leaveEvent 方法存在
    expect(typeof gameState.leaveEvent).toBe('function');
    
    gameState.leaveEvent();
    
    expect(gameState.currentScreen).toBe('map');
    expect(gameState.currentEvent).toBeNull();
  });

  it('离开事件后应该能够再次进入事件', () => {
    const event1 = getRandomEvent();
    gameState.enterEvent(event1);
    gameState.leaveEvent();
    
    const event2 = getRandomEvent();
    gameState.enterEvent(event2);
    
    expect(gameState.currentScreen).toBe('event');
    expect(gameState.currentEvent).toBe(event2);
  });

  it('进入事件后应该保持事件数据完整性', () => {
    const event = getEventById('cleric');
    gameState.enterEvent(event);
    
    expect(gameState.currentEvent.id).toBe('cleric');
    expect(gameState.currentEvent.name).toBe('牧师');
    expect(gameState.currentEvent.description).toBeDefined();
    expect(gameState.currentEvent.options).toBeDefined();
    expect(Array.isArray(gameState.currentEvent.options)).toBe(true);
  });

  it('事件选项应该能够正确执行效果', () => {
    const event = getEventById('cleric');
    gameState.enterEvent(event);
    
    const player = gameState;
    player.hp = 50;
    const initialHp = player.hp;
    
    // 找到免费恢复选项
    const freeOption = gameState.currentEvent.options.find(opt => opt.text.includes('免费'));
    expect(freeOption).toBeDefined();
    
    const result = freeOption.effect(player);
    expect(result).toBeDefined();
    expect(result.message).toBeDefined();
    expect(player.hp).toBeGreaterThan(initialHp);
  });

  it('战斗事件应该能够触发战斗', () => {
    const event = getEventById('random_battle');
    gameState.enterEvent(event);
    
    const battleOption = gameState.currentEvent.options[0];
    const result = battleOption.effect(gameState);
    
    expect(result).toBeDefined();
    expect(result.battle).toBe(true);
  });

  it('宝箱事件应该能够获得遗物', () => {
    const event = getEventById('treasure');
    gameState.enterEvent(event);
    
    const initialRelicsCount = gameState.relics.length;
    const openOption = gameState.currentEvent.options.find(opt => opt.text.includes('打开'));
    
    expect(openOption).toBeDefined();
    
    const result = openOption.effect(gameState);
    expect(result).toBeDefined();
    
    // 如果获得了遗物，遗物数量应该增加
    if (result.relic) {
      expect(gameState.relics.length).toBeGreaterThan(initialRelicsCount);
    }
  });

  it('离开事件后 currentScreen 应该返回 map', () => {
    const event = getRandomEvent();
    gameState.enterEvent(event);
    expect(gameState.currentScreen).toBe('event');
    
    gameState.leaveEvent();
    expect(gameState.currentScreen).toBe('map');
  });

  it('多次进入和离开事件应该正常工作', () => {
    for (let i = 0; i < 3; i++) {
      const event = getRandomEvent();
      gameState.enterEvent(event);
      expect(gameState.currentScreen).toBe('event');
      expect(gameState.currentEvent).toBe(event);
      
      gameState.leaveEvent();
      expect(gameState.currentScreen).toBe('map');
      expect(gameState.currentEvent).toBeNull();
    }
  });
});

