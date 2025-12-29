import { useState, useEffect } from 'react';
import { getMonsterImage, getCardImage } from '../utils/imageLoader.js';
// import { getCachedMoegirlImageUrl } from '../utils/imageApi.js'; // 可选：使用API获取图片
import './BattleScreen.css';

export default function BattleScreen({ battle, onEndTurn, onPlayCard, onEndBattle }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [damageNumbers, setDamageNumbers] = useState([]); // 伤害数字显示

  if (!battle) return null;

  const handleCardClick = (cardIndex) => {
    if (selectedCard === cardIndex) {
      // 如果点击已选中的卡牌，取消选择
      setSelectedCard(null);
    } else {
      setSelectedCard(cardIndex);
    }
  };

  const handlePlayCard = () => {
    if (selectedCard !== null) {
      const result = onPlayCard(selectedCard, selectedTarget);
      if (result) {
        setSelectedCard(null);
        
        // 显示伤害数字
        if (result.damageInfo) {
          showDamageNumbers(result.damageInfo);
        }
      }
    }
  };
  
  // 显示伤害数字
  const showDamageNumbers = (damageInfo) => {
    const newNumbers = [];
    
    if (damageInfo.isAOE && damageInfo.hits) {
      // AOE伤害
      damageInfo.hits.forEach((hit, index) => {
        if (hit.displayedDamage > 0) {
          newNumbers.push({
            id: Date.now() + index,
            targetIndex: hit.targetIndex,
            damage: hit.displayedDamage,
            blocked: hit.blocked || 0,
            x: Math.random() * 50 - 25, // 随机位置
            y: Math.random() * 50 - 25
          });
        }
      });
    } else if (damageInfo.isMultiHit && damageInfo.hits) {
      // 多次攻击
      damageInfo.hits.forEach((hit, index) => {
        if (hit.displayedDamage > 0) {
          newNumbers.push({
            id: Date.now() + index,
            targetIndex: damageInfo.targetIndex,
            damage: hit.displayedDamage,
            blocked: hit.blocked || 0,
            x: Math.random() * 50 - 25,
            y: Math.random() * 50 - 25
          });
        }
      });
    } else if (damageInfo.displayedDamage > 0) {
      // 单次伤害
      newNumbers.push({
        id: Date.now(),
        targetIndex: damageInfo.targetIndex,
        damage: damageInfo.displayedDamage,
        blocked: damageInfo.blocked || 0,
        x: Math.random() * 50 - 25,
        y: Math.random() * 50 - 25
      });
    }
    
    if (newNumbers.length > 0) {
      setDamageNumbers(prev => [...prev, ...newNumbers]);
      
      // 2秒后移除伤害数字
      setTimeout(() => {
        setDamageNumbers(prev => prev.filter(n => !newNumbers.find(newN => newN.id === n.id)));
      }, 2000);
    }
  };

  const handleEnemyClick = (index) => {
    setSelectedTarget(index);
    if (selectedCard !== null) {
      handlePlayCard();
    }
  };

  // 检查战斗状态
  useEffect(() => {
    if (!battle) return;
    
    // 检查敌人生命值
    const enemyHpChanged = battle.enemies.some(e => e.hp <= 0);
    const playerHp = battle.player?.hp || 0;
    
    if (enemyHpChanged || playerHp <= 0) {
      const state = battle.checkBattleState();
      if (state === 'victory' || state === 'defeat') {
        onEndBattle(state === 'victory');
      }
    }
  }, [battle?.player?.hp, battle?.enemies?.map(e => e.hp).join(','), onEndBattle]);

  return (
    <div className="battle-screen">
      <div className="battle-header">
        <div className="player-stats">
          <div className="stat">
            <span className="stat-label">生命:</span>
            <span className="stat-value">{battle.player.hp}/{battle.player.maxHp}</span>
          </div>
          <div className="stat">
            <span className="stat-label">格挡:</span>
            <span className="stat-value">{battle.block}</span>
          </div>
          <div className="stat">
            <span className="stat-label">能量:</span>
            <span className="stat-value">{battle.energy}/{battle.maxEnergy}</span>
          </div>
          {battle.player.strength > 0 && (
            <div className="stat">
              <span className="stat-label">力量:</span>
              <span className="stat-value">{battle.player.strength}</span>
            </div>
          )}
        </div>
      </div>

      <div className="enemies-container">
        {battle.enemies.map((enemy, index) => (
          <div
            key={index}
            className={`enemy ${selectedTarget === index ? 'selected' : ''}`}
            onClick={() => handleEnemyClick(index)}
            style={{ position: 'relative' }}
          >
            <div className="enemy-image-container">
              <img 
                src={getMonsterImage(enemy.id)} 
                alt={enemy.name}
                className="enemy-image"
              />
            </div>
            <div className="enemy-name">{enemy.name}</div>
            <div className="enemy-hp">
              {enemy.hp}/{enemy.maxHp}
            </div>
            {enemy.block > 0 && (
              <div className="enemy-block">格挡: {enemy.block}</div>
            )}
            <div className="enemy-buffs">
              {enemy.vulnerable > 0 && (
                <div className="buff-icon vulnerable" title={`易伤: 受到的伤害+50% (${enemy.vulnerable}回合)`}>
                  <span className="buff-value">{enemy.vulnerable}</span>
                </div>
              )}
              {enemy.weak > 0 && (
                <div className="buff-icon weak" title={`虚弱: 造成的伤害-25% (${enemy.weak}回合)`}>
                  <span className="buff-value">{enemy.weak}</span>
                </div>
              )}
              {enemy.strength > 0 && (
                <div className="buff-icon strength" title={`力量: +${enemy.strength}伤害`}>
                  <span className="buff-value">+{enemy.strength}</span>
                </div>
              )}
            </div>
            
            {/* 伤害数字显示 */}
            {damageNumbers
              .filter(d => d.targetIndex === index)
              .map(damageNum => (
                <div
                  key={damageNum.id}
                  className="damage-number"
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${damageNum.x}px)`,
                    top: `calc(50% + ${damageNum.y}px)`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 1000
                  }}
                >
                  {damageNum.damage > 0 && (
                    <span className="damage-value">-{damageNum.damage}</span>
                  )}
                  {damageNum.blocked > 0 && (
                    <span className="blocked-value">格挡 {damageNum.blocked}</span>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
      
      {/* 玩家buff显示 */}
      <div className="player-buffs">
        {battle.player.weak > 0 && (
          <div className="buff-icon weak" title={`虚弱: 造成的伤害-25% (${battle.player.weak}回合)`}>
            <span className="buff-value">{battle.player.weak}</span>
          </div>
        )}
        {battle.player.vulnerable > 0 && (
          <div className="buff-icon vulnerable" title={`易伤: 受到的伤害+50% (${battle.player.vulnerable}回合)`}>
            <span className="buff-value">{battle.player.vulnerable}</span>
          </div>
        )}
      </div>

      <div className="hand-container">
        <div className="hand-label">手牌</div>
        <div className="hand">
          {battle.hand.map((card, index) => (
            <div
              key={index}
              className={`card ${selectedCard === index ? 'selected' : ''} ${battle.energy < (card.cost || 0) ? 'unplayable' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-image-container">
                <img 
                  src={getCardImage(card.id)} 
                  alt={card.name}
                  className="card-image"
                />
              </div>
              <div className="card-name">{card.name}</div>
              <div className="card-cost">{card.cost || 0}</div>
              <div className="card-description">{card.description}</div>
              {card.damage > 0 && (
                <div className="card-damage">伤害: {card.damage}</div>
              )}
              {card.block > 0 && (
                <div className="card-block">格挡: {card.block}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="battle-actions">
        <button onClick={handlePlayCard} disabled={selectedCard === null || !battle.playerTurn}>
          打出卡牌
        </button>
        <button 
          onClick={onEndTurn}
          disabled={!battle.playerTurn}
        >
          结束回合
        </button>
      </div>

      <div className="deck-info">
        <div>抽牌堆: {battle.drawPile.length}</div>
        <div>弃牌堆: {battle.discardPile.length}</div>
        <div>消耗堆: {battle.exhaustPile.length}</div>
      </div>
    </div>
  );
}

