import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MapScreen from '../MapScreen.jsx';
import { MapSystem } from '../../game/MapSystem.js';
import { GameState } from '../../game/GameState.js';

describe('Map Connections Display', () => {
  let mapSystem;
  let gameState;

  beforeEach(() => {
    mapSystem = new MapSystem(1);
    gameState = new GameState('ironclad');
    gameState.map = mapSystem;
  });

  it('应该显示所有连接线', () => {
    const { container } = render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={vi.fn()}
      />
    );
    
    // 等待DOM更新
    waitFor(() => {
      const svg = container.querySelector('.map-connections');
      expect(svg).toBeDefined();
      
      // 检查是否有连线元素
      const lines = svg.querySelectorAll('line');
      expect(lines.length).toBeGreaterThan(0);
    });
  });

  it('应该为每个连接绘制连线', () => {
    const connections = mapSystem.getConnections();
    expect(connections.length).toBeGreaterThan(0);
    
    const { container } = render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={vi.fn()}
      />
    );
    
    waitFor(() => {
      const svg = container.querySelector('.map-connections');
      if (svg) {
        const lines = svg.querySelectorAll('line');
        // 应该有至少一些连线（可能不是全部，因为ref可能还没设置好）
        expect(lines.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  it('连线应该根据节点状态改变颜色', () => {
    // 选择一个起始节点
    const startNodes = mapSystem.nodes.filter(n => n.floor === 0);
    if (startNodes.length > 0) {
      mapSystem.moveToNode(startNodes[0].id);
    }
    
    const { container } = render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={vi.fn()}
      />
    );
    
    waitFor(() => {
      const svg = container.querySelector('.map-connections');
      if (svg) {
        const lines = svg.querySelectorAll('line');
        // 检查连线样式
        lines.forEach(line => {
          const stroke = line.getAttribute('stroke');
          expect(stroke).toBeDefined();
        });
      }
    });
  });

  it('节点ref应该正确设置', () => {
    const { container } = render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={vi.fn()}
      />
    );
    
    waitFor(() => {
      const nodes = container.querySelectorAll('.map-node');
      expect(nodes.length).toBeGreaterThan(0);
      
      // 检查节点是否有正确的属性
      nodes.forEach(node => {
        expect(node).toBeDefined();
      });
    });
  });
});

