import { useState } from 'react'
import { CARD_DATA } from '../data/cards'
import './RestScreen.css'

const COMPARE_FIELDS = [
  { key: 'cost',        label: '费用' },
  { key: 'damage',      label: '伤害' },
  { key: 'block',       label: '格挡' },
  { key: 'magicNumber', label: '魔法数值' },
  { key: 'hits',        label: '攻击次数' },
  { key: 'exhaust',     label: '消耗', format: v => (v ? '是' : '否') },
  { key: 'description', label: '描述' },
]

function getChangedFields(base, upgraded) {
  const changed = new Set()
  for (const { key } of COMPARE_FIELDS) {
    if (base[key] !== upgraded[key]) changed.add(key)
  }
  return changed
}

function CardComparePanel({ card, changedFields, isUpgraded }) {
  const typeColor = {
    ATTACK: '#e05252', SKILL: '#5288e0', POWER: '#a052e0', STATUS: '#888'
  }
  return (
    <div className={`card-compare-panel ${isUpgraded ? 'panel-upgraded' : 'panel-original'}`}>
      <div className="ccp-badge">{isUpgraded ? '升级后' : '当前'}</div>
      <img
        className="ccp-img"
        src={card.image}
        alt={card.name}
        onError={e => { e.target.style.display = 'none' }}
      />
      <div className="ccp-name" style={{ color: isUpgraded ? '#ffe066' : '#f0e0c0' }}>
        {card.name}
      </div>
      <div className="ccp-type" style={{ color: typeColor[card.type] || '#888' }}>
        {card.type}
      </div>
      <div className="ccp-stats">
        {COMPARE_FIELDS.map(({ key, label, format }) => {
          const val = card[key]
          if (val === undefined || val === null) return null
          if (val === false && key !== 'exhaust') return null
          const isChanged = changedFields.has(key)
          return (
            <div
              key={key}
              className={`ccp-stat${isChanged && isUpgraded ? ' stat-highlight' : ''}${isChanged && !isUpgraded ? ' stat-old' : ''}`}
            >
              <span className="ccp-stat-label">{label}：</span>
              <span className="ccp-stat-value">{format ? format(val) : val}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function RestScreen({ state, dispatch }) {
  const [selectedCard, setSelectedCard] = useState(null)
  const { player } = state
  const healAmt = Math.ceil(player.maxHp * 0.3)

  function handleCardClick(card) {
    if (!card.upgradeId || card.upgraded) return
    setSelectedCard(card)
  }

  function handleConfirmUpgrade() {
    dispatch({ type: 'REST_ACTION', payload: { action: 'smith', cardInstanceId: selectedCard.instanceId } })
    setSelectedCard(null)
  }

  const upgradedPreview = selectedCard ? CARD_DATA[selectedCard.upgradeId] : null
  const changedFields   = selectedCard ? getChangedFields(selectedCard, upgradedPreview) : new Set()

  return (
    <div className="rest-screen">
      <img
        className="rest-bg-char"
        src="/assets/ui-characters/rest_ironclad.png"
        alt="铁甲人休息"
        onError={e => { e.target.style.display = 'none' }}
      />

      <div className="rest-panel">
        <h1 className="rest-title">篝火休息点</h1>
        <div className="rest-hp">生命值：{player.hp} / {player.maxHp}</div>

        <div className="rest-options">
          {/* ── Heal ── */}
          <button
            className="rest-option-btn"
            onClick={() => dispatch({ type: 'REST_ACTION', payload: { action: 'heal' } })}
          >
            <span className="rest-option-icon">🔥</span>
            <div>
              <div className="rest-option-name">休息</div>
              <div className="rest-option-desc">恢复 {healAmt} 点生命值（30% 最大生命值）</div>
            </div>
          </button>

          {/* ── Smith ── */}
          <div className="smith-section">
            <div className="smith-header">
              <span className="rest-option-icon">⚒</span>
              <div>
                <div className="rest-option-name">铸造</div>
                <div className="rest-option-desc">选择一张牌升级（每次只能升级一张）</div>
              </div>
            </div>

            <div className="deck-card-list">
              {player.deck.map(card => {
                const canUpgrade = !card.upgraded && !!card.upgradeId
                return (
                  <div
                    key={card.instanceId}
                    className={`deck-card-item${canUpgrade ? '' : ' card-grayed'}`}
                    onClick={() => handleCardClick(card)}
                    title={!canUpgrade ? (card.upgraded ? '已升级' : '不可升级') : '点击查看升级预览'}
                  >
                    <span className="deck-card-name">{card.name}</span>
                    {canUpgrade
                      ? <span className="deck-card-badge badge-can">可升级</span>
                      : card.upgraded
                        ? <span className="deck-card-badge badge-done">已升级</span>
                        : <span className="deck-card-badge badge-no">不可升级</span>
                    }
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Leave ── */}
          <button
            className="leave-rest-btn"
            onClick={() => dispatch({ type: 'LEAVE_REST' })}
          >
            继续前进
          </button>
        </div>
      </div>

      {/* ── Upgrade comparison modal ── */}
      {selectedCard && upgradedPreview && (
        <div className="upgrade-modal-backdrop" onClick={() => setSelectedCard(null)}>
          <div className="upgrade-modal" onClick={e => e.stopPropagation()}>
            <div className="upgrade-modal-title">升级预览</div>

            <div className="compare-panels">
              <CardComparePanel
                card={selectedCard}
                changedFields={changedFields}
                isUpgraded={false}
              />
              <div className="compare-arrow">▶</div>
              <CardComparePanel
                card={upgradedPreview}
                changedFields={changedFields}
                isUpgraded={true}
              />
            </div>

            <div className="compare-buttons">
              <button className="btn-confirm" onClick={handleConfirmUpgrade}>确认升级</button>
              <button className="btn-cancel"  onClick={() => setSelectedCard(null)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
