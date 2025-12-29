import { useMemo, useEffect, useRef, useState } from 'react';
import { getNodeImage } from '../utils/imageLoader.js';
import './MapScreen.css';

export default function MapScreen({ map, player, onNodeClick }) {
  if (!map) return null;

  const currentNode = map.getCurrentNode();
  const currentNodeRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  // 按层分组节点，从下到上
  const nodesByFloor = useMemo(() => {
    const grouped = map.getNodesByFloor();
    const floors = Object.keys(grouped).map(Number).sort((a, b) => a - b);
    return { grouped, floors };
  }, [map]);

  // 获取可访问的下一层节点
  const availableNextNodes = useMemo(() => {
    return map.getAvailableNextNodes();
  }, [map, currentNode]);
  
  // 获取所有连接
  const connections = useMemo(() => {
    return map.getConnections ? map.getConnections() : [];
  }, [map]);
  
  // 存储节点refs用于绘制连线
  const nodeRefs = useRef({});
  
  // 设置节点ref
  const setNodeRef = (nodeId, element) => {
    if (element) {
      nodeRefs.current[nodeId] = element;
    } else {
      delete nodeRefs.current[nodeId];
    }
  };
  
  // 当进入地图页面时，自动滚动到当前位置
  useEffect(() => {
    if (currentNodeRef.current && mapContainerRef.current) {
      // 延迟一下确保DOM已经渲染
      setTimeout(() => {
        const nodeElement = currentNodeRef.current;
        const container = mapContainerRef.current;
        
        if (nodeElement && container) {
          // 获取节点相对于容器的位置
          const nodeRect = nodeElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // 计算需要滚动的距离（让当前节点在视口中央偏下位置）
          const scrollTop = container.scrollTop + nodeRect.top - containerRect.top - (containerRect.height / 3);
          
          // 平滑滚动到当前位置
          container.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [currentNode?.id]); // 当当前节点变化时触发
  
  // 当节点位置变化时，重新绘制连线
  const [connectionUpdateTrigger, setConnectionUpdateTrigger] = useState(0);
  
  useEffect(() => {
    // 延迟更新连线，确保所有节点ref都已设置
    const timer = setTimeout(() => {
      setConnectionUpdateTrigger(prev => prev + 1);
    }, 200);
    return () => clearTimeout(timer);
  }, [nodesByFloor, connections, currentNode?.id]);

  return (
    <div className="map-screen">
      <div className="map-header">
        <h1>杀戮尖塔</h1>
        <div className="player-info">
          <div className="info-item">层数: {currentNode ? currentNode.floor + 1 : 0}/{map.maxFloor}</div>
          <div className="info-item">生命: {player.hp}/{player.maxHp}</div>
          <div className="info-item">金币: {player.gold}</div>
          <div className="info-item">遗物: {player.relics.length}</div>
        </div>
      </div>

      <div className="map-container" ref={mapContainerRef}>
        <div className="map-nodes-wrapper">
          {/* 绘制连线 */}
          <svg className="map-connections" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            {connections.map((conn, index) => {
              // 使用connectionUpdateTrigger来强制重新计算连线位置
              const _ = connectionUpdateTrigger;
              const fromNode = map.getNode(conn.from);
              const toNode = map.getNode(conn.to);
              if (!fromNode || !toNode) return null;
              
              const fromElement = nodeRefs.current[conn.from];
              const toElement = nodeRefs.current[conn.to];
              
              // 如果节点ref还没设置好，返回null（会在下次渲染时重试）
              if (!fromElement || !toElement) return null;
              
              const fromRect = fromElement.getBoundingClientRect();
              const toRect = toElement.getBoundingClientRect();
              const containerRect = mapContainerRef.current?.getBoundingClientRect();
              
              if (!containerRect) return null;
              
              // 计算相对于容器的坐标
              const fromX = fromRect.left + fromRect.width / 2 - containerRect.left + (mapContainerRef.current?.scrollLeft || 0);
              const fromY = fromRect.top + fromRect.height / 2 - containerRect.top + (mapContainerRef.current?.scrollTop || 0);
              const toX = toRect.left + toRect.width / 2 - containerRect.left + (mapContainerRef.current?.scrollLeft || 0);
              const toY = toRect.top + toRect.height / 2 - containerRect.top + (mapContainerRef.current?.scrollTop || 0);
              
              // 检查是否可访问
              const isAccessible = map.isNodeAccessible(conn.to);
              const isVisited = toNode.visited;
              
              return (
                <line
                  key={`${conn.from}-${conn.to}-${index}`}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={isAccessible && !isVisited ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'}
                  strokeWidth={isAccessible && !isVisited ? 3 : 2}
                  strokeOpacity={isVisited ? 0.3 : 0.6}
                  className="connection-line"
                />
              );
            })}
          </svg>
          
          {/* 绘制节点（从下到上） */}
          <div className="map-nodes" style={{ position: 'relative', zIndex: 1 }}>
            {nodesByFloor.floors.map((floor) => (
              <div key={floor} className="map-floor" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px',
                marginBottom: '40px',
                position: 'relative'
              }}>
                {nodesByFloor.grouped[floor].map((node) => {
                  const isCurrent = currentNode && node.id === currentNode.id;
                  // 可访问的节点：
                  // 1. 如果没有当前节点，第0层的节点都可以点击（选择起始节点）
                  // 2. 当前节点（未访问）
                  // 3. 从当前节点可达的下一层节点（未访问）
                  const isAccessible = !node.visited && map.isNodeAccessible(node.id);
                  const isVisited = node.visited;
                  // 如果没有当前节点且是第0层，可以点击；否则检查是否可访问
                  const canClick = (!currentNode && node.floor === 0 && !isVisited) || (isCurrent && !isVisited) || isAccessible;
                  
                  return (
                    <div
                      key={node.id}
                      ref={(el) => {
                        if (isCurrent) {
                          currentNodeRef.current = el;
                        }
                        setNodeRef(node.id, el);
                      }}
                      className={`map-node ${node.type} ${isVisited ? 'visited' : ''} ${isCurrent ? 'current' : ''} ${isAccessible ? 'accessible' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        // 可以点击当前节点或可访问的下一层节点
                        if (canClick && onNodeClick) {
                          onNodeClick(node);
                        }
                      }}
                      style={{ position: 'relative', cursor: canClick ? 'pointer' : 'default' }}
                    >
                      <div className="node-icon">
                        {getNodeImage(node.type) ? (
                          <img 
                            src={getNodeImage(node.type)} 
                            alt={node.type}
                            className="node-icon-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextElementSibling) {
                                e.target.nextElementSibling.style.display = 'block';
                              }
                            }}
                          />
                        ) : null}
                        <span className="node-icon-fallback" style={{ display: getNodeImage(node.type) ? 'none' : 'block' }}>
                          {node.type === 'monster' && '⚔️'}
                          {node.type === 'elite' && '👹'}
                          {node.type === 'boss' && '👑'}
                          {node.type === 'rest' && '🛏️'}
                          {node.type === 'shop' && '🛒'}
                          {node.type === 'treasure' && '💎'}
                          {node.type === 'event' && '❓'}
                        </span>
                      </div>
                      <div className="node-label">
                        {node.type === 'monster' && '战斗'}
                        {node.type === 'elite' && '精英'}
                        {node.type === 'boss' && 'Boss'}
                        {node.type === 'rest' && '休息'}
                        {node.type === 'shop' && '商店'}
                        {node.type === 'treasure' && '宝箱'}
                        {node.type === 'event' && '事件'}
                      </div>
                      {isCurrent && <div className="current-indicator">当前位置</div>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="player-deck-info">
        <h3>牌组 ({player.deck.length} 张)</h3>
        <div className="deck-preview">
          {player.deck.slice(0, 10).map((card, index) => (
            <span key={index} className="deck-card-preview">{card.name}</span>
          ))}
          {player.deck.length > 10 && <span>...</span>}
        </div>
      </div>

      <div className="player-relics">
        <h3>遗物</h3>
        <div className="relics-list">
          {player.relics.map((relic, index) => (
            <div key={index} className="relic-item" title={relic.description}>
              {relic.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

