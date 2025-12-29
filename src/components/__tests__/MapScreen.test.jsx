import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MapScreen from '../MapScreen.jsx';
import { MapSystem } from '../../game/MapSystem.js';
import { GameState } from '../../game/GameState.js';

describe('MapScreen', () => {
  let mapSystem;
  let gameState;
  let mockOnNodeClick;

  beforeEach(() => {
    // 创建地图系统
    mapSystem = new MapSystem(1);
    
    // 创建游戏状态
    gameState = new GameState('ironclad');
    
    // Mock点击处理函数
    mockOnNodeClick = vi.fn();
  });

  it('应该渲染地图界面', () => {
    render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={mockOnNodeClick}
      />
    );
    
    expect(screen.getByText('杀戮尖塔')).toBeDefined();
  });

  it('应该显示玩家信息', () => {
    render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={mockOnNodeClick}
      />
    );
    
    expect(screen.getByText(/生命:/)).toBeDefined();
    expect(screen.getByText(/金币:/)).toBeDefined();
  });

  it('应该能够点击当前节点', () => {
    // 先选择一个起始节点
    const startNodes = mapSystem.nodes.filter(n => n.floor === 0);
    mapSystem.moveToNode(startNodes[0].id);
    
    render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={mockOnNodeClick}
      />
    );
    
    // 获取当前节点
    const currentNode = mapSystem.getCurrentNode();
    expect(currentNode).toBeDefined();
    
    // 查找当前节点元素（通过类型或文本）
    const nodeElements = screen.getAllByText(/战斗|精英|Boss|休息|商店|宝箱|事件/);
    
    // 尝试点击第一个节点（通常是当前节点）
    if (nodeElements.length > 0) {
      const currentNodeElement = nodeElements[0].closest('.map-node');
      if (currentNodeElement) {
        fireEvent.click(currentNodeElement);
        
        // 验证点击事件被调用
        expect(mockOnNodeClick).toHaveBeenCalled();
      }
    }
  });

  it('应该能够点击可访问的下一层节点', () => {
    render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={mockOnNodeClick}
      />
    );
    
    // 获取可访问的下一层节点
    const availableNodes = mapSystem.getAvailableNextNodes();
    
    if (availableNodes.length > 0) {
      const targetNode = availableNodes[0];
      
      // 查找对应的节点元素
      const nodeElements = screen.getAllByText(/战斗|精英|Boss|休息|商店|宝箱|事件/);
      
      // 尝试找到并点击目标节点
      for (const element of nodeElements) {
        const nodeElement = element.closest('.map-node');
        if (nodeElement && nodeElement.dataset.nodeId === targetNode.id) {
          fireEvent.click(nodeElement);
          expect(mockOnNodeClick).toHaveBeenCalled();
          break;
        }
      }
    }
  });

  it('不应该能够点击已访问的节点', () => {
    render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={mockOnNodeClick}
      />
    );
    
    // 获取当前节点并标记为已访问
    const currentNode = mapSystem.getCurrentNode();
    if (currentNode) {
      mapSystem.visitNode(currentNode.id);
      
      // 重新渲染
      const { rerender } = render(
        <MapScreen
          map={mapSystem}
          player={gameState}
          onNodeClick={mockOnNodeClick}
        />
      );
      
      // 尝试点击已访问的节点
      const nodeElements = screen.getAllByText(/战斗|精英|Boss|休息|商店|宝箱|事件/);
      if (nodeElements.length > 0) {
        const visitedNodeElement = nodeElements[0].closest('.map-node');
        if (visitedNodeElement && visitedNodeElement.classList.contains('visited')) {
          const clickCountBefore = mockOnNodeClick.mock.calls.length;
          fireEvent.click(visitedNodeElement);
          // 点击已访问的节点不应该触发事件
          expect(mockOnNodeClick.mock.calls.length).toBe(clickCountBefore);
        }
      }
    }
  });

  it('点击节点应该传递正确的节点数据', () => {
    // 先选择一个起始节点
    const startNodes = mapSystem.nodes.filter(n => n.floor === 0);
    mapSystem.moveToNode(startNodes[0].id);
    
    render(
      <MapScreen
        map={mapSystem}
        player={gameState}
        onNodeClick={mockOnNodeClick}
      />
    );
    
    const currentNode = mapSystem.getCurrentNode();
    expect(currentNode).toBeDefined();
    
    // 查找并点击当前节点
    const nodeElements = screen.getAllByText(/战斗|精英|Boss|休息|商店|宝箱|事件/);
    if (nodeElements.length > 0) {
      const currentNodeElement = nodeElements[0].closest('.map-node');
      if (currentNodeElement) {
        fireEvent.click(currentNodeElement);
        
        // 验证传递的节点数据
        expect(mockOnNodeClick).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            type: expect.any(String),
            floor: expect.any(Number)
          })
        );
      }
    }
  });

  it('应该阻止事件冒泡', () => {
    const parentClickHandler = vi.fn();
    
    render(
      <div onClick={parentClickHandler}>
        <MapScreen
          map={mapSystem}
          player={gameState}
          onNodeClick={mockOnNodeClick}
        />
      </div>
    );
    
    const nodeElements = screen.getAllByText(/战斗|精英|Boss|休息|商店|宝箱|事件/);
    if (nodeElements.length > 0) {
      const currentNodeElement = nodeElements[0].closest('.map-node');
      if (currentNodeElement) {
        fireEvent.click(currentNodeElement);
        
        // 验证父元素的点击事件没有被触发
        expect(parentClickHandler).not.toHaveBeenCalled();
        expect(mockOnNodeClick).toHaveBeenCalled();
      }
    }
  });
});

