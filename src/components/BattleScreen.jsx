import { useState, useCallback, useEffect, useRef } from 'react'
import { RELIC_DATA } from '../data/relics.js'
import './BattleScreen.css'

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_NAMES = {
  // 已有状态
  VULNERABLE: '易伤', WEAK: '虚弱', FRAIL: '脆弱', POISON: '毒素',
  STRENGTH: '力量', DEXTERITY: '敏捷', RITUAL: '仪式', FLEX_STRENGTH: '临时力量',
  ARTIFACT: '神器', METALLICIZE: '金属化', FEEL_NO_PAIN: '无痛',
  DEMON_FORM: '恶魔形态', BARRICADE: '壁垒', DOUBLE_TAP: '连击', AMPLIFY: '增幅',
  // STS2 新增状态效果
  THORNS: '荆棘', VIGOR: '活力', REGEN: '再生', BUFFER: '缓冲',
  INTANGIBLE: '无实体', DOOM: '灾厄',
  // STS2 行动限制减益
  CONFUSED: '混乱', SMOGGY: '烟雾弥漫', RINGING: '昏眩', SLOTH: '懒惰', TANGLED: '缠结',
}
const DEBUFF_KEYS = new Set([
  'VULNERABLE', 'WEAK', 'FRAIL', 'POISON',
  'CONFUSED', 'SMOGGY', 'RINGING', 'SLOTH', 'TANGLED',
])

const TYPE_COLOR  = { ATTACK: '#c83020', SKILL: '#1a6a88', POWER: '#6a1a98', STATUS: '#555' }
const TYPE_BANNER = { ATTACK: '#7a1800', SKILL: '#003f55', POWER: '#320060', STATUS: '#2a2a2a' }
const TYPE_LABEL  = { ATTACK: '攻击',    SKILL: '技能',    POWER: '能力',     STATUS: '状态' }

function hpFill(pct) {
  if (pct < 25) return '#c82020'
  if (pct < 50) return '#b87820'
  return '#c03030'
}

function isLethalIntent(intent, enemy, player) {
  if (!intent || intent.type !== 'ATTACK') return false
  const times = intent.times || 1
  let base = (intent.value || 0) + (enemy.strength || 0)
  if ((enemy.effects?.WEAK || 0) > 0) base = Math.floor(base * 0.75)
  if ((player.effects?.VULNERABLE || 0) > 0) base = Math.floor(base * 1.5)
  const hit = Math.max(0, base)
  let blk = player.block, hp = player.hp
  for (let i = 0; i < times; i++) {
    if (hit <= blk) { blk -= hit } else { hp -= (hit - blk); blk = 0 }
    if (hp <= 0) return true
  }
  return false
}

// ── Display stats calculation ─────────────────────────────────────────────────
// Applies player-side modifiers only (strength/weak for damage, dexterity/frail for block).
// Vulnerable is enemy-side and appears in floating numbers when damage actually lands.

function calcDisplayStats(card, player, targetEnemy) {
  if (!player) return { damage: null, block: null, damageHits: 1, dmgMods: [], blkMods: [] }

  const str     = player.strength || 0
  const dex     = player.dexterity || 0
  const vigor   = card.type === 'ATTACK' ? (player.effects?.VIGOR || 0) : 0
  const isWeak  = (player.effects?.WEAK  || 0) > 0
  const isFrail = (player.effects?.FRAIL || 0) > 0
  const isVuln  = targetEnemy ? (targetEnemy.effects?.VULNERABLE || 0) > 0 : false
  const hits    = card.hits || 1

  let damage = null, block = null
  const dmgMods = [], blkMods = []

  if (card.damage != null) {
    let d = card.damage + str + vigor
    if (str !== 0) dmgMods.push({ text: `${str > 0 ? '+' : ''}${str} 力量`, color: '#f4c842' })
    if (vigor > 0) dmgMods.push({ text: `+${vigor} 活力`, color: '#f4a842' })
    if (isWeak) {
      d = Math.floor(d * 0.75)
      dmgMods.push({ text: '×0.75 虚弱', color: '#ff6666' })
    }
    if (isVuln) {
      d = Math.floor(d * 1.5)
      dmgMods.push({ text: '×1.5 易伤', color: '#ff4444' })
    }
    damage = Math.max(0, d)
  }

  if (card.block != null) {
    let b = card.block + dex
    if (dex !== 0) blkMods.push({ text: `${dex > 0 ? '+' : ''}${dex} 敏捷`, color: '#f4c842' })
    if (isFrail) {
      b = Math.floor(b * 0.75)
      blkMods.push({ text: '×0.75 脆弱', color: '#ff6666' })
    }
    block = Math.max(0, b)
  }

  return { damage, block, damageHits: hits, dmgMods, blkMods }
}

