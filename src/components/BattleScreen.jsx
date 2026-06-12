import './BattleScreen.css'

const STATUS_NAMES = {
  VULNERABLE: '易伤', WEAK: '虚弱', FRAIL: '脆弱', POISON: '毒素',
  STRENGTH: '力量', DEXTERITY: '敏捷', RITUAL: '仪式', FLEX_STRENGTH: '临时力量',
  ARTIFACT: '神器', METALLICIZE: '金属化', FEEL_NO_PAIN: '无痛',
  DEMON_FORM: '恶魔形态', BARRICADE: '壁垒', DOUBLE_TAP: '连击', AMPLIFY: '增幅',
}

// Debuff effects shown with a red tint
const DEBUFF_KEYS = new Set(['VULNERABLE', 'WEAK', 'FRAIL', 'POISON'])

function StatusBadge({ effectKey, value }) {
  if (!value || value <= 0) return null
  const isDebuff = DEBUFF_KEYS.has(effectKey)
  return (
    <span className={`status-badge status-${effectKey.toLowerCase()}${isDebuff ? ' debuff' : ' buff'}`}>
      {STATUS_NAMES[effectKey] || effectKey} {value}
    </span>
  )
}

function CardComponent({ card, selected, disabled, onClick, amplifyActive }) {
  const typeColors = { ATTACK: '#c0392b', SKILL: '#27ae60', POWER: '#8e44ad', STATUS: '#7f8c8d' }
  const displayCost = (amplifyActive && card.type === 'POWER') ? 0 : card.cost
  return (
    <div
      className={`battle-card${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
      onClick={onClick}
      title={card.description}
    >
      <div className="card-cost" style={{ background: disabled ? '#555' : '#c0392b' }}>{displayCost}</div>
      <img className="card-art" src={card.image} alt={card.name} onError={e => { e.target.style.display='none' }} />
      <div className="card-name">{card.name}</div>
      <div className="card-type" style={{ color: typeColors[card.type] || '#aaa' }}>{card.type}</div>
      <div className="card-desc">{card.description}</div>
    </div>
  )
}

function HPBar({ current, max, color = '#e05252' }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100))
  return (
    <div className="hp-bar-container">
      <div className="hp-bar-fill" style={{ width: pct + '%', background: color }} />
      <span className="hp-bar-text">{current}/{max}</span>
    </div>
  )
}

function IntentDisplay({ intent }) {
  if (!intent) return null
  const imgMap = { ATTACK: '/assets/intents/attack.png', DEFEND: '/assets/intents/defend.png', BUFF: '/assets/intents/buff.png', DEBUFF: '/assets/intents/debuff.png' }
  const img = imgMap[intent.type] || '/assets/intents/unknown.png'
  let label = intent.description || intent.type
  if (intent.type === 'ATTACK' && intent.value) {
    label = `攻击 ${intent.value}${intent.times > 1 ? ` x${intent.times}` : ''}`
  }
  return (
    <div className="intent-display">
      <img src={img} alt={intent.type} width={28} height={28} onError={e=>{e.target.style.display='none'}} />
      <span>{label}</span>
    </div>
  )
}

export default function BattleScreen({ state, dispatch }) {
  const { player, battle } = state
  if (!battle) return null

  const isPlayerTurn = battle.turn === 'PLAYER'
  const targeting = !!battle.selectedCardId
  const selectedCard = targeting ? battle.hand.find(c => c.instanceId === battle.selectedCardId) : null
  const amplifyActive = (player.effects?.AMPLIFY || 0) > 0

  function handleCardClick(card) {
    if (!isPlayerTurn) return
    const effectiveCost = (amplifyActive && card.type === 'POWER') ? 0 : card.cost
    if (effectiveCost > battle.energy) return
    dispatch({ type: 'SELECT_CARD', payload: { cardInstanceId: card.instanceId } })
  }

  function handleEnemyClick(index) {
    if (!isPlayerTurn || !targeting) return
    dispatch({ type: 'PLAY_CARD', payload: { targetIndex: index } })
  }

  function handleEndTurn() {
    if (!isPlayerTurn) return
    dispatch({ type: 'END_PLAYER_TURN' })
  }

  const playerEffects = Object.entries(player.effects || {}).filter(([, v]) => v > 0)

  return (
    <div className="battle-screen">
      {/* Top bar */}
      <div className="battle-topbar">
        <div className="topbar-item">
          <img src="/assets/ui-top-bar/top_bar_heart.png" alt="HP" width={20} height={20} onError={e=>{e.target.style.display='none'}}/>
          <HPBar current={player.hp} max={player.maxHp} />
        </div>
        <div className="topbar-item">
          <span className="block-icon">🛡</span>
          <span className="block-value">{player.block}</span>
        </div>
        <div className="topbar-item">
          <img src="/assets/ui-energy/ironclad_energy_icon.png" alt="能量" width={22} height={22} onError={e=>{e.target.style.display='none'}} />
          <span className="energy-value">{battle.energy}/{player.maxEnergy}</span>
        </div>
        <div className="topbar-item">
          <img src="/assets/ui-top-bar/top_bar_gold.png" alt="金" width={18} height={18} onError={e=>{e.target.style.display='none'}} />
          <span className="gold-value">{player.gold}</span>
        </div>
        <div className="topbar-item floor-info">
          第 {state.floor} 层 | {battle.combatType === 'BOSS' ? '首领' : battle.combatType === 'ELITE' ? '精英' : '普通'} 战斗
        </div>
      </div>

      {/* Main battle area */}
      <div className="battle-main">
        {/* Enemy side */}
        <div className="enemies-area">
          {targeting && <div className="targeting-hint">选择攻击目标</div>}
          {battle.enemies.map((enemy, idx) => (
            <div
              key={enemy.instanceId}
              className={`enemy-card${enemy.hp <= 0 ? ' dead' : ''}${targeting ? ' targetable' : ''}`}
              onClick={() => handleEnemyClick(idx)}
            >
              <img
                className="enemy-image"
                src={enemy.image}
                alt={enemy.name}
                onError={e => { e.target.src = '/assets/renders/cultists.png' }}
              />
              <div className="enemy-info">
                <div className="enemy-name">{enemy.name}</div>
                <HPBar current={enemy.hp} max={enemy.maxHp} color="#e05252" />
                {enemy.block > 0 && <div className="enemy-block">🛡 {enemy.block}</div>}
                <IntentDisplay intent={enemy.intent} />
                <div className="enemy-effects">
                  {Object.entries(enemy.effects || {}).filter(([,v]) => v > 0).map(([k, v]) => (
                    <StatusBadge key={k} effectKey={k} value={v} />
                  ))}
                  {(enemy.strength || 0) > 0 && <span className="status-badge status-strength">力量 {enemy.strength}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Player side */}
        <div className="player-area">
          <img
            className="player-image"
            src="/assets/ui-characters/combat_ironclad.png"
            alt="铁甲人"
            onError={e => { e.target.src = '/assets/renders/ironclad.png' }}
          />
          <div className="player-effects">
            {playerEffects.map(([k, v]) => <StatusBadge key={k} effectKey={k} value={v} />)}
            {(player.strength || 0) > 0 && <span className="status-badge status-strength">力量 {player.strength}</span>}
          </div>
        </div>
      </div>

      {/* Combat log */}
      <div className="combat-log">
        {battle.log.slice(-4).map((msg, i) => <div key={i} className="log-entry">{msg}</div>)}
      </div>

      {/* Turn indicator */}
      {!isPlayerTurn && (
        <div className="enemy-turn-overlay">敌方回合...</div>
      )}

      {/* Hand area */}
      <div className="battle-bottom">
        <div className="draw-pile" title="摸牌堆">
          <img src="/assets/ui-combat/draw_pile.png" alt="摸" width={48} onError={e=>{e.target.style.display='none'}} />
          <span>{battle.drawPile.length}</span>
        </div>

        <div className="hand-area">
          {battle.hand.map(card => {
            const effectiveCost = (amplifyActive && card.type === 'POWER') ? 0 : card.cost
            return (
              <CardComponent
                key={card.instanceId}
                card={card}
                selected={card.instanceId === battle.selectedCardId}
                disabled={!isPlayerTurn || effectiveCost > battle.energy}
                amplifyActive={amplifyActive}
                onClick={() => handleCardClick(card)}
              />
            )
          })}
        </div>

        <div className="end-turn-area">
          <button
            className={`end-turn-btn${!isPlayerTurn ? ' disabled' : ''}`}
            onClick={handleEndTurn}
            disabled={!isPlayerTurn}
          >
            {isPlayerTurn ? '结束回合' : '敌方回合'}
          </button>
          {targeting && (
            <button className="cancel-btn" onClick={() => dispatch({ type: 'DESELECT_CARD' })}>取消</button>
          )}
        </div>

        <div className="discard-pile" title="弃牌堆">
          <img src="/assets/ui-combat/discard_pile.png" alt="弃" width={48} onError={e=>{e.target.style.display='none'}} />
          <span>{battle.discardPile.length}</span>
        </div>
      </div>
    </div>
  )
}
