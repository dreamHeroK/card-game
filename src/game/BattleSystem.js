import { CARD_DATA } from '../data/cards.js'
import { MONSTER_DATA } from '../data/monsters.js'
import { RELIC_DATA } from '../data/relics.js'
import { STATUS } from '../types/index.js'

// Power-card effects that persist indefinitely (not decremented each turn)
const PERMANENT_EFFECTS = new Set([
  STATUS.STRENGTH, STATUS.DEXTERITY, STATUS.RITUAL,
  STATUS.METALLICIZE, STATUS.FEEL_NO_PAIN, STATUS.DEMON_FORM, STATUS.BARRICADE,
  STATUS.DOUBLE_TAP, STATUS.AMPLIFY,
])

// Debuffs use max-overwrite stacking (not additive); buffs use additive stacking
const DEBUFF_EFFECTS = new Set([STATUS.VULNERABLE, STATUS.WEAK, STATUS.FRAIL, STATUS.POISON])

let _counter = 0
function uid() { return 'id_' + (++_counter) }

export function createCardInstance(cardData) {
  return { ...cardData, instanceId: uid() }
}

export function createEnemyInstance(monsterId) {
  const def = MONSTER_DATA[monsterId]
  if (!def) return null
  const hp = def.minHp + Math.floor(Math.random() * (def.maxHp - def.minHp + 1))
  return {
    id: monsterId,
    instanceId: uid(),
    name: def.name,
    hp,
    maxHp: hp,
    block: 0,
    strength: def.strength || 0,
    effects: {},
    intent: getEnemyIntent(monsterId, 0, 1),
    moveIndex: 0,
    image: def.image,
  }
}

export function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// opts.vulnerableMultiplier overrides the default 1.5 (e.g. Paper Phrog → 1.75)
export function calculateDamage(baseDamage, attacker, defender, opts = {}) {
  let dmg = baseDamage + (attacker.strength || 0)
  if ((attacker.effects?.[STATUS.WEAK] || 0) > 0) dmg = Math.floor(dmg * 0.75)
  if ((defender.effects?.[STATUS.VULNERABLE] || 0) > 0)
    dmg = Math.floor(dmg * (opts.vulnerableMultiplier ?? 1.5))
  return Math.max(0, dmg)
}

export function calculateBlock(baseBlock, entity) {
  let blk = baseBlock + (entity.dexterity || 0)
  if ((entity.effects?.[STATUS.FRAIL] || 0) > 0) blk = Math.floor(blk * 0.75)
  return Math.max(0, blk)
}

export function applyDamageToEntity(entity, damage) {
  if (damage <= 0) return entity
  if (damage <= entity.block) return { ...entity, block: entity.block - damage }
  return { ...entity, block: 0, hp: Math.max(0, entity.hp - (damage - entity.block)) }
}

export function applyEffectToEntity(entity, effectKey, amount) {
  const artifact = entity.effects?.[STATUS.ARTIFACT] || 0
  const isDebuff = DEBUFF_EFFECTS.has(effectKey)
  if (isDebuff && artifact > 0) {
    return {
      ...entity,
      effects: { ...entity.effects, [STATUS.ARTIFACT]: artifact - 1 },
    }
  }
  const current = entity.effects?.[effectKey] || 0
  // Debuffs: overwrite only if higher magnitude (take max)
  // Buffs: additive stacking
  const newAmount = isDebuff ? Math.max(current, amount) : current + amount
  return { ...entity, effects: { ...entity.effects, [effectKey]: newAmount } }
}

export function getEnemyIntent(monsterId, moveIndex, turnNumber) {
  const def = MONSTER_DATA[monsterId]
  if (!def) return { type: 'ATTACK', value: 5, times: 1, description: '攻击' }
  let move
  if (def.random) {
    move = def.pattern[Math.floor(Math.random() * def.pattern.length)]
  } else {
    const idx = moveIndex % def.pattern.length
    move = def.pattern[idx]
  }
  return {
    type: move.type,
    value: move.value,
    times: move.times || 1,
    description: move.description || move.type,
    move,
  }
}