// ── Tiny shared components ────────────────────────────────────────────────────

function StatusBadge({ effectKey, value }) {
  if (!value || value <= 0) return null
  const isDebuff = DEBUFF_KEYS.has(effectKey)
  return (
    <span className={`sbadge sbadge-${effectKey.toLowerCase()}${isDebuff ? ' db' : ' bf'}`}
      title={STATUS_NAMES[effectKey] || effectKey}>
      {STATUS_NAMES[effectKey] || effectKey} {value}
    </span>
  )
}

function FighterHP({ current, max, block, showBlock }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100))
  return (
    <div className="fighter-hp-wrap">
      {showBlock && block > 0 && (
        <div className="fighter-block">
          <span>🛡</span><span className="fighter-block-num">{block}</span>
        </div>
      )}
      <div className="fighter-hp-bar">
        <div className="fighter-hp-fill" style={{ width: pct + '%', background: hpFill(pct) }} />
        <span className="fighter-hp-text">{current}/{max}</span>
      </div>
    </div>
  )
}

function IntentBadge({ intent, lethal }) {
  if (!intent) return null
  const ICONS = {
    ATTACK: '/assets/intents/attack.png',
    DEFEND: '/assets/intents/defend.png',
    BUFF:   '/assets/intents/buff.png',
    DEBUFF: '/assets/intents/debuff.png',
  }
  const isAtk = intent.type === 'ATTACK'
  return (
    <div className={`intent-badge${lethal ? ' intent-lethal' : ''}`} title={intent.description}>
      <img src={ICONS[intent.type] || '/assets/intents/unknown.png'}
        className="intent-icon" alt={intent.type}
        onError={e => { e.target.style.display = 'none' }} />
      {isAtk && intent.value != null && (
        <span className={`intent-num${lethal ? ' intent-num-lethal' : ''}`}>
          {intent.value}{intent.times > 1 ? ` ×${intent.times}` : ''}
        </span>
      )}
    </div>
  )
}

// ── Floating damage / block number ────────────────────────────────────────────

function FloatingNumber({ item }) {
  const isBlock   = item.type === 'BLOCK'
  const mainColor = isBlock ? '#55dd55' : '#ffffff'
  const prefix    = isBlock ? '+' : '-'
  return (
    <div className="float-num" style={{ left: item.x + 'px', top: item.y + 'px' }}>
      <span className="float-main" style={{ color: mainColor }}>
        {prefix}{item.amount}
      </span>
      {item.mods?.map((m, i) => (
        <span key={i} className="float-mod" style={{ color: m.color }}>{m.text}</span>
      ))}
    </div>
  )
}

// ── Card components ───────────────────────────────────────────────────────────

function LargeCard({ card, player, targetEnemy, amplifyActive }) {
  const cost      = (amplifyActive && card.type === 'POWER') ? 0 : card.cost
  const typeColor = TYPE_COLOR[card.type] || '#888'
  const bannerBg  = TYPE_BANNER[card.type] || '#333'
  const stats     = calcDisplayStats(card, player, targetEnemy)

  return (
    <div className="lc-frame" style={{ '--type-color': typeColor }}>
      <div className="lc-cost" style={{ background: typeColor }}>{cost}</div>
      <div className="lc-art-wrap">
        <img className="lc-art" src={card.image} alt={card.name}
          onError={e => { e.target.style.display = 'none' }} />
      </div>
      <div className="lc-banner" style={{ background: bannerBg }}>
        <span className="lc-name">{card.name}</span>
        <span className="lc-type-badge" style={{ borderColor: typeColor, color: typeColor }}>
          {TYPE_LABEL[card.type]}
        </span>
      </div>
      <div className="lc-body">
        {(stats.damage != null || stats.block != null) && (
          <div className="lc-calc-stats" style={{ borderLeftColor: typeColor }}>
            {stats.damage != null && (
              <div className="lcs-row">
                <span className="lcs-damage">
                  ⚔ {stats.damage}{stats.damageHits > 1 ? ` ×${stats.damageHits}` : ''}
                </span>
                {stats.dmgMods.map((m, i) => (
                  <span key={i} className="lcs-mod" style={{ color: m.color }}>{m.text}</span>
                ))}
              </div>
            )}
            {stats.block != null && (
              <div className="lcs-row">
                <span className="lcs-block">🛡 {stats.block}</span>
                {stats.blkMods.map((m, i) => (
                  <span key={i} className="lcs-mod" style={{ color: m.color }}>{m.text}</span>
                ))}
              </div>
            )}
          </div>
        )}
        <p className="lc-desc">{card.description}</p>
      </div>
    </div>
  )
}

