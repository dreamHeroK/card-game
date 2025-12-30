import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BattleRewardScreen from '../BattleRewardScreen.jsx';

describe('BattleRewardScreen 组件', () => {
  let mockReward;
  let mockOnAccept;

  beforeEach(() => {
    mockOnAccept = vi.fn();
    mockReward = {
      gold: 25,
      cardChoices: [
        {
          id: 'strike',
          name: '打击',
          cost: 1,
          damage: 6,
          description: '造成6点伤害。'
        },
        {
          id: 'defend',
          name: '防御',
          cost: 1,
          block: 5,
          description: '获得5点格挡。'
        },
        {
          id: 'bash',
          name: '重击',
          cost: 2,
          damage: 8,
          description: '造成8点伤害。给予2层易伤。'
        }
      ],
      relic: {
        id: 'test_relic',
        name: '测试遗物',
        description: '测试用遗物'
      },
      potion: {
        id: 'strength_potion',
        name: '力量药水',
        description: '获得2点力量。'
      },
      isElite: false,
      isBoss: false
    };
  });

  it('应该渲染奖励标题', () => {
    render(
      <BattleRewardScreen
        reward={mockReward}
        onAccept={mockOnAccept}
      />
    );
    
    expect(screen.getByText('战斗胜利！')).toBeDefined();
  });

  it('应该显示金币奖励', () => {
    render(
      <BattleRewardScreen
        reward={mockReward}
        onAccept={mockOnAccept}
      />
    );
    
    expect(screen.getByText('金币奖励')).toBeDefined();
    expect(screen.getByText(`+${mockReward.gold} 金币`)).toBeDefined();
  });

  it('应该显示卡牌选择', () => {
    render(
      <BattleRewardScreen
        reward={mockReward}
        onAccept={mockOnAccept}
      />
    );
    
    expect(screen.getByText('选择一张卡牌加入牌组')).toBeDefined();
    mockReward.cardChoices.forEach(card => {
      expect(screen.getByText(card.name)).toBeDefined();
    });
  });

  it('应该能够选择卡牌', () => {
    render(
      <BattleRewardScreen
        reward={mockReward}
        onAccept={mockOnAccept}
      />
    );
    
    const firstCard = screen.getByText(mockReward.cardChoices[0].name).closest('.card-choice');
    fireEvent.click(firstCard);
    
    expect(firstCard.classList.contains('selected')).toBe(true);
  });

  it('应该能够跳过卡牌选择', () => {
    render(
      <BattleRewardScreen
        reward={mockReward}
        onAccept={mockOnAccept}
      />
    );
    
    const skipButton = screen.getByText('跳过');
    fireEvent.click(skipButton);
    
    expect(mockOnAccept).toHaveBeenCalledWith(null, true, true);
  });

  it('应该显示遗物奖励', () => {
    render(
      <BattleRewardScreen
        reward={mockReward}
        onAccept={mockOnAccept}
      />
    );
    
    expect(screen.getByText('遗物奖励')).toBeDefined();
    expect(screen.getByText(mockReward.relic.name)).toBeDefined();
    expect(screen.getByText(mockReward.relic.description)).toBeDefined();
  });

  it('应该显示药水奖励', () => {
    render(
      <BattleRewardScreen
        reward={mockReward}
        onAccept={mockOnAccept}
      />
    );
    
    expect(screen.getByText('药水奖励')).toBeDefined();
    expect(screen.getByText(mockReward.potion.name)).toBeDefined();
    expect(screen.getByText(mockReward.potion.description)).toBeDefined();
  });

  it('应该能够接受奖励', () => {
    render(
      <BattleRewardScreen
        reward={mockReward}
        onAccept={mockOnAccept}
      />
    );
    
    // 选择第一张卡牌
    const firstCard = screen.getByText(mockReward.cardChoices[0].name).closest('.card-choice');
    fireEvent.click(firstCard);
    
    // 点击接受按钮
    const acceptButton = screen.getByText('接受奖励');
    fireEvent.click(acceptButton);
    
    expect(mockOnAccept).toHaveBeenCalledWith(0, true, true);
  });

  it('没有遗物时不应该显示遗物奖励', () => {
    const rewardWithoutRelic = {
      ...mockReward,
      relic: null
    };
    
    render(
      <BattleRewardScreen
        reward={rewardWithoutRelic}
        onAccept={mockOnAccept}
      />
    );
    
    expect(screen.queryByText('遗物奖励')).toBeNull();
  });

  it('没有药水时不应该显示药水奖励', () => {
    const rewardWithoutPotion = {
      ...mockReward,
      potion: null
    };
    
    render(
      <BattleRewardScreen
        reward={rewardWithoutPotion}
        onAccept={mockOnAccept}
      />
    );
    
    expect(screen.queryByText('药水奖励')).toBeNull();
  });
});