export function drawCards(battle, count) {
  let hand = [...battle.hand]
  let drawPile = [...battle.drawPile]
  let discardPile = [...battle.discardPile]

  for (let i = 0; i < count; i++) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) break
      drawPile = shuffleArray(discardPile)
      discardPile = []
    }
    if (hand.length >= 10) break
    hand.push(drawPile.shift())
  }
  return { ...battle, hand, drawPile, discardPile }
}

export function initBattle(player, enemyMonsterIds, combatType) {
  const deck = player.deck.map(c => ({ ...c, instanceId: uid() }))
  let drawPile = shuffleArray(deck)

  // SNECKO_EYE: randomise costs of all cards in deck at battle start
  const hasSnecko = player.relics.includes('SNECKO_EYE')
  if (hasSnecko) {
    drawPile = drawPile.map(c => ({ ...c, cost: Math.floor(Math.random() * 4) }))
  }

  // Initial draw (SNECKO_EYE also draws 2 extra via COMBAT_START trigger in GameState)
  const hand = drawPile.splice(0, 5)

  const enemies = enemyMonsterIds.map(id => createEnemyInstance(id)).filter(Boolean)

  return {
    player: { ...player, block: 0, effects: {} },
    battle: {
      enemies,
      hand,
      drawPile,
      discardPile: [],
      exhaustPile: [],
      turn: 'PLAYER',
      selectedCardId: null,
      energy: player.maxEnergy,
      log: ['战斗开始！'],
      turnNumber: 1,
      combatType,
      firstAttackUsed: false,
      // Relic tracking
      relicCounters: {},
      cardsPlayedThisTurn: 0,
      attackPlayedThisTurn: false,
      noAttackLastTurn: false,
      firstStrengthUsed: false,
    },
  }
}

function upgradeCardInBattle(card) {
  if (card.upgraded || !card.upgradeId || !CARD_DATA[card.upgradeId]) return card
  return { ...CARD_DATA[card.upgradeId], instanceId: card.instanceId }
}

