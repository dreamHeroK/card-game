import './RestScreen.css'

export default function RestScreen({ state, dispatch }) {
  const { player } = state
  const healAmt = Math.ceil(player.maxHp * 0.3)
  const upgradable = player.deck.filter(c => !c.upgraded && c.upgradeId)

  return (
    <div className="rest-screen">
      <img className="rest-bg-char" src="/assets/ui-characters/rest_ironclad.png" alt="铁甲人休息" onError={e=>{e.target.style.display='none'}}/>
      <div className="rest-panel">
        <h1 className="rest-title">篝火休息点</h1>
        <div className="rest-hp">生命值：{player.hp} / {player.maxHp}</div>

        <div className="rest-options">
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

          <div className="smith-section">
            <div className="smith-header">
              <span className="rest-option-icon">⚒</span>
              <div>
                <div className="rest-option-name">铸造</div>
                <div className="rest-option-desc">选择一张牌升级（每次只能升级一张）</div>
              </div>
            </div>
            {upgradable.length === 0 ? (
              <div className="no-upgradable">没有可升级的牌</div>
            ) : (
              <div className="upgradable-list">
                {upgradable.map(card => (
                  <div
                    key={card.instanceId}
                    className="upgradable-card"
                    onClick={() => dispatch({ type: 'REST_ACTION', payload: { action: 'smith', cardInstanceId: card.instanceId } })}
                  >
                    <span className="upgrade-card-name">{card.name}</span>
                    <span className="upgrade-arrow">→ {card.name}+</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="leave-rest-btn"
            onClick={() => dispatch({ type: 'LEAVE_REST' })}
          >
            继续前进
          </button>
        </div>
      </div>
    </div>
  )
}
