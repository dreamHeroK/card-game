import { useState } from 'react';
import { getCardImage } from '../utils/imageLoader.js';
import './BattleRewardScreen.css';

export default function BattleRewardScreen({ reward, onAccept }) {
  const [selectedCard, setSelectedCard] = useState(null);

  if (!reward) return null;

  const handleAccept = () => {
    onAccept(selectedCard, true, true);
  };

  const handleSkipCard = () => {
    onAccept(null, true, true);
  };

  return (
    <div className="battle-reward-screen">
      <div className="reward-container">
        <h2 className="reward-title">战斗胜利！</h2>
        
        {/* 金币奖励 */}
        <div className="reward-section">
          <div className="reward-label">金币奖励</div>
          <div className="reward-gold">+{reward.gold} 金币</div>
        </div>

        {/* 卡牌选择 */}
        {reward.cardChoices && reward.cardChoices.length > 0 && (
          <div className="reward-section">
            <div className="reward-label">选择一张卡牌加入牌组</div>
            <div className="card-choices">
              {reward.cardChoices.map((card, index) => (
                <div
                  key={index}
                  className={`card-choice ${selectedCard === index ? 'selected' : ''}`}
                  onClick={() => setSelectedCard(index)}
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
            <button className="skip-card" onClick={handleSkipCard}>
              跳过
            </button>
          </div>
        )}

        {/* 遗物奖励 */}
        {reward.relic && (
          <div className="reward-section">
            <div className="reward-label">遗物奖励</div>
            <div className="relic-reward">
              <div className="relic-name">{reward.relic.name}</div>
              <div className="relic-description">{reward.relic.description}</div>
            </div>
          </div>
        )}

        {/* 药水奖励 */}
        {reward.potion && (
          <div className="reward-section">
            <div className="reward-label">药水奖励</div>
            <div className="potion-reward">
              <div className="potion-name">{reward.potion.name}</div>
              <div className="potion-description">{reward.potion.description}</div>
            </div>
          </div>
        )}

        {/* 确认按钮 */}
        <button className="accept-reward" onClick={handleAccept}>
          接受奖励
        </button>
      </div>
    </div>
  );
}