export function resolveCardEffect(state, cardInstanceId, targetIndex) {
  const { battle } = state
  let player = { ...state.player }

  // VELVET_CHOKER: max 6 cards per turn
  if (player.relics.includes('VELVET_CHOKER') && (battle.cardsPlayedThisTurn || 0) >= 6) return state

  let enemies = [...battle.enemies]
  let hand = battle.hand.filter(c => c.instanceId !== cardInstanceId)
  let drawPile = [...battle.drawPile]
  let discardPile = [...battle.discardPile]
  let exhaustPile = [...battle.exhaustPile]
  let energy = battle.energy
  let log = [...battle.log]
  let firstAttackUsed = battle.firstAttackUsed
  let cardsPlayedThisTurn = battle.cardsPlayedThisTurn || 0
  let attackPlayedThisTurn = battle.attackPlayedThisTurn || false
  let relicCounters = { ...(battle.relicCounters || {}) }

  const card = battle.hand.find(c => c.instanceId === cardInstanceId)
  if (!card) return state

  // AMPLIFY: next Power costs 0
  let actualCost = card.cost
  if (card.type === 'POWER' && (player.effects?.[STATUS.AMPLIFY] || 0) > 0) {
    actualCost = 0
    player = { ...player, effects: { ...player.effects, [STATUS.AMPLIFY]: (player.effects[STATUS.AMPLIFY] || 0) - 1 } }
  }
  energy -= actualCost

  const hadDoubleTap = card.type === 'ATTACK' && (player.effects?.[STATUS.DOUBLE_TAP] || 0) > 0

  const baseId = card.id.replace('_PLUS', '')

  // PAPER_PHROG: get vulnerable multiplier from passive
  const vulnMult = player.relics.reduce((m, id) => {
    const v = RELIC_DATA[id]?.passive?.vulnerableMultiplier
    return v !== undefined ? v : m
  }, 1.5)

  if (!card.exhaust) {
    discardPile = [...discardPile, card]
  } else {
    exhaustPile = [...exhaustPile, card]
    // Feel No Pain: gain block on exhaust
    const fnp = player.effects?.[STATUS.FEEL_NO_PAIN] || 0
    if (fnp > 0) player = { ...player, block: player.block + fnp }
    // Charon's Ashes: deal 3 to all enemies on exhaust
    if (player.relics.includes('CHARONS_ASHES')) {
      enemies = enemies.map(e => e.hp > 0 ? applyDamageToEntity(e, 3) : e)
    }
  }

  const applyAttack = (target, baseDmg) => {
    let dmg = calculateDamage(baseDmg, player, target, { vulnerableMultiplier: vulnMult })
    if (card.type === 'ATTACK' && !firstAttackUsed && player.relics.includes('AKABEKO')) {
      dmg += 8
      firstAttackUsed = true
    } else if (card.type === 'ATTACK' && !firstAttackUsed) {
      firstAttackUsed = true
    }
    return applyDamageToEntity(target, dmg)
  }

  switch (baseId) {
    case 'STRIKE_R': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      enemies = enemies.map((e, i) => i === ti ? applyAttack(e, card.damage) : e)
      log = [...log, `打出了 ${card.name}，造成伤害`]
      break
    }
    case 'DEFEND_R': {
      const blk = calculateBlock(card.block, player)
      player = { ...player, block: player.block + blk }
      log = [...log, `打出了 ${card.name}，获得 ${blk} 格挡`]
      break
    }
    case 'BASH': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      let enemy = applyAttack(enemies[ti], card.damage)
      enemy = applyEffectToEntity(enemy, STATUS.VULNERABLE, card.magicNumber)
      enemies = enemies.map((e, i) => i === ti ? enemy : e)
      log = [...log, `打出了 ${card.name}，施加易伤`]
      break
    }
    case 'ANGER': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      enemies = enemies.map((e, i) => i === ti ? applyAttack(e, card.damage) : e)
      const copy = { ...card, instanceId: uid() }
      discardPile = [...discardPile, copy]
      log = [...log, `打出了 ${card.name}`]
      break
    }
    case 'CLEAVE': {
      enemies = enemies.map(e => e.hp > 0 ? applyAttack(e, card.damage) : e)
      log = [...log, `打出了 ${card.name}，攻击所有敌人`]
      break
    }
    case 'ARMAMENTS': {
      const blk = calculateBlock(card.block, player)
      player = { ...player, block: player.block + blk }
      if (card.upgraded) {
        hand = hand.map(upgradeCardInBattle)
      } else {
        const upgradable = hand.filter(c => !c.upgraded && c.upgradeId && CARD_DATA[c.upgradeId])
        if (upgradable.length > 0) {
          const target = upgradable[Math.floor(Math.random() * upgradable.length)]
          hand = hand.map(c => c.instanceId === target.instanceId ? upgradeCardInBattle(c) : c)
        }
      }
      log = [...log, `打出了 ${card.name}`]
      break
    }
    case 'POMMEL_STRIKE': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      enemies = enemies.map((e, i) => i === ti ? applyAttack(e, card.damage) : e)
      const drawn = drawCardsInto({ hand, drawPile, discardPile }, card.magicNumber)
      hand = drawn.hand
      drawPile = drawn.drawPile
      discardPile = drawn.discardPile
      log = [...log, `打出了 ${card.name}，摸 ${card.magicNumber} 张牌`]
      break
    }
    case 'SHRUG_IT_OFF': {
      const blk = calculateBlock(card.block, player)
      player = { ...player, block: player.block + blk }
      const drawn = drawCardsInto({ hand, drawPile, discardPile }, 1)
      hand = drawn.hand
      drawPile = drawn.drawPile
      discardPile = drawn.discardPile
      log = [...log, `打出了 ${card.name}`]
      break
    }
    case 'FLEX': {
      const amt = card.magicNumber
      player = {
        ...player,
        strength: player.strength + amt,
        effects: { ...player.effects, [STATUS.FLEX_STRENGTH]: (player.effects[STATUS.FLEX_STRENGTH] || 0) + amt },
      }
      log = [...log, `打出了 ${card.name}，获得 ${amt} 临时力量`]
      break
    }
    case 'INFLAME': {
      player = { ...player, strength: player.strength + card.magicNumber }
      log = [...log, `打出了 ${card.name}，获得 ${card.magicNumber} 力量`]
      break
    }
    case 'BURN': {
      player = applyDamageToEntity(player, 4)
      log = [...log, `触发了灼烧，对自身造成 4 点伤害`]
      break
    }
    // ── New COMMON ─────────────────────────────────────────────────────
    case 'IRON_WAVE': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      enemies = enemies.map((e, i) => i === ti ? applyAttack(e, card.damage) : e)
      const blk = calculateBlock(card.block, player)
      player = { ...player, block: player.block + blk }
      log = [...log, `打出了 ${card.name}，造成伤害并获得 ${blk} 格挡`]
      break
    }
    case 'HEADBUTT': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      enemies = enemies.map((e, i) => i === ti ? applyAttack(e, card.damage) : e)
      if (discardPile.length > 0) {
        const top = discardPile[discardPile.length - 1]
        discardPile = discardPile.slice(0, -1)
        drawPile = [top, ...drawPile]
      }
      log = [...log, `打出了 ${card.name}`]
      break
    }
    case 'THUNDERCLAP': {
      enemies = enemies.map(e => {
        if (e.hp <= 0) return e
        let updated = applyAttack(e, card.damage)
        updated = applyEffectToEntity(updated, STATUS.VULNERABLE, card.magicNumber || 1)
        return updated
      })
      log = [...log, `打出了 ${card.name}，攻击所有敌人并施加易伤`]
      break
    }
    case 'TWIN_STRIKE': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      const hits = card.hits || 2
      for (let h = 0; h < hits; h++) {
        enemies = enemies.map((e, i) => i === ti ? applyAttack(e, card.damage) : e)
      }
      log = [...log, `打出了 ${card.name}，攻击 ${hits} 次`]
      break
    }
    // ── New UNCOMMON ───────────────────────────────────────────────────
    case 'CARNAGE': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      enemies = enemies.map((e, i) => i === ti ? applyAttack(e, card.damage) : e)
      log = [...log, `打出了 ${card.name}，造成大量伤害`]
      break
    }
    case 'UPPERCUT': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      let enemy = applyAttack(enemies[ti], card.damage)
      enemy = applyEffectToEntity(enemy, STATUS.WEAK, card.magicNumber || 1)
      enemy = applyEffectToEntity(enemy, STATUS.VULNERABLE, card.magicNumber || 1)
      enemies = enemies.map((e, i) => i === ti ? enemy : e)
      log = [...log, `打出了 ${card.name}，施加虚弱和易伤`]
      break
    }
    case 'ENTRENCH': {
      player = { ...player, block: player.block * 2 }
      log = [...log, `打出了 ${card.name}，格挡翻倍为 ${player.block}`]
      break
    }
    case 'HEMOKINESIS': {
      const ti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
      player = applyDamageToEntity(player, card.selfDamage || 2)
      enemies = enemies.map((e, i) => i === ti ? applyAttack(e, card.damage) : e)
      log = [...log, `打出了 ${card.name}，失去生命值并造成伤害`]
      break
    }
    case 'METALLICIZE': {
      const amt = card.magicNumber || 3
      player = { ...player, effects: { ...player.effects, [STATUS.METALLICIZE]: (player.effects?.[STATUS.METALLICIZE] || 0) + amt } }
      log = [...log, `打出了 ${card.name}，每回合获得 ${amt} 格挡`]
      break
    }
    case 'FEEL_NO_PAIN': {
      const amt = card.magicNumber || 3
      player = { ...player, effects: { ...player.effects, [STATUS.FEEL_NO_PAIN]: (player.effects?.[STATUS.FEEL_NO_PAIN] || 0) + amt } }
      log = [...log, `打出了 ${card.name}，消耗牌时获得 ${amt} 格挡`]
      break
    }
    // ── New RARE ───────────────────────────────────────────────────────
    case 'LIMIT_BREAK': {
      player = { ...player, strength: (player.strength || 0) * 2 }
      log = [...log, `打出了 ${card.name}，力量翻倍为 ${player.strength}`]
      break
    }
    case 'REAPER': {
      let totalHeal = 0
      enemies = enemies.map(e => {
        if (e.hp <= 0) return e
        const dmg = calculateDamage(card.damage || 4, player, e)
        totalHeal += Math.min(dmg, e.hp + e.block)
        return applyDamageToEntity(e, dmg)
      })
      if (totalHeal > 0) {
        player = { ...player, hp: Math.min(player.maxHp, player.hp + totalHeal) }
      }
      log = [...log, `打出了 ${card.name}，回复了 ${totalHeal} 点生命值`]
      break
    }
    case 'DEMON_FORM': {
      const amt = card.magicNumber || 2
      player = { ...player, effects: { ...player.effects, [STATUS.DEMON_FORM]: (player.effects?.[STATUS.DEMON_FORM] || 0) + amt } }
      log = [...log, `打出了 ${card.name}，每回合获得 ${amt} 力量`]
      break
    }
    case 'BARRICADE': {
      player = { ...player, effects: { ...player.effects, [STATUS.BARRICADE]: 1 } }
      log = [...log, `打出了 ${card.name}，格挡不再消失`]
      break
    }
    default:
      log = [...log, `打出了 ${card.name}`]
  }

  // DOUBLE_TAP: replay the full attack effect once more
  if (hadDoubleTap) {
    player = { ...player, effects: { ...player.effects, [STATUS.DOUBLE_TAP]: (player.effects[STATUS.DOUBLE_TAP] || 0) - 1 } }
    const dti = Math.max(0, Math.min(targetIndex, enemies.length - 1))
    switch (baseId) {
      case 'STRIKE_R': case 'IRON_WAVE': case 'HEADBUTT': case 'HEMOKINESIS':
      case 'POMMEL_STRIKE': case 'CARNAGE': {
        enemies = enemies.map((e, i) => i === dti ? applyAttack(e, card.damage) : e)
        break
      }
      case 'BASH': {
        enemies = enemies.map((e, i) => {
          if (i !== dti) return e
          let u = applyAttack(e, card.damage)
          u = applyEffectToEntity(u, STATUS.VULNERABLE, card.magicNumber)
          return u
        })
        break
      }
      case 'UPPERCUT': {
        enemies = enemies.map((e, i) => {
          if (i !== dti) return e
          let u = applyAttack(e, card.damage)
          u = applyEffectToEntity(u, STATUS.WEAK, card.magicNumber || 1)
          u = applyEffectToEntity(u, STATUS.VULNERABLE, card.magicNumber || 1)
          return u
        })
        break
      }
      case 'CLEAVE': {
        enemies = enemies.map(e => e.hp > 0 ? applyAttack(e, card.damage) : e)
        break
      }
      case 'THUNDERCLAP': {
        enemies = enemies.map(e => {
          if (e.hp <= 0) return e
          let u = applyAttack(e, card.damage)
          u = applyEffectToEntity(u, STATUS.VULNERABLE, card.magicNumber || 1)
          return u
        })
        break
      }
      case 'TWIN_STRIKE': {
        for (let h = 0; h < (card.hits || 2); h++) {
          enemies = enemies.map((e, i) => i === dti ? applyAttack(e, card.damage) : e)
        }
        break
      }
      case 'ANGER': {
        enemies = enemies.map((e, i) => i === dti ? applyAttack(e, card.damage) : e)
        discardPile = [...discardPile, { ...card, instanceId: uid() }]
        break
      }
      case 'REAPER': {
        let healAmt = 0
        enemies = enemies.map(e => {
          if (e.hp <= 0) return e
          const dmg = calculateDamage(card.damage || 4, player, e)
          healAmt += Math.min(dmg, e.hp + e.block)
          return applyDamageToEntity(e, dmg)
        })
        if (healAmt > 0) player = { ...player, hp: Math.min(player.maxHp, player.hp + healAmt) }
        break
      }
    }
    log = [...log, `连击触发！${card.name} 再次命中`]
  }

  // Post-play tracking
  cardsPlayedThisTurn++
  if (card.type === 'ATTACK') {
    attackPlayedThisTurn = true
    // NUNCHAKU: every 10 attacks, gain 1 energy
    if (player.relics.includes('NUNCHAKU')) {
      relicCounters.NUNCHAKU = (relicCounters.NUNCHAKU || 0) + 1
      if (relicCounters.NUNCHAKU >= 10) {
        energy++
        relicCounters.NUNCHAKU = 0
        log = [...log, '算盘链：获得 1 点能量']
      }
    }
  }

  return {
    ...state,
    player,
    battle: {
      ...battle,
      enemies,
      hand,
      drawPile,
      discardPile,
      exhaustPile,
      energy,
      log,
      firstAttackUsed,
      cardsPlayedThisTurn,
      attackPlayedThisTurn,
      relicCounters,
    },
  }
}