function HandCard({ card, player, targetEnemy, index, total, selected, hovered, disabled, amplifyActive, onClick, onEnter, onLeave }) {
  const cost      = (amplifyActive && card.type === 'POWER') ? 0 : card.cost
  const typeColor = TYPE_COLOR[card.type] || '#888'
  const bannerBg  = TYPE_BANNER[card.type] || '#333'
  const stats     = calcDisplayStats(card, player, targetEnemy)

  const center = (total - 1) / 2
  const offset = index - center
  const angle  = total > 1 ? offset * 3.5 : 0
  const liftY  = hovered ? -22 : Math.abs(offset) * 5
  const scale  = hovered ? 1.08 : selected ? 1.1 : 1
  const zIdx   = selected ? 60 : hovered ? 55 : (index + 1)

  const style = {
    transform: `rotate(${angle}deg) translateY(${liftY}px) scale(${scale})`,
    transformOrigin: 'bottom center',
    zIndex: zIdx,
    marginLeft: index > 0 ? '-14px' : '0',
  }

  return (
    <div
      className={`hc-frame${selected ? ' hc-selected' : ''}${disabled ? ' hc-disabled' : ''}`}
      style={{ ...style, '--type-color': typeColor }}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="hc-cost" style={{ background: typeColor }}>{cost}</div>
      <div className="hc-art-wrap">
        <img className="hc-art" src={card.image} alt={card.name}
          onError={e => { e.target.style.display = 'none' }} />
      </div>
      <div className="hc-banner" style={{ background: bannerBg }}>
        <span className="hc-name">{card.name}</span>
        <span className="hc-type">{TYPE_LABEL[card.type]}</span>
      </div>
      <div className="hc-desc">
        {card.description}
        {(stats.damage != null || stats.block != null) && (
          <div className="hc-calc-row">
            {stats.damage != null && (
              <span className="hc-calc-dmg">
                ⚔{stats.damage}{stats.damageHits > 1 ? `×${stats.damageHits}` : ''}
              </span>
            )}
            {stats.block != null && (
              <span className="hc-calc-blk">🛡{stats.block}</span>
            )}
            {[...stats.dmgMods, ...stats.blkMods].map((m, i) => (
              <span key={i} className="hc-calc-mod" style={{ color: m.color }}>{m.text}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Relic / potion ────────────────────────────────────────────────────────────

function RelicColumn({ relicIds }) {
  if (!relicIds?.length) return null
  return (
    <div className="relic-column">
      {relicIds.map(id => {
        const r = RELIC_DATA[id]
        if (!r) return null
        return (
          <div key={id} className="relic-slot" title={`${r.name}：${r.description}`}>
            <img src={r.image} alt={r.name} onError={e => { e.target.style.display = 'none' }} />
          </div>
        )
      })}
    </div>
  )
}

function PotionBelt({ potions = [] }) {
  return (
    <div className="potion-belt">
      {[0, 1, 2].map(i => (
        <div key={i} className={`potion-slot-hud${potions[i] ? ' filled' : ''}`}
          title={potions[i]?.name || '空药水槽'}>
          {potions[i] && <span>🧪</span>}
        </div>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BattleScreen({ state, dispatch }) {
  const { player, battle } = state
  if (!battle) return null

  const [hoveredId,  setHoveredId]  = useState(null)
  const [floatNums,  setFloatNums]  = useState([])

  const prevStateRef  = useRef(null)
  const playerZoneRef = useRef(null)
  const enemyZoneRefs = useRef([])

  const isPlayerTurn  = battle.turn === 'PLAYER'
  const targeting     = !!battle.selectedCardId
  const amplifyActive = (player.effects?.AMPLIFY || 0) > 0

  const hoveredCard   = battle.hand.find(c => c.instanceId === hoveredId) ?? null
  const previewCard   = !targeting && hoveredCard ? hoveredCard : null
  // Default target for damage preview: first living enemy
  const defaultTarget = battle.enemies.find(e => e.hp > 0) ?? null

  const onEnter = useCallback(id => setHoveredId(id), [])
  const onLeave = useCallback(() => setHoveredId(null), [])

  // ── Floating damage/block numbers ────────────────────────────────────────
  useEffect(() => {
    const prev = prevStateRef.current
    prevStateRef.current = state
    if (!prev?.battle || !battle) return

    const newFloats = []
    let idc = Date.now()

    // sameTurn = player is playing cards; otherwise an enemy-turn cycle just completed
    const sameTurn = battle.turnNumber === prev.battle.turnNumber

    // Damage dealt to enemies
    battle.enemies?.forEach((curr, idx) => {
      const pe = prev.battle.enemies?.[idx]
      if (!pe) return

      const hpLost   = pe.hp - curr.hp
      // Only count block absorption during same turn (avoid false positives from block reset)
      const blockAbs = sameTurn ? Math.max(0, (pe.block || 0) - (curr.block || 0)) : 0
      const total    = hpLost + blockAbs
      if (total <= 0) return

      const mods = []
      const str     = prev.player?.strength || 0
      const wasVuln = (pe.effects?.VULNERABLE || 0) > 0
      if (str > 0)  mods.push({ text: `+${str} 力量`, color: '#f4c842' })
      if (wasVuln)  mods.push({ text: '×1.5 易伤',   color: '#ff6666' })

      const el   = enemyZoneRefs.current?.[idx]
      const rect = el?.getBoundingClientRect()
      newFloats.push({
        id: String(idc++),
        type: 'DAMAGE',
        amount: total,
        mods,
        x: rect ? rect.left + rect.width * 0.5 - 30 : 650,
        y: rect ? rect.top  + 20                     : 200,
      })
    })

    // Damage taken by player
    if (player.hp < (prev.player?.hp || 0)) {
      const hpLost = prev.player.hp - player.hp
      const el   = playerZoneRef.current
      const rect = el?.getBoundingClientRect()
      newFloats.push({
        id: String(idc++),
        type: 'DAMAGE',
        amount: hpLost,
        mods: [],
        x: rect ? rect.left + rect.width * 0.5 - 30 : 200,
        y: rect ? rect.top  + 20                     : 200,
      })
    }

    // Block gained by player
    if (player.block > (prev.player?.block || 0)) {
      const gain = player.block - prev.player.block
      const dex  = prev.player?.dexterity || 0
      const mods = dex > 0 ? [{ text: `+${dex} 敏捷`, color: '#f4c842' }] : []
      const el   = playerZoneRef.current
      const rect = el?.getBoundingClientRect()
      newFloats.push({
        id: String(idc++),
        type: 'BLOCK',
        amount: gain,
        mods,
        x: rect ? rect.left + rect.width * 0.5 - 30 : 200,
        y: rect ? rect.top  + 20                     : 200,
      })
    }

    if (newFloats.length > 0) {
      setFloatNums(prev => [...prev, ...newFloats])
      const ids = new Set(newFloats.map(f => f.id))
      setTimeout(() => {
        setFloatNums(prev => prev.filter(f => !ids.has(f.id)))
      }, 1500)
    }
  }, [state])

  // ── Action handlers ───────────────────────────────────────────────────────
  function handleCardClick(card) {
    if (!isPlayerTurn) return
    const cost = (amplifyActive && card.type === 'POWER') ? 0 : card.cost
    if (cost > battle.energy) return
    dispatch({ type: 'SELECT_CARD', payload: { cardInstanceId: card.instanceId } })
  }

  function handleEnemyClick(idx) {
    if (!isPlayerTurn || !targeting) return
    dispatch({ type: 'PLAY_CARD', payload: { targetIndex: idx } })
  }

  function handleEndTurn() {
    if (!isPlayerTurn) return
    dispatch({ type: 'END_PLAYER_TURN' })
  }

  const combatLabel =
    battle.combatType === 'BOSS'  ? '首领' :
    battle.combatType === 'ELITE' ? '精英' : '普通'

  const playerEffects = Object.entries(player.effects || {}).filter(([, v]) => v > 0)
  const hasStr = (player.strength || 0) > 0

  return (
    <div className="battle-screen">

      {/* ── Top HUD ──────────────────────────────────────────────────── */}
      <div className="battle-topbar">
        <div className="hud-left">
          <div className="char-portrait">
            <img src="/assets/ui-characters/portrait_ironclad.png" alt="角色"
              onError={e => { e.target.src = '/assets/ui-top-bar/top_bar_heart.png' }} />
          </div>
          <div className="hud-stat">
            <img src="/assets/ui-top-bar/top_bar_heart.png" className="hud-ico"
              onError={e => { e.target.style.display = 'none' }} />
            <span className="hud-hp-txt">{player.hp}/{player.maxHp}</span>
          </div>
          <div className="hud-stat">
            <img src="/assets/ui-top-bar/top_bar_gold.png" className="hud-ico"
              onError={e => { e.target.style.display = 'none' }} />
            <span className="hud-gold-txt">{player.gold}</span>
          </div>
          <PotionBelt potions={player.potions} />
        </div>

        <div className="hud-center">
          <div className="deck-pill" title={`牌组 (${player.deck?.length ?? 0} 张)`}>
            <img src="/assets/ui-combat/draw_pile.png" className="hud-ico"
              onError={e => { e.target.style.display = 'none' }} />
            <span>{player.deck?.length ?? 0}</span>
          </div>
          <div className="floor-pill">第 {state.floor} 层 · {combatLabel}</div>
        </div>

        <div className="hud-right">
          <div className="hud-stat hud-relic-count">
            <span className="relic-count-ico">✦</span>
            <span>{player.relics?.length ?? 0}</span>
          </div>
        </div>
      </div>

      {/* ── Relic column ─────────────────────────────────────────────── */}
      <RelicColumn relicIds={player.relics} />

      {/* ── Game world ───────────────────────────────────────────────── */}
      <div className="game-world">

        {/* Player */}
        <div className="player-zone" ref={playerZoneRef}>
          {(playerEffects.length > 0 || hasStr) && (
            <div className="fighter-effects">
              {hasStr && <StatusBadge effectKey="STRENGTH" value={player.strength} />}
              {playerEffects.map(([k, v]) => <StatusBadge key={k} effectKey={k} value={v} />)}
            </div>
          )}
          <img
            className="player-art"
            src="/assets/ui-characters/combat_ironclad.png"
            alt="铁甲人"
            onError={e => { e.target.src = '/assets/renders/ironclad.png' }}
          />
          <FighterHP
            current={player.hp} max={player.maxHp}
            block={player.block} showBlock
          />
        </div>

        {/* Enemies */}
        <div className="enemies-group">
          {battle.enemies.map((enemy, idx) => {
            const lethal  = isLethalIntent(enemy.intent, enemy, player)
            const debuffs = Object.entries(enemy.effects || {}).filter(([k, v]) => v > 0 && DEBUFF_KEYS.has(k))
            const buffs   = Object.entries(enemy.effects || {}).filter(([k, v]) => v > 0 && !DEBUFF_KEYS.has(k))
            const hasEStr = (enemy.strength || 0) > 0

            return (
              <div
                key={enemy.instanceId}
                ref={el => { enemyZoneRefs.current[idx] = el }}
                className={`enemy-zone${enemy.hp <= 0 ? ' dead' : ''}${targeting ? ' targetable' : ''}`}
                onClick={() => handleEnemyClick(idx)}
              >
                <IntentBadge intent={enemy.intent} lethal={lethal} />
                {debuffs.length > 0 && (
                  <div className="fighter-effects">
                    {debuffs.map(([k, v]) => <StatusBadge key={k} effectKey={k} value={v} />)}
                  </div>
                )}
                <img
                  className="enemy-art"
                  src={enemy.image}
                  alt={enemy.name}
                  onError={e => { e.target.src = '/assets/renders/cultists.png' }}
                />
                <FighterHP current={enemy.hp} max={enemy.maxHp} />
                <div className="enemy-name-tag">{enemy.name}</div>
                {(buffs.length > 0 || hasEStr || enemy.block > 0) && (
                  <div className="fighter-effects">
                    {enemy.block > 0 && (
                      <span className="sbadge sbadge-block bf">🛡 {enemy.block}</span>
                    )}
                    {hasEStr && <StatusBadge effectKey="STRENGTH" value={enemy.strength} />}
                    {buffs.map(([k, v]) => <StatusBadge key={k} effectKey={k} value={v} />)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Targeting hint ────────────────────────────────────────────── */}
      {targeting && (
        <div className="targeting-hint">
          ↓ 点击敌人攻击
          <button className="cancel-target-btn"
            onClick={() => dispatch({ type: 'DESELECT_CARD' })}>
            取消
          </button>
        </div>
      )}

      {/* ── Large card preview (center) ───────────────────────────────── */}
      {previewCard && (
        <div className="card-preview-overlay">
          <LargeCard card={previewCard} player={player} targetEnemy={defaultTarget} amplifyActive={amplifyActive} />
        </div>
      )}

      {/* ── Enemy turn overlay ────────────────────────────────────────── */}
      {!isPlayerTurn && (
        <div className="enemy-turn-overlay">敌方回合…</div>
      )}

      {/* ── Combat log (bottom-left mini) ────────────────────────────── */}
      <div className="combat-log-mini">
        {battle.log.slice(-4).map((msg, i, arr) => (
          <div key={i} className={i === arr.length - 1 ? 'log-latest' : 'log-old'}>{msg}</div>
        ))}
      </div>

      {/* ── Floating damage / block numbers ──────────────────────────── */}
      {floatNums.map(f => <FloatingNumber key={f.id} item={f} />)}

      {/* ── Bottom zone ───────────────────────────────────────────────── */}
      <div className="battle-bottom">

        {/* Left: Energy hex + draw pile */}
        <div className="bottom-left">
          <div className={`energy-hex${battle.energy === 0 ? ' energy-hex-empty' : ''}`}>
            <span className="energy-cur">{battle.energy}</span>
            <span className="energy-sep">/</span>
            <span className="energy-max-txt">{player.maxEnergy}</span>
          </div>
          <div className="pile-widget draw-pile-w" title={`摸牌堆 ${battle.drawPile.length} 张`}>
            <img src="/assets/ui-combat/draw_pile.png" alt="摸牌"
              onError={e => { e.target.style.display = 'none' }} />
            <span>{battle.drawPile.length}</span>
          </div>
        </div>

        {/* Hand */}
        <div className="hand-container">
          {battle.hand.map((card, i) => {
            const cost = (amplifyActive && card.type === 'POWER') ? 0 : card.cost
            return (
              <HandCard
                key={card.instanceId}
                card={card}
                player={player}
                targetEnemy={defaultTarget}
                index={i}
                total={battle.hand.length}
                selected={card.instanceId === battle.selectedCardId}
                hovered={card.instanceId === hoveredId}
                disabled={!isPlayerTurn || cost > battle.energy}
                amplifyActive={amplifyActive}
                onClick={() => handleCardClick(card)}
                onEnter={() => onEnter(card.instanceId)}
                onLeave={onLeave}
              />
            )
          })}
        </div>

        {/* Right: End Turn + exhaust + discard */}
        <div className="bottom-right">
          {battle.exhaustPile?.length > 0 && (
            <div className="pile-widget exhaust-w" title={`消耗 ${battle.exhaustPile.length} 张`}>
              <span className="exhaust-ico">✦</span>
              <span>{battle.exhaustPile.length}</span>
            </div>
          )}
          <button
            className={`end-turn-btn${!isPlayerTurn ? ' disabled' : ''}`}
            onClick={handleEndTurn}
            disabled={!isPlayerTurn}
          >
            {isPlayerTurn ? '结束回合' : '敌方回合'}
          </button>
          <div className="pile-widget discard-w" title={`弃牌堆 ${battle.discardPile.length} 张`}>
            <img src="/assets/ui-combat/discard_pile.png" alt="弃牌"
              onError={e => { e.target.style.display = 'none' }} />
            <span>{battle.discardPile.length}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
