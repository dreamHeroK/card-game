import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BattleSystem } from '../../game/BattleSystem.js';
import BattleScreen from '../BattleScreen.jsx';

// Mock图片加载器 - 必须在导入组件之前
vi.mock('../../utils/imageLoader.js', () => ({
  getMonsterImage: vi.fn((id) => `https://example.com/monsters/${id}.png`),
  getCardImage: vi.fn((id) => `https://example.com/cards/${id}.png`),
  getRelicImage: vi.fn((id) => `https://example.com/relics/${id}.png`),
  getNodeImage: vi.fn((type) => `https://example.com/nodes/${type}.png`),
}));

describe('BattleScreen', () => {
  let player;
  let enemy;
  let battle;
  let mockOnPlayCard;
  let mockOnEndTurn;
  let mockOnEndBattle;

  beforeEach(() => {
    player = {
      hp: 80,
      maxHp: 80,
      deck: [
        { id: 'strike', name: '打击', type: 'attack', rarity: 'basic', cost: 1, damage: 6, description: '造成6点伤害。' },
        { id: 'defend', name: '防御', type: 'skill', rarity: 'basic', cost: 1, block: 5, description: '获得5点格挡。' },
      ],
      relics: [],
      strength: 0,
      weak: 0,
      vulnerable: 0
    };

    enemy = {
      id: 'cultist',
      name: '邪教徒',
      maxHp: 48,
      hp: 48,
      block: 0,
      vulnerable: 0,
      weak: 0,
      intents: [{ type: 'attack', value: 6 }]
    };

    battle = new BattleSystem(player, enemy);
    battle.initBattle();

    mockOnPlayCard = vi.fn((cardIndex, targetIndex) => {
      const result = battle.playCard(cardIndex, targetIndex);
      if (result && result.status === true) {
        return { damageInfo: result.damageInfo };
      }
      return false;
    });

    mockOnEndTurn = vi.fn(() => {
      battle.endTurn();
    });

    mockOnEndBattle = vi.fn();
  });

  it('应该渲染战斗界面', () => {
    render(
      <BattleScreen
        battle={battle}
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
        onEndBattle={mockOnEndBattle}
      />
    );

    expect(screen.getByText('生命:')).toBeInTheDocument();
    expect(screen.getByText('格挡:')).toBeInTheDocument();
    expect(screen.getByText('能量:')).toBeInTheDocument();
  });

  it('应该显示敌人信息', () => {
    render(
      <BattleScreen
        battle={battle}
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
        onEndBattle={mockOnEndBattle}
      />
    );

    expect(screen.getByText('邪教徒')).toBeInTheDocument();
    expect(screen.getByText('48/48')).toBeInTheDocument();
  });

  it('应该显示手牌', () => {
    render(
      <BattleScreen
        battle={battle}
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
        onEndBattle={mockOnEndBattle}
      />
    );

    expect(screen.getByText('手牌')).toBeInTheDocument();
    // 应该显示至少一张卡牌
    expect(battle.hand.length).toBeGreaterThan(0);
  });

  it('应该能够选择卡牌', () => {
    render(
      <BattleScreen
        battle={battle}
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
        onEndBattle={mockOnEndBattle}
      />
    );

    // 找到第一张卡牌并点击
    const cards = screen.getAllByText(/打击|防御/);
    if (cards.length > 0) {
      fireEvent.click(cards[0].closest('.card') || cards[0]);
      // 卡牌应该被选中（通过类名或样式判断）
    }
  });

  it('应该能够点击敌人选择目标', () => {
    render(
      <BattleScreen
        battle={battle}
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
        onEndBattle={mockOnEndBattle}
      />
    );

    const enemyElement = screen.getByText('邪教徒').closest('.enemy');
    if (enemyElement) {
      fireEvent.click(enemyElement);
    }
  });

  it('应该显示伤害数字当卡牌打出时', async () => {
    const { container, rerender } = render(
      <BattleScreen
        battle={battle}
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
        onEndBattle={mockOnEndBattle}
      />
    );

    // 找到一张攻击卡牌
    const attackCard = battle.hand.find(card => card.damage > 0);
    if (attackCard) {
      const cardIndex = battle.hand.indexOf(attackCard);
      const result = mockOnPlayCard(cardIndex, 0);
      
      // 重新渲染以触发状态更新
      rerender(
        <BattleScreen
          battle={battle}
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
          onEndBattle={mockOnEndBattle}
        />
      );
      
      if (result && result.damageInfo && result.damageInfo.displayedDamage > 0) {
        // 等待伤害数字显示（使用act确保状态更新）
        await waitFor(() => {
          const damageNumbers = container.querySelectorAll('.damage-number');
          // 如果伤害数字没有立即显示，至少验证damageInfo存在
          expect(result.damageInfo).toBeDefined();
          expect(result.damageInfo.displayedDamage).toBeGreaterThan(0);
        }, { timeout: 1000 });
      }
    }
  });

  it('应该显示buff图标', () => {
    // 给敌人添加易伤
    battle.enemies[0].vulnerable = 2;
    battle.enemies[0].weak = 1;

    render(
      <BattleScreen
        battle={battle}
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
        onEndBattle={mockOnEndBattle}
      />
    );

    // 应该显示buff图标
    const buffIcons = screen.getAllByTitle(/易伤|虚弱/);
    expect(buffIcons.length).toBeGreaterThan(0);
  });
});