function drawCardsInto(piles, count) {
  let { hand, drawPile, discardPile } = piles
  hand = [...hand]
  drawPile = [...drawPile]
  discardPile = [...discardPile]
  for (let i = 0; i < count; i++) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) break
      drawPile = shuffleArray(discardPile)
      discardPile = []
    }
    if (hand.length >= 10) break
    hand.push(drawPile.shift())
  }
  return { hand, drawPile, discardPile }
}

export function endPlayerTurn(state) {
  let player = { ...state.player }
  let battle = { ...state.battle }

  const flexAmt = player.effects[STATUS.FLEX_STRENGTH] || 0
  if (flexAmt > 0) {
    player = {
      ...player,
      strength: Math.max(0, player.strength - flexAmt),
      effects: { ...player.effects, [STATUS.FLEX_STRENGTH]: 0 },
    }
  }

  // ORICHALCUM: gain 6 block if ending turn with no block
  if (player.relics.includes('ORICHALCUM') && player.block === 0) {
    player = { ...player, block: 6 }
  }

  // RUNIC_PYRAMID: retain entire hand
  const hasRunicPyramid = player.relics.includes('RUNIC_PYRAMID')
  const retained = hasRunicPyramid ? battle.hand : battle.hand.filter(c => c.retain)
  const discarded = hasRunicPyramid ? [] : battle.hand.filter(c => !c.retain)

  battle = {
    ...battle,
    hand: retained,
    discardPile: [...battle.discardPile, ...discarded],
    turn: 'ENEMY',
    selectedCardId: null,
    noAttackLastTurn: !(battle.attackPlayedThisTurn || false),
  }

  return { ...state, player, battle }
}

