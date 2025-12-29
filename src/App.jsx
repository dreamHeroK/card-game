import { useState, useEffect, useRef } from 'react';
import { GameState } from './game/GameState.js';
import { CHARACTER } from './types/index.js';
import BattleScreen from './components/BattleScreen.jsx';
import ShopScreen from './components/ShopScreen.jsx';
import MapScreen from './components/MapScreen.jsx';
import RestScreen from './components/RestScreen.jsx';
import './App.css';

function App() {
  const [gameState, setGameState] = useState(null);
  const [character, setCharacter] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0); // 用于强制更新的触发器
  const gameStateRef = useRef(null); // 使用ref来保持类实例引用
  
  // 更新游戏状态的辅助函数，保持类实例
  const updateGameState = (updater) => {
    if (typeof updater === 'function') {
      const newState = updater(gameStateRef.current);
      if (newState !== undefined) {
        gameStateRef.current = newState;
      }
    } else {
      gameStateRef.current = updater;
    }
    // 触发React重新渲染 - 使用触发器强制更新
    setUpdateTrigger(prev => prev + 1);
    // 创建新对象引用确保React检测到变化
    setGameState({ ...gameStateRef.current, _updateTime: Date.now() });
  };

  // 初始化游戏
  const startGame = (selectedCharacter) => {
    const game = new GameState(selectedCharacter);
    gameStateRef.current = game; // 保存到ref
    setGameState(game);
    setCharacter(selectedCharacter);
  };

  // 处理卡牌打出
  const handlePlayCard = (cardIndex, targetIndex) => {
    if (!gameStateRef.current || !gameStateRef.current.battle) return false;
    const result = gameStateRef.current.battle.playCard(cardIndex, targetIndex);
    
    if (!result) return false;
    
    // 处理战斗状态
    if (result.status === 'victory' || result.status === 'defeat') {
      // 战斗结束
      handleEndBattle(result.status === 'victory');
      return { damageInfo: result.damageInfo };
    } else if (result.status === true) {
      // 卡牌成功打出，继续战斗
      updateGameState(state => state); // 触发更新
      return { damageInfo: result.damageInfo };
    }
    
    return false;
  };

  // 处理结束回合
  const handleEndTurn = () => {
    if (!gameStateRef.current || !gameStateRef.current.battle) return;
    const result = gameStateRef.current.battle.endTurn();
    updateGameState(state => state); // 触发更新
    
    if (result === 'victory' || result === 'defeat') {
      handleEndBattle(result === 'victory');
    }
  };

  // 处理战斗结束
  const handleEndBattle = (victory) => {
    if (!gameStateRef.current) return;
    
    // 直接调用endBattle方法
    gameStateRef.current.endBattle(victory);
    
    // 触发更新
    updateGameState(state => state);
  };

  // 处理节点点击
  const handleNodeClick = (node) => {
    if (!gameStateRef.current) return;
    
    const currentNode = gameStateRef.current.map.getCurrentNode();
    
    // 如果节点已访问，不能再次点击
    if (node.visited) return;
    
    // 确定要处理的节点（如果是当前节点，使用当前节点；否则移动到目标节点）
    let targetNode = node;
    
    // 如果没有当前节点，且点击的是第0层的节点，设置为当前节点
    if (!currentNode && node.floor === 0) {
      // 移动到该节点（设置为当前节点）
      const movedNode = gameStateRef.current.map.moveToNode(node.id);
      if (!movedNode) return;
      targetNode = gameStateRef.current.map.getCurrentNode();
    } else if (currentNode && currentNode.id === node.id) {
      // 如果是当前节点，直接处理（不需要移动）
      targetNode = currentNode; // 使用当前节点的完整数据
    } else {
      // 检查是否可以移动到该节点
      if (!gameStateRef.current.map.isNodeAccessible(node.id)) {
        return; // 不可访问
      }
      
      // 移动到节点
      const movedNode = gameStateRef.current.map.moveToNode(node.id);
      if (!movedNode) return;
      
      // 更新targetNode为移动后的节点
      targetNode = gameStateRef.current.map.getCurrentNode();
    }
    
    // 标记为已访问
    gameStateRef.current.map.visitNode(targetNode.id);
    
    // 根据节点类型处理
    switch (targetNode.type) {
      case 'monster':
      case 'elite':
      case 'boss':
        // 使用目标节点的data
        const monster = targetNode.data?.monster;
        
        if (monster) {
          // 创建怪物实例
          const enemy = {
            ...monster,
            hp: monster.maxHp,
            block: 0,
            vulnerable: 0,
            weak: 0
          };
          gameStateRef.current.startBattle(enemy);
          updateGameState(state => state);
        }
        break;
      case 'shop':
        gameStateRef.current.enterShop();
        updateGameState(state => state);
        break;
      case 'rest':
        gameStateRef.current.enterRest();
        updateGameState(state => state);
        break;
      case 'treasure':
        // 处理宝箱
        const relic = targetNode.data?.relic;
        if (relic) {
          // 添加遗物到玩家
          gameStateRef.current.relics.push(relic);
          updateGameState(state => state);
        }
        break;
      case 'event':
        // 处理事件（简化，暂时当作普通战斗或显示事件界面）
        const eventMonster = targetNode.data?.monster;
        if (eventMonster) {
          const enemy = {
            ...eventMonster,
            hp: eventMonster.maxHp,
            block: 0,
            vulnerable: 0,
            weak: 0
          };
          gameStateRef.current.startBattle(enemy);
          updateGameState(state => state);
        } else {
          // 如果没有怪物，就只是标记为已访问
          updateGameState(state => state);
        }
        break;
      default:
        break;
    }
  };

  // 处理商店购买
  const handleBuyCard = (index) => {
    if (!gameStateRef.current || !gameStateRef.current.shop) return;
    const success = gameStateRef.current.shop.buyCard(index);
    if (success) {
      updateGameState(state => state);
    }
  };

  const handleBuyRelic = (index) => {
    if (!gameStateRef.current || !gameStateRef.current.shop) return;
    const success = gameStateRef.current.shop.buyRelic(index);
    if (success) {
      updateGameState(state => state);
    }
  };

  const handleBuyPotion = (index) => {
    if (!gameStateRef.current || !gameStateRef.current.shop) return;
    const success = gameStateRef.current.shop.buyPotion(index);
    if (success) {
      updateGameState(state => state);
    }
  };

  const handleRemoveCard = (index) => {
    if (!gameStateRef.current || !gameStateRef.current.shop) return;
    const success = gameStateRef.current.shop.removeCard(index);
    if (success) {
      updateGameState(state => state);
    }
  };

  const handleLeaveShop = () => {
    if (!gameStateRef.current) return;
    gameStateRef.current.leaveShop();
    gameStateRef.current.map.visitNode();
    updateGameState(state => state);
  };

  // 处理休息
  const handleRest = () => {
    if (!gameStateRef.current) return;
    gameStateRef.current.rest();
    gameStateRef.current.map.visitNode();
    updateGameState(state => state);
  };

  const handleUpgrade = (cardIndex) => {
    if (!gameStateRef.current) return;
    const success = gameStateRef.current.upgradeCard(cardIndex);
    if (success) {
      gameStateRef.current.map.visitNode();
      updateGameState(state => state);
    }
  };

  const handleLeaveRest = () => {
    if (!gameStateRef.current) return;
    gameStateRef.current.currentScreen = 'map';
    updateGameState(state => state);
  };

  // 确保ref和state同步
  useEffect(() => {
    if (gameState && gameStateRef.current !== gameState) {
      // 如果state是展开的对象，需要从ref恢复类实例
      if (gameStateRef.current && gameStateRef.current instanceof GameState) {
        // ref已经是最新的，不需要更新
      } else {
        gameStateRef.current = gameState;
      }
    }
  }, [gameState]);

  // 角色选择界面
  if (!gameState) {
    return (
      <div className="character-select">
        <h1>选择角色</h1>
        <div className="characters">
          <div className="character-card" onClick={() => startGame(CHARACTER.IRONCLAD)}>
            <h2>铁甲战士</h2>
            <p>起始生命: 80</p>
            <p>起始遗物: 燃烧之血</p>
            <p>战斗结束时恢复6点生命</p>
          </div>
          <div className="character-card" onClick={() => startGame(CHARACTER.SILENT)}>
            <h2>静默猎手</h2>
            <p>起始生命: 70</p>
            <p>起始遗物: 蛇之戒指</p>
            <p>每场战斗开始时抽2张牌</p>
          </div>
          <div className="character-card" onClick={() => startGame(CHARACTER.DEFECT)}>
            <h2>故障机器人</h2>
            <p>起始生命: 75</p>
            <p>起始遗物: 破碎核心</p>
            <p>战斗开始时充能1个充能球栏位</p>
          </div>
          <div className="character-card" onClick={() => startGame(CHARACTER.WATCHER)}>
            <h2>观者</h2>
            <p>起始生命: 72</p>
            <p>起始遗物: 纯净之水</p>
            <p>战斗开始时将1张奇迹加入手牌</p>
          </div>
        </div>
      </div>
    );
  }

  // 根据当前屏幕显示对应组件
  // 使用gameStateRef.current来获取最新状态，因为gameState可能是旧引用
  const currentScreen = gameStateRef.current?.currentScreen || gameState?.currentScreen;
  const battle = gameStateRef.current?.battle || gameState?.battle;
  
  return (
    <div className="app">
      {currentScreen === 'battle' && battle && (
        <BattleScreen
          battle={battle}
          onPlayCard={handlePlayCard}
          onEndTurn={handleEndTurn}
          onEndBattle={handleEndBattle}
        />
      )}
      
      {currentScreen === 'shop' && gameStateRef.current?.shop && (
        <ShopScreen
          shop={gameStateRef.current.shop}
          player={gameStateRef.current}
          onBuyCard={handleBuyCard}
          onBuyRelic={handleBuyRelic}
          onBuyPotion={handleBuyPotion}
          onRemoveCard={handleRemoveCard}
          onLeave={handleLeaveShop}
        />
      )}
      
      {currentScreen === 'rest' && (
        <RestScreen
          player={gameStateRef.current || gameState}
          onRest={handleRest}
          onUpgrade={handleUpgrade}
          onLeave={handleLeaveRest}
        />
      )}
      
      {currentScreen === 'map' && gameStateRef.current?.map && (
        <MapScreen
          map={gameStateRef.current.map}
          player={gameStateRef.current}
          onNodeClick={handleNodeClick}
        />
      )}
    </div>
  );
}

export default App;
