import './ShopScreen.css';

export default function ShopScreen({ shop, player, onBuyCard, onBuyRelic, onBuyPotion, onRemoveCard, onLeave }) {
  if (!shop) return null;

  return (
    <div className="shop-screen">
      <div className="shop-header">
        <h1>商店</h1>
        <div className="player-gold">金币: {player.gold}</div>
        <button onClick={onLeave}>离开商店</button>
      </div>

      <div className="shop-content">
        <div className="shop-section">
          <h2>卡牌</h2>
          <div className="shop-items">
            {shop.cards.map((card, index) => (
              <div key={index} className="shop-item card-item">
                <div className="item-name">{card.name}</div>
                <div className="item-description">{card.description}</div>
                <div className="item-price">{card.price} 金币</div>
                <button 
                  onClick={() => onBuyCard(index)}
                  disabled={player.gold < card.price}
                >
                  购买
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="shop-section">
          <h2>遗物</h2>
          <div className="shop-items">
            {shop.relics.map((relic, index) => (
              <div key={index} className="shop-item relic-item">
                <div className="item-name">{relic.name}</div>
                <div className="item-description">{relic.description}</div>
                <div className="item-price">{relic.price} 金币</div>
                <button 
                  onClick={() => onBuyRelic(index)}
                  disabled={player.gold < relic.price}
                >
                  购买
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="shop-section">
          <h2>药水</h2>
          <div className="shop-items">
            {shop.potions.map((potion, index) => (
              <div key={index} className="shop-item potion-item">
                <div className="item-name">{potion.name}</div>
                <div className="item-description">{potion.description}</div>
                <div className="item-price">{potion.price} 金币</div>
                <button 
                  onClick={() => onBuyPotion(index)}
                  disabled={player.gold < potion.price}
                >
                  购买
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="shop-section">
          <h2>移除卡牌 (75金币)</h2>
          <div className="deck-list">
            {player.deck.map((card, index) => (
              <div key={index} className="deck-card">
                <span>{card.name}</span>
                <button 
                  onClick={() => onRemoveCard(index)}
                  disabled={player.gold < 75}
                >
                  移除
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

