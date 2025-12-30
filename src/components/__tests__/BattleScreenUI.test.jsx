import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import BattleScreen from '../BattleScreen.jsx';
import { BattleSystem } from '../../game/BattleSystem.js';
import { GameState } from '../../game/GameState.js';
import { CHARACTER } from '../../types/index.js';

describe('BattleScreen UI布局', () => {
  let battle;
  let mockOnEndTurn;
  let mockOnPlayCard;
  let mockOnEndBattle;

  beforeEach(() => {
    const player = new GameState(CHARACTER.IRONCLAD);
    const enemy = {
      id: 'cultist',
      name: '邪教徒',
      hp: 48,
      maxHp: 48,
      block: 0,
      vulnerable: 0,
      weak: 0,
      strength: 0,
      intents: [{ type: 'attack', value: 6 }],
      turnPattern: [0]
    };
    battle = new BattleSystem(player, [enemy]);
    battle.initBattle();
    
    mockOnEndTurn = vi.fn();
    mockOnPlayCard = vi.fn(() => ({ damageInfo: { displayedDamage: 6 } }));
    mockOnEndBattle = vi.fn();
  });

  it('应该显示战斗操作按钮', () => {
    render(
      <BattleScreen
        battle={battle}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
      />
    );
    
    expect(screen.getByText('打出卡牌')).toBeDefined();
    expect(screen.getByText('结束回合')).toBeDefined();
  });

  it('按钮应该在手牌上方', () => {
    const { container } = render(
      <BattleScreen
        battle={battle}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
      />
    );
    
    const battleActions = container.querySelector('.battle-actions');
    const handContainer = container.querySelector('.hand-container');
    
    expect(battleActions).toBeDefined();
    expect(handContainer).toBeDefined();
    
    // 检查DOM顺序：battle-actions应该在hand-container之前
    const allElements = Array.from(container.querySelectorAll('.battle-actions, .hand-container'));
    const actionsIndex = allElements.findIndex(el => el.classList.contains('battle-actions'));
    const handIndex = allElements.findIndex(el => el.classList.contains('hand-container'));
    
    expect(actionsIndex).toBeLessThan(handIndex);
  });

  it('按钮应该始终可见', () => {
    const { container } = render(
      <BattleScreen
        battle={battle}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
      />
    );
    
    const battleActions = container.querySelector('.battle-actions');
    expect(battleActions).toBeDefined();
    
    // 检查按钮样式，确保它们不会被隐藏
    const buttons = battleActions.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach(button => {
      const style = window.getComputedStyle(button);
      expect(style.display).not.toBe('none');
    });
  });

  it('打出卡牌后按钮应该仍然可见', () => {
    const { container } = render(
      <BattleScreen
        battle={battle}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
      />
    );
    
    // 选择一张卡牌
    const cards = container.querySelectorAll('.card');
    if (cards.length > 0) {
      act(() => {
        fireEvent.click(cards[0]);
      });
      
      // 点击打出卡牌按钮
      const playButton = screen.getByText('打出卡牌');
      act(() => {
        fireEvent.click(playButton);
      });
      
      // 按钮应该仍然存在
      expect(screen.getByText('打出卡牌')).toBeDefined();
      expect(screen.getByText('结束回合')).toBeDefined();
    }
  });
});