export function resolveEnemyTurn(state) {
  let player = { ...state.player }
  let battle = { ...state.battle }
  let enemies = [...battle.enemies]
  let log = [...battle.log]

  const hasTungstenRod = player.relics.includes('TUNGSTEN_ROD')

  enemies = enemies.map(enemy => {
    if (enemy.hp <= 0) return enemy

    // Clear block at the start of enemy's turn (mirrors STS: block resets each round)
    let e = { ...enemy, block: 0 }

    // === atStartOfTurn() triggers - before duration decrement ===
    // RITUAL: gain strength each turn
    const ritualAmt = e.effects?.[STATUS.RITUAL] || 0
    if (ritualAmt > 0) {
      e = { ...e, strength: (e.strength || 0) + ritualAmt }
    }

    // POISON: deal damage then decrement (handled by duration loop below)
    const enemyPoison = e.effects?.[STATUS.POISON] || 0
    if (enemyPoison > 0) {
      e = applyDamageToEntity(e, enemyPoison)
      log = [...log, `${e.name} 受到 ${enemyPoison} 点毒素伤害`]
      if (e.hp <= 0) {
        const diedEffects = {}
        for (const [key, val] of Object.entries(e.effects || {})) {
          if (PERMANENT_EFFECTS.has(key)) diedEffects[key] = val
          else if (val > 1) diedEffects[key] = val - 1
        }
        return { ...e, effects: diedEffects }
      }
    }

    // === Reduce duration (after triggers) ===
    const newEffects = {}
    for (const [key, val] of Object.entries(e.effects || {})) {
      if (PERMANENT_EFFECTS.has(key)) {
        newEffects[key] = val
      } else if (val > 1) {
        newEffects[key] = val - 1
      }
    }
    e = { ...e, effects: newEffects }

    const intent = e.intent
    if (intent.type === 'ATTACK') {
      for (let i = 0; i < (intent.times || 1); i++) {
        let dmg = calculateDamage(intent.value || 0, e, player)
        // TUNGSTEN_ROD: reduce each hit by 1
        if (hasTungstenRod) dmg = Math.max(0, dmg - 1)
        player = applyDamageToEntity(player, dmg)
      }
      log = [...log, `${e.name} 攻击了你！`]
    } else if (intent.type === 'DEFEND') {
      e = { ...e, block: e.block + (intent.value || 0) }
      log = [...log, `${e.name} 获得了格挡`]
    } else if (intent.type === 'BUFF') {
      const move = intent.move || {}
      if (move.buffId === 'STRENGTH') {
        // Immediate permanent strength gain
        e = { ...e, strength: (e.strength || 0) + (move.buffAmount || 0) }
      } else if (move.buffId === 'RITUAL') {
        // Store ritual amount in effects — triggers each turn via RITUAL block above
        e = { ...e, effects: { ...e.effects, [STATUS.RITUAL]: (e.effects?.[STATUS.RITUAL] || 0) + (move.buffAmount || 0) } }
      }
      log = [...log, `${e.name} 获得了增益`]
    } else if (intent.type === 'DEBUFF') {
      const move = intent.move || {}
      if (move.debuffId === 'WEAK') {
        player = applyEffectToEntity(player, STATUS.WEAK, move.debuffAmount || 1)
      } else if (move.debuffId === 'VULNERABLE') {
        player = applyEffectToEntity(player, STATUS.VULNERABLE, move.debuffAmount || 1)
      } else if (move.debuffId === 'FRAIL') {
        player = applyEffectToEntity(player, STATUS.FRAIL, move.debuffAmount || 1)
      } else if (move.debuffId === 'POISON') {
        player = applyEffectToEntity(player, STATUS.POISON, move.debuffAmount || 1)
      }
      log = [...log, `${e.name} 对你施加了减益`]
    }

    if (intent.move?.selfBuff) {
      const sb = intent.move.selfBuff
      e = { ...e, strength: (e.strength || 0) + (sb.buffAmount || 0) }
    }

    let nextMoveIndex = e.moveIndex + 1
    const nextIntent = getEnemyIntent(e.id, nextMoveIndex, battle.turnNumber)
    e = { ...e, moveIndex: nextMoveIndex, intent: nextIntent }

    return e
  })

  // LIZARD_TAIL: death save — heal to 50% max HP on lethal hit (single use)
  if (player.hp <= 0 && player.relics.includes('LIZARD_TAIL')) {
    player = {
      ...player,
      hp: Math.floor(player.maxHp / 2),
      relics: player.relics.filter(r => r !== 'LIZARD_TAIL'),
    }
    log = [...log, '蜥蜴尾：濒死触发！回复至半血']
  }

  return { ...state, player, battle: { ...battle, enemies, log } }
}

