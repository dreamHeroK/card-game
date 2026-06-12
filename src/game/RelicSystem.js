import { RELIC_DATA } from '../data/relics.js'
import { CARD_DATA } from '../data/cards.js'
import { STATUS } from '../types/index.js'

// ─── Public helpers ────────────────────────────────────────────────────────

/** True if the player owns a relic with the given passive flag. */
export function hasPassive(relics, key) {
  return relics.some(id => RELIC_DATA[id]?.passive?.[key])
}

/** Return the value of the first matching passive, or null. */
export function getPassive(relics, key) {
  for (const id of relics) {
    const v = RELIC_DATA[id]?.passive?.[key]
    if (v !== undefined) return v
  }
  return null
}

/**
 * Fire all owned-relic triggers matching `when`.
 * `state` must have at least { player, battle? }.
 * `ctx` carries extra per-call data (e.g. { card } for CARD_PLAY).
 * Returns the updated state.
 */
export function applyTriggers(when, state, ctx = {}) {
  const relics = state.player?.relics ?? []
  let s = state
  for (const id of relics) {
    const relic = RELIC_DATA[id]
    if (!relic?.triggers) continue
    for (const t of relic.triggers) {
      if (t.when !== when) continue
      if (!conditionMet(t, s, ctx)) continue
      s = applyEffect(t, s, ctx)
    }
  }
  return s
}

/**
 * Apply the one-time OBTAIN triggers for a newly acquired relic and add it to
 * player.relics (singleton-safe — silently skips if already owned).
 * Also handles `replacesRelic` swaps.
 */
export function applyOnObtain(relicId, state) {
  const relic = RELIC_DATA[relicId]
  if (!relic) return state
  // Singleton guard
  if (state.player.relics.includes(relicId)) return state

  let s = { ...state }

  // Remove replaced relic (e.g. BLACK_BLOOD replaces BURNING_BLOOD)
  if (relic.replacesRelic) {
    s = { ...s, player: { ...s.player, relics: s.player.relics.filter(r => r !== relic.replacesRelic) } }
  }

  // Add to inventory first so passives are immediately active
  s = { ...s, player: { ...s.player, relics: [...s.player.relics, relicId] } }

  // Fire OBTAIN triggers
  if (relic.triggers) {
    for (const t of relic.triggers) {
      if (t.when !== 'OBTAIN') continue
      s = applyEffect(t, s, {})
    }
  }
  return s
}

// ─── Internal ──────────────────────────────────────────────────────────────

function conditionMet(t, state, ctx) {
  const { player, battle } = state

  if (t.condition === 'HP_BELOW_HALF')
    return player.hp <= Math.floor(player.maxHp / 2)

  if (t.condition === 'NO_BLOCK')
    return player.block <= 0

  if (t.condition === 'NO_ATTACK_LAST_TURN')
    return battle?.noAttackLastTurn === true

  if (t.onTurn !== undefined)
    return battle?.turnNumber === t.onTurn

  if (t.everyN && t.counter) {
    // counter tracks cumulative plays; fire when hits a multiple of everyN
    const cnt = (battle?.relicCounters?.[t.counter] ?? 0) + 1
    return cnt % t.everyN === 0
  }

  if (t.cardType)
    return ctx.card?.type === t.cardType

  return true
}

function applyEffect(t, state, ctx) {
  let { player, battle } = state

  switch (t.effect) {
    case 'BLOCK':
      player = { ...player, block: player.block + t.amount }
      break

    case 'HEAL':
      player = { ...player, hp: Math.min(player.maxHp, player.hp + t.amount) }
      break

    case 'MAX_HP':
      player = { ...player, maxHp: player.maxHp + t.amount, hp: player.hp + t.amount }
      break

    case 'GOLD':
      if (!hasPassive(player.relics, 'noGoldGain'))
        player = { ...player, gold: player.gold + t.amount }
      break

    case 'STRENGTH':
      player = { ...player, strength: (player.strength || 0) + t.amount }
      break

    case 'ENERGY':
      if (battle) battle = { ...battle, energy: battle.energy + t.amount }
      break

    case 'ENERGY_MAX':
      player = { ...player, maxEnergy: player.maxEnergy + t.amount }
      break

    case 'DRAW':
      if (battle) {
        // Draw `amount` more cards from drawPile into hand
        let hand = [...battle.hand]
        let drawPile = [...battle.drawPile]
        let discardPile = [...battle.discardPile]
        for (let i = 0; i < t.amount; i++) {
          if (drawPile.length === 0) {
            if (discardPile.length === 0) break
            drawPile = shuffleArray(discardPile); discardPile = []
          }
          if (hand.length < 10) hand.push(drawPile.shift())
        }
        battle = { ...battle, hand, drawPile, discardPile }
      }
      break

    case 'DAMAGE_ALL':
      if (battle) {
        battle = {
          ...battle,
          enemies: battle.enemies.map(e => e.hp <= 0 ? e : { ...e, hp: Math.max(0, e.hp - t.amount) }),
        }
      }
      break

    case 'VULNERABLE_ALL':
      if (battle) {
        battle = {
          ...battle,
          enemies: battle.enemies.map(e => ({
            ...e,
            effects: { ...e.effects, [STATUS.VULNERABLE]: (e.effects?.[STATUS.VULNERABLE] || 0) + t.amount },
          })),
        }
      }
      break

    case 'WEAK_ALL':
      if (battle) {
        battle = {
          ...battle,
          enemies: battle.enemies.map(e => ({
            ...e,
            effects: { ...e.effects, [STATUS.WEAK]: (e.effects?.[STATUS.WEAK] || 0) + t.amount },
          })),
        }
      }
      break

    case 'ENEMY_STRENGTH':
      if (battle) {
        battle = {
          ...battle,
          enemies: battle.enemies.map(e => ({ ...e, strength: (e.strength || 0) + t.amount })),
        }
      }
      break

    case 'UPGRADE_SKILLS':
      player = { ...player, deck: upgradeNCards(player.deck, 'SKILL', t.count) }
      break

    case 'UPGRADE_ATTACKS':
      player = { ...player, deck: upgradeNCards(player.deck, 'ATTACK', t.count) }
      break

    case 'PENDING_BLOCK':
      // Stored on player; applied next turn start in BattleSystem
      player = { ...player, pendingBlock: (player.pendingBlock || 0) + t.amount }
      break

    case 'HEAL_PER_5_CARDS': {
      const amt = Math.floor(player.deck.length / 5) * 3
      if (amt > 0) player = { ...player, hp: Math.min(player.maxHp, player.hp + amt) }
      break
    }

    default: break
  }

  // Advance counter for everyN triggers
  if (t.everyN && t.counter && battle) {
    const prev = battle.relicCounters?.[t.counter] ?? 0
    battle = {
      ...battle,
      relicCounters: { ...(battle.relicCounters || {}), [t.counter]: (prev + 1) % t.everyN },
    }
  }

  return { ...state, player, ...(battle !== undefined ? { battle } : {}) }
}

function upgradeNCards(deck, cardType, n) {
  const eligible = deck.filter(c => c.type === cardType && !c.upgraded && c.upgradeId && CARD_DATA[c.upgradeId])
  const targets = new Set(
    [...eligible].sort(() => Math.random() - 0.5).slice(0, n).map(c => c.instanceId)
  )
  return deck.map(c =>
    targets.has(c.instanceId) ? { ...CARD_DATA[c.upgradeId], instanceId: c.instanceId } : c
  )
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
