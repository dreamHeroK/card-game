import { RELIC_DATA } from '../data/relics.js'
import './BattleRewardScreen.css'

const RARITY_LABEL = { COMMON: '普通', UNCOMMON: '少见', RARE: '稀有', BASIC: '基础', STATUS: '状态' }
const TYPE_COLOR = { ATTACK: '#c0392b', SKILL: '#27ae60', POWER: '#8e44ad', STATUS: '#666' }
const RARITY_COLOR = { COMMON: '#aaa', UNCOMMON: '#7ab8f5', RARE: '#f5c860', BOSS: '#e8b4f8' }

function CardChoice({ card, onClick }) {
  const rarity = card.rarity || 'COMMON'
  return (
    <div className="reward-card" data-rarity={rarity} onClick={onClick}>
      <div className="reward-card-cost">{card.cost}</div>
      <span className={`rarity-badge rarity-badge-${rarity}`}>{RARITY_LABEL[rarity] ?? rarity}</span>
      <img className="reward-card-art" src={card.image} alt={card.name} onError={e => { e.target.style.background = '#333' }} />
      <div className="reward-card-name">{card.name}</div>
      <div className="reward-card-type" style={{ color: TYPE_COLOR[card.type] }}>{card.type}</div>
      <div className="reward-card-desc">{card.description}</div>
    </div>
  )
}

function BossRelicChoice({ relicId, onClick }) {
  const relic = RELIC_DATA[relicId]
  if (!relic) return null
  return (
    <div className="boss-relic-card" onClick={onClick}>
      <img className="boss-relic-img" src={relic.image} alt={relic.name} onError={e => { e.target.style.background = '#333' }} />
      <div className="boss-relic-name" style={{ color: RARITY_COLOR[relic.rarity] || '#f0e0c0' }}>{relic.name}</div>
      <div className="boss-relic-desc">{relic.description}</div>
    </div>
  )
}

export default function BattleRewardScreen({ state, dispatch }) {
  const { reward } = state
  if (!reward) return null

  function chooseCard(cardData) {
    dispatch({ type: 'CHOOSE_CARD_REWARD', payload: { cardData } })
  }

  function chooseBossRelic(relicId) {
    dispatch({ type: 'CHOOSE_BOSS_RELIC', payload: { relicId } })
  }

  const rarityLabel = RARITY_LABEL[reward.rarity] ?? ''

  return (
    <div className="reward-screen">
      <div className="reward-panel">
        <h1 className="reward-title">战斗奖励</h1>

        <div className="reward-row">
          <img src="/assets/ui-rewards/reward_icon_money.png" alt="金" width={32} onError={e=>{e.target.style.display='none'}}/>
          <span className="reward-gold">+{reward.gold} 金币</span>
        </div>

        {reward.relic && (
          <div className="reward-row relic-row">
            <img src="/assets/ui-rewards/reward_icon_uncommon.png" alt="遗物" width={32} onError={e=>{e.target.style.display='none'}}/>
            <img className="relic-image" src={reward.relic.image} alt={reward.relic.name} onError={e=>{e.target.style.display='none'}}/>
            <div className="relic-info">
              <div className="relic-name">{reward.relic.name}</div>
              <div className="relic-desc">{reward.relic.description}</div>
            </div>
          </div>
        )}

        {reward.bossRelicChoices && reward.bossRelicChoices.length > 0 ? (
          <div className="card-choices-section">
            <h2 className="choices-title">
              <img src="/assets/ui-rewards/reward_icon_boss_relic.png" alt="遗物" width={24} onError={e=>{e.target.style.display='none'}}/>
              选择一件 Boss 遗物
            </h2>
            <div className="boss-relic-choices">
              {reward.bossRelicChoices.map(id => (
                <BossRelicChoice key={id} relicId={id} onClick={() => chooseBossRelic(id)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="card-choices-section">
            <h2 className="choices-title">
              <img src="/assets/ui-rewards/reward_icon_card.png" alt="卡" width={24} onError={e=>{e.target.style.display='none'}}/>
              选择一张牌
              {rarityLabel && (
                <span className={`rarity-badge rarity-badge-${reward.rarity}`} style={{ marginLeft: 8 }}>
                  {rarityLabel}
                </span>
              )}
            </h2>
            <div className="card-choices">
              {reward.cardChoices.map((card, i) => (
                <CardChoice key={card.id + i} card={card} onClick={() => chooseCard(card)} />
              ))}
            </div>
            <button className="skip-btn" onClick={() => chooseCard(null)}>跳过</button>
          </div>
        )}
      </div>
    </div>
  )
}
