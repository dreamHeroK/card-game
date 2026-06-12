import { useState } from 'react'
import './ShopScreen.css'

export default function ShopScreen({ state, dispatch }) {
  const { shop, player } = state
  const [removingCard, setRemovingCard] = useState(false)
  if (!shop) return null

  function buyCard(index) {
    dispatch({ type: 'BUY_ITEM', payload: { itemType: 'card', index } })
  }
  function buyRelic(index) {
    dispatch({ type: 'BUY_ITEM', payload: { itemType: 'relic', index } })
  }
  function removeCard(instanceId) {
    dispatch({ type: 'REMOVE_CARD_FROM_DECK', payload: { cardInstanceId: instanceId } })
    setRemovingCard(false)
  }

  return (
    <div className="shop-screen">
      <div className="shop-bg">
        <img src="/assets/renders/shop_merchant_top.png" className="merchant-top" alt="" onError={e=>{e.target.style.display='none'}}/>
        <img src="/assets/renders/shop_merchant_bottom.png" className="merchant-bottom" alt="" onError={e=>{e.target.style.display='none'}}/>
      </div>
      <div className="shop-panel">
        <div className="shop-header">
          <h1 className="shop-title">冒险者商店</h1>
          <div className="shop-gold">💰 {player.gold} 金币</div>
        </div>

        <div className="shop-sections">
          <div className="shop-section">
            <h2>卡牌</h2>
            <div className="shop-cards-row">
              {shop.cards.map((item, i) => {
                const canAfford = player.gold >= item.price
                return (
                  <div
                    key={i}
                    className={`shop-card${item.sold ? ' sold' : ''}${!canAfford && !item.sold ? ' cant-afford' : ''}`}
                    onClick={() => !item.sold && canAfford && buyCard(i)}
                  >
                    {item.sold && <div className="sold-overlay">已售出</div>}
                    <img className="shop-card-art" src={item.cardData.image} alt={item.cardData.name} onError={e=>{e.target.style.background='#222'}}/>
                    <div className="shop-card-name">{item.cardData.name}</div>
                    <div className="shop-card-desc">{item.cardData.description}</div>
                    <div className={`shop-price${!canAfford ? ' red' : ''}`}>{item.price} 金</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="shop-section">
            <h2>遗物</h2>
            <div className="shop-relics-row">
              {shop.relics.map((item, i) => {
                const canAfford = player.gold >= item.price
                const owned = player.relics.includes(item.relicData.id)
                return (
                  <div
                    key={i}
                    className={`shop-relic${item.sold || owned ? ' sold' : ''}${!canAfford && !item.sold ? ' cant-afford' : ''}`}
                    onClick={() => !item.sold && !owned && canAfford && buyRelic(i)}
                  >
                    {(item.sold || owned) && <div className="sold-overlay">{owned ? '已持有' : '已售出'}</div>}
                    <img className="relic-icon" src={item.relicData.image} alt={item.relicData.name} onError={e=>{e.target.style.display='none'}}/>
                    <div className="relic-name">{item.relicData.name}</div>
                    <div className="relic-desc">{item.relicData.description}</div>
                    <div className={`shop-price${!canAfford ? ' red' : ''}`}>{item.price} 金</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="shop-section">
            <h2>移除卡牌 <span className="remove-price">({shop.removePrice} 金)</span></h2>
            {!removingCard ? (
              <button
                className="remove-btn"
                disabled={player.gold < shop.removePrice}
                onClick={() => setRemovingCard(true)}
              >
                选择一张牌移除 ({shop.removePrice} 金)
              </button>
            ) : (
              <div className="remove-deck-list">
                <div className="remove-hint">点击要移除的牌：</div>
                {player.deck.map(card => (
                  <div key={card.instanceId} className="remove-card-item" onClick={() => removeCard(card.instanceId)}>
                    {card.name}{card.upgraded ? '+' : ''} (花费: {card.cost})
                  </div>
                ))}
                <button className="cancel-btn" onClick={() => setRemovingCard(false)}>取消</button>
              </div>
            )}
          </div>
        </div>

        <button className="leave-shop-btn" onClick={() => dispatch({ type: 'LEAVE_SHOP' })}>离开商店</button>
      </div>
    </div>
  )
}
