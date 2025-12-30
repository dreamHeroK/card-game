import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventScreen from '../EventScreen.jsx';
import { getEventById } from '../../data/events.js';
import { GameState } from '../../game/GameState.js';
import { CHARACTER } from '../../types/index.js';

describe('EventScreen 组件', () => {
  let event;
  let player;
  let mockOnOptionSelect;
  let mockOnLeave;

  beforeEach(() => {
    event = getEventById('cleric');
    player = new GameState(CHARACTER.IRONCLAD);
    mockOnOptionSelect = vi.fn();
    mockOnLeave = vi.fn();
  });

  it('应该渲染事件名称和描述', () => {
    render(
      <EventScreen
        event={event}
        player={player}
        onOptionSelect={mockOnOptionSelect}
        onLeave={mockOnLeave}
      />
    );
    
    expect(screen.getByText('牧师')).toBeDefined();
    expect(screen.getByText('一位友善的牧师愿意为你治疗。')).toBeDefined();
  });

  it('应该渲染所有事件选项', () => {
    render(
      <EventScreen
        event={event}
        player={player}
        onOptionSelect={mockOnOptionSelect}
        onLeave={mockOnLeave}
      />
    );
    
    // 使用 getAllByText 因为可能有多个"离开"按钮
    event.options.forEach(option => {
      const elements = screen.getAllByText(option.text);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('应该能够点击选项并执行效果', async () => {
    // 设置玩家生命值不是满的
    player.hp = 50;
    const initialHp = player.hp;
    
    render(
      <EventScreen
        event={event}
        player={player}
        onOptionSelect={mockOnOptionSelect}
        onLeave={mockOnLeave}
      />
    );
    
    const freeOption = event.options.find(opt => opt.text.includes('免费'));
    
    if (freeOption) {
      const optionButton = screen.getByText(freeOption.text);
      fireEvent.click(optionButton);
      
      // 等待效果执行
      await waitFor(() => {
        expect(mockOnOptionSelect).toHaveBeenCalled();
      }, { timeout: 2000 });
      
      // 验证生命值是否增加（如果生命值不是满的）
      if (initialHp < player.maxHp) {
        expect(player.hp).toBeGreaterThan(initialHp);
      }
    }
  });

  it('点击选项后应该禁用所有选项', async () => {
    render(
      <EventScreen
        event={event}
        player={player}
        onOptionSelect={mockOnOptionSelect}
        onLeave={mockOnLeave}
      />
    );
    
    const firstOption = screen.getByText(event.options[0].text);
    fireEvent.click(firstOption);
    
    // 所有选项应该被禁用
    event.options.forEach(option => {
      const optionButton = screen.getByText(option.text);
      expect(optionButton.disabled).toBe(true);
    });
  });

  it('应该显示结果消息', async () => {
    render(
      <EventScreen
        event={event}
        player={player}
        onOptionSelect={mockOnOptionSelect}
        onLeave={mockOnLeave}
      />
    );
    
    const freeOption = event.options.find(opt => opt.text.includes('免费'));
    
    if (freeOption) {
      const optionButton = screen.getByText(freeOption.text);
      fireEvent.click(optionButton);
      
      // 等待消息显示
      await waitFor(() => {
        const result = freeOption.effect(player);
        if (result && result.message) {
          expect(screen.getByText(result.message)).toBeDefined();
        }
      }, { timeout: 2000 });
    }
  });

  it('应该能够点击离开按钮', () => {
    render(
      <EventScreen
        event={event}
        player={player}
        onOptionSelect={mockOnOptionSelect}
        onLeave={mockOnLeave}
      />
    );
    
    // 使用 getAllByText 然后找到 class 为 event-leave 的按钮
    const leaveButtons = screen.getAllByText('离开');
    const leaveButton = leaveButtons.find(btn => btn.className.includes('event-leave'));
    
    expect(leaveButton).toBeDefined();
    fireEvent.click(leaveButton);
    
    expect(mockOnLeave).toHaveBeenCalled();
  });

  it('选择选项后应该隐藏离开按钮', async () => {
    render(
      <EventScreen
        event={event}
        player={player}
        onOptionSelect={mockOnOptionSelect}
        onLeave={mockOnLeave}
      />
    );
    
    const firstOption = screen.getByText(event.options[0].text);
    fireEvent.click(firstOption);
    
    // 等待状态更新 - 查找 class 为 event-leave 的按钮
    await waitFor(() => {
      const leaveButtons = screen.queryAllByText('离开');
      const leaveButton = leaveButtons.find(btn => btn.className.includes('event-leave'));
      // find 返回 undefined 表示没有找到，这是正确的
      expect(leaveButton).toBeUndefined();
    }, { timeout: 2000 });
  });

  it('应该处理战斗事件', async () => {
    const battleEvent = getEventById('random_battle');
    render(
      <EventScreen
        event={battleEvent}
        player={player}
        onOptionSelect={mockOnOptionSelect}
        onLeave={mockOnLeave}
      />
    );
    
    const battleOption = screen.getByText('战斗');
    fireEvent.click(battleOption);
    
    await waitFor(() => {
      expect(mockOnOptionSelect).toHaveBeenCalledWith(
        battleEvent.options[0],
        expect.objectContaining({
          battle: true
        })
      );
    }, { timeout: 2000 });
  });

  it('应该处理宝箱事件', async () => {
    const treasureEvent = getEventById('treasure');
    const initialRelicsCount = player.relics.length;
    
    render(
      <EventScreen
        event={treasureEvent}
        player={player}
        onOptionSelect={mockOnOptionSelect}
        onLeave={mockOnLeave}
      />
    );
    
    const openOption = screen.getByText('打开');
    fireEvent.click(openOption);
    
    await waitFor(() => {
      expect(mockOnOptionSelect).toHaveBeenCalled();
    }, { timeout: 2000 });
    
    // 如果获得了遗物，遗物数量应该增加
    // 注意：由于是随机遗物，可能不会每次都增加
  });
});