export function startPlayerTurn(state) {
  // Barricade: block persists across turns
  const hasBarricade = (state.player.effects?.[STATUS.BARRICADE] || 0) > 0
  let player = { ...state.player, block: hasBarricade ? state.player.block : 0 }
  let battle = { ...state.battle }
  let log = [...battle.log]

  // Apply pendingBlock accumulated from relics (e.g. SELF_FORMING_CLAY)
  if ((player.pendingBlock || 0) > 0) {
    player = { ...player, block: player.block + player.pendingBlock, pendingBlock: 0 }
  }

  // === atStartOfTurn() triggers — must run BEFORE duration decrement ===

  // POISON: deal damage equal to stacks (decremented by duration loop below)
  const poisonAmt = player.effects?.[STATUS.POISON] || 0
  if (poisonAmt > 0) {
    player = applyDamageToEntity(player, poisonAmt)
    log = [...log, `毒素对你造成 ${poisonAmt} 点伤害`]
  }

  // Demon Form: gain strength each player turn start
  const demonFormAmt = player.effects?.[STATUS.DEMON_FORM] || 0
  if (demonFormAmt > 0) {
    player = { ...player, strength: (player.strength || 0) + demonFormAmt }
  }

  // Metallicize: gain block each player turn start
  const metallicizeAmt = player.effects?.[STATUS.METALLICIZE] || 0
  if (metallicizeAmt > 0) {
    player = { ...player, block: player.block + metallicizeAmt }
  }

  // === Reduce duration (after all triggers have fired) ===
  const newEffects = {}
  for (const [key, val] of Object.entries(player.effects || {})) {
    if (PERMANENT_EFFECTS.has(key)) {
      newEffects[key] = val
    } else if (val > 1) {
      newEffects[key] = val - 1
    }
    // val === 1: effect expires — not added to newEffects
  }
  player = { ...player, effects: newEffects }

  // ICE_CREAM: carry over unspent energy instead of resetting
  const hasIceCream = player.relics.includes('ICE_CREAM')
  const newEnergy = hasIceCream ? battle.energy + player.maxEnergy : player.maxEnergy

  // SNECKO_EYE: draw 2 extra cards each turn
  const drawCount = player.relics.includes('SNECKO_EYE') ? 7 : 5
  const drawn = drawCardsInto({ hand: battle.hand, drawPile: battle.drawPile, discardPile: battle.discardPile }, drawCount)

  // SNECKO_EYE: randomize costs of newly drawn cards
  let newHand = drawn.hand
  if (player.relics.includes('SNECKO_EYE')) {
    const existingIds = new Set(battle.hand.map(c => c.instanceId))
    newHand = newHand.map(c =>
      existingIds.has(c.instanceId) ? c : { ...c, cost: Math.floor(Math.random() * 4) }
    )
  }

  battle = {
    ...battle,
    hand: newHand,
    drawPile: drawn.drawPile,
    discardPile: drawn.discardPile,
    turn: 'PLAYER',
    energy: newEnergy,
    log,
    turnNumber: battle.turnNumber + 1,
    firstAttackUsed: false,
    cardsPlayedThisTurn: 0,
    attackPlayedThisTurn: false,
  }

  return { ...state, player, battle }
}

export function checkBattleEnd(battle) {
  if (!battle) return null
  const allDead = battle.enemies.every(e => e.hp <= 0)
  if (allDead) return 'VICTORY'
  return null
}
