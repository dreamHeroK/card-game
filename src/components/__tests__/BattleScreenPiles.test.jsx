import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BattleScreen from '../BattleScreen.jsx';
import { BattleSystem } from '../../game/BattleSystem.js';
import { GameState } from '../../game/GameState.js';
import { CHARACTER } from '../../types/index.js';

describe('BattleScreen 牌堆显示', () => {
  let battle;
  let player;
  let mockOnEndTurn;
  let mockOnPlayCard;
  let mockOnEndBattle;
  let mockOnUsePotion;

  beforeEach(() => {
    player = new GameState(CHARACTER.IRONCLAD);
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
    mockOnUsePotion = vi.fn();
  });

  it('应该显示抽牌堆按钮', () => {
    render(
      <BattleScreen
        battle={battle}
        player={player}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
        onUsePotion={mockOnUsePotion}
      />
    );
    
    expect(screen.getByText('抽牌堆')).toBeDefined();
    expect(screen.getByText(battle.drawPile.length.toString())).toBeDefined();
  });

  it('应该显示弃牌堆按钮', () => {
    render(
      <BattleScreen
        battle={battle}
        player={player}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
        onUsePotion={mockOnUsePotion}
      />
    );
    
    expect(screen.getByText('弃牌堆')).toBeDefined();
    // 使用更精确的选择器
    const discardPileButton = screen.getByText('弃牌堆').closest('.pile-button');
    expect(discardPileButton).toBeDefined();
    const countElement = discardPileButton.querySelector('.pile-count');
    expect(countElement).toBeDefined();
    expect(countElement.textContent).toBe(battle.discardPile.length.toString());
  });

  it('应该显示消耗堆按钮', () => {
    render(
      <BattleScreen
        battle={battle}
        player={player}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
        onUsePotion={mockOnUsePotion}
      />
    );
    
    expect(screen.getByText('消耗堆')).toBeDefined();
    // 使用更精确的选择器
    const exhaustPileButton = screen.getByText('消耗堆').closest('.pile-button');
    expect(exhaustPileButton).toBeDefined();
    const countElement = exhaustPileButton.querySelector('.pile-count');
    expect(countElement).toBeDefined();
    expect(countElement.textContent).toBe(battle.exhaustPile.length.toString());
  });

  it('点击抽牌堆应该显示卡片列表', () => {
    render(
      <BattleScreen
        battle={battle}
        player={player}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
        onUsePotion={mockOnUsePotion}
      />
    );
    
    const drawPileButton = screen.getByText('抽牌堆').closest('.pile-button');
    fireEvent.click(drawPileButton);
    
    // 应该显示卡片列表（使用getAllByText因为可能有重复）
    if (battle.drawPile.length > 0) {
      const cardNames = screen.getAllByText(battle.drawPile[0].name);
      expect(cardNames.length).toBeGreaterThan(0);
    }
    expect(screen.getByText('关闭')).toBeDefined();
  });

  it('点击弃牌堆应该显示卡片列表', () => {
    // 先打出一张牌以产生弃牌
    if (battle.hand.length > 0) {
      battle.playCard(0, 0);
    }
    
    render(
      <BattleScreen
        battle={battle}
        player={player}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
        onUsePotion={mockOnUsePotion}
      />
    );
    
    const discardPileButton = screen.getByText('弃牌堆').closest('.pile-button');
    fireEvent.click(discardPileButton);
    
    // 如果有弃牌，应该显示（使用getAllByText因为可能有重复）
    if (battle.discardPile.length > 0) {
      const cardNames = screen.getAllByText(battle.discardPile[0].name);
      expect(cardNames.length).toBeGreaterThan(0);
    }
  });

  it('应该显示药水栏当有药水时', () => {
    player.potions = [
      { id: 'strength_potion', name: '力量药水', description: '获得2点力量。' }
    ];
    
    render(
      <BattleScreen
        battle={battle}
        player={player}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
        onUsePotion={mockOnUsePotion}
      />
    );
    
    expect(screen.getByText('药水')).toBeDefined();
    expect(screen.getByText('力量药水')).toBeDefined();
  });

  it('点击药水应该调用onUsePotion', () => {
    player.potions = [
      { id: 'strength_potion', name: '力量药水', description: '获得2点力量。' }
    ];
    
    render(
      <BattleScreen
        battle={battle}
        player={player}
        onEndTurn={mockOnEndTurn}
        onPlayCard={mockOnPlayCard}
        onEndBattle={mockOnEndBattle}
        onUsePotion={mockOnUsePotion}
      />
    );
    
    const potionItem = screen.getByText('力量药水').closest('.potion-item');
    fireEvent.click(potionItem);
    
    expect(mockOnUsePotion).toHaveBeenCalledWith(0);
  });
});

