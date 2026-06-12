import { CARD_DATA, STARTING_DECK } from '../data/cards.js'
import { ENCOUNTER_TABLE } from '../data/monsters.js'
import { RELIC_DATA, STARTING_RELIC, COMMON_RELICS, UNCOMMON_RELICS, RARE_RELICS, BOSS_RELICS } from '../data/relics.js'
import { EVENT_DATA } from '../data/events.js'
import { generateMap, advanceMap } from './MapSystem.js'
import { generateShop } from './ShopSystem.js'
import { applyTriggers, applyOnObtain } from './RelicSystem.js'
import * as BS from './BattleSystem.js'

function drawEliteRelic(ownedRelics) {
  const roll = Math.random() * 100
  const pool = roll < 50 ? COMMON_RELICS : roll < 83 ? UNCOMMON_RELICS : RARE_RELICS
  const available = pool.filter(id => !ownedRelics.includes(id))
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

function drawBossRelics(ownedRelics, count) {
  const available = BOSS_RELICS.filter(id => !ownedRelics.includes(id))
  return BS.shuffleArray(available).slice(0, count)
}

export function createInitialState() {
  return {
    screen: 'MAIN_MENU',
    player: {
      maxHp: 80, hp: 80, block: 0, gold: 99,
      energy: 3, maxEnergy: 3, strength: 0, dexterity: 0,
      effects: {}, relics: [], deck: [],
    },
    map: null,
    battle: null,
    reward: null,
    shop: null,
    event: null,
    act: 1,
    floor: 0,
    currentNodeType: null,
    // Rare pity counter: starts at -5%, +1% per non-rare offered, cap 40%, reset on rare
    rarePityOffset: -5,
  }
}

// Return all non-upgraded cards of the given rarity (no Basics/Statuses).
function getCardPool(rarity) {
  return Object.values(CARD_DATA).filter(c => c.rarity === rarity && !c.upgraded)
}

// Base rarity weights per combat type (percentages).
const RARITY_WEIGHTS = {
  NORMAL: { COMMON: 60, UNCOMMON: 37, RARE: 3 },
  ELITE:  { COMMON: 50, UNCOMMON: 40, RARE: 10 },
  BOSS:   { COMMON: 0,  UNCOMMON: 0,  RARE: 100 },
}

function generateReward(state, combatType) {
  let gold
  if (combatType === 'BOSS') gold = 100
  else if (combatType === 'ELITE') gold = 25 + Math.floor(Math.random() * 11)
  else gold = 10 + Math.floor(Math.random() * 7)

  // ── Rarity roll with pity ──────────────────────────────────────────────
  const rarePityOffset = state.rarePityOffset ?? -5
  const weights = RARITY_WEIGHTS[combatType] || RARITY_WEIGHTS.NORMAL
  const effectiveRare = Math.max(0, Math.min(100, weights.RARE + rarePityOffset))

  let rarity
  let nextRarePityOffset

  if (combatType === 'BOSS') {
    rarity = 'RARE'
    nextRarePityOffset = -5
  } else {
    const nonRareBase = weights.COMMON + weights.UNCOMMON
    const nonRarePortion = 100 - effectiveRare
    const adjUncommon = nonRareBase > 0 ? (weights.UNCOMMON / nonRareBase) * nonRarePortion : 0

    const roll = Math.random() * 100
    if (roll < effectiveRare) {
      rarity = 'RARE'
      nextRarePityOffset = -5
    } else if (roll < effectiveRare + adjUncommon) {
      rarity = 'UNCOMMON'
      nextRarePityOffset = Math.min(40, rarePityOffset + 1)
    } else {
      rarity = 'COMMON'
      nextRarePityOffset = Math.min(40, rarePityOffset + 1)
    }
  }

  // ── Pick 3 cards from class pool ───────────────────────────────────────
  let pool = getCardPool(rarity)
  if (pool.length === 0) {
    // Safety fallback — shouldn't happen with a full pool
    pool = getCardPool('COMMON')
  }
  let cardChoices = BS.shuffleArray(pool).slice(0, 3)

  // ── Act 2/3 auto-upgrade for non-rare cards ────────────────────────────
  if (state.act >= 2 && rarity !== 'RARE') {
    const upgradeChance = state.act >= 3 ? 0.5 : 0.25
    cardChoices = cardChoices.map(card => {
      if (Math.random() < upgradeChance && card.upgradeId && CARD_DATA[card.upgradeId]) {
        return CARD_DATA[card.upgradeId]
      }
      return card
    })
  }

  // ── Relic for elite / boss ─────────────────────────────────────────────
  let relic = null
  let relicId = null
  let bossRelicChoices = null

  if (combatType === 'ELITE') {
    relicId = drawEliteRelic(state.player.relics)
    relic = relicId ? RELIC_DATA[relicId] : null
  } else if (combatType === 'BOSS') {
    bossRelicChoices = drawBossRelics(state.player.relics, 3)
  }

  return { gold, cardChoices, relic, relicId, bossRelicChoices, combatType, rarity, nextRarePityOffset }
}

export function gameReducer(state, action) {
  switch (action.type) {

    case 'START_GAME': {
      const deck = STARTING_DECK.map(id => BS.createCardInstance(CARD_DATA[id]))
      const map = generateMap(1)
      return {
        ...createInitialState(),
        screen: 'MAP',
        player: {
          maxHp: 80, hp: 80, block: 0, gold: 99,
          energy: 3, maxEnergy: 3, strength: 0, dexterity: 0,
          effects: {}, relics: [STARTING_RELIC], deck,
        },
        map,
        floor: 0,
      }
    }

    case 'SELECT_NODE': {
      const { nodeId } = action.payload
      if (!state.map.availableNodeIds.includes(nodeId)) return state
      const node = state.map.nodes.find(n => n.id === nodeId)
      if (!node) return state
      const newMap = { ...state.map, currentNodeId: nodeId }
      const floor = state.floor + 1

      if (node.type === 'BATTLE' || node.type === 'ELITE' || node.type === 'BOSS') {
        const combatType = node.type === 'BOSS' ? 'BOSS' : node.type === 'ELITE' ? 'ELITE' : 'NORMAL'
        const enemyIds = node.enemyIds || ENCOUNTER_TABLE[combatType][0]
        const result = BS.initBattle(state.player, enemyIds, combatType)
        // COMBAT_START: ANCHOR block, BAG_OF_MARBLES vuln, BAG_OF_PREPARATION draw, etc.
        const afterTriggers = applyTriggers('COMBAT_START', result)
        return { ...state, screen: 'BATTLE', map: newMap, player: afterTriggers.player, battle: afterTriggers.battle, floor, currentNodeType: node.type }
      }
      if (node.type === 'REST') {
        return { ...state, screen: 'REST', map: newMap, floor, currentNodeType: 'REST' }
      }
      if (node.type === 'SHOP') {
        const shop = generateShop(state.player.deck, state.player.relics)
        return { ...state, screen: 'SHOP', map: newMap, shop, floor, currentNodeType: 'SHOP' }
      }
      if (node.type === 'EVENT') {
        const eventId = node.eventId || Object.keys(EVENT_DATA)[Math.floor(Math.random() * Object.keys(EVENT_DATA).length)]
        const eventData = EVENT_DATA[eventId] || EVENT_DATA['DEAD_ADVENTURER']
        return { ...state, screen: 'EVENT', map: newMap, event: { ...eventData, result: null }, floor, currentNodeType: 'EVENT' }
      }
      if (node.type === 'TREASURE') {
        const tRelicId = COMMON_RELICS.filter(r => !state.player.relics.includes(r))
          [Math.floor(Math.random() * COMMON_RELICS.length)] || null
        const advMap = advanceMap(newMap, nodeId)
        let s = { ...state, player: { ...state.player, gold: state.player.gold + 25 + Math.floor(Math.random() * 26) } }
        if (tRelicId) s = applyOnObtain(tRelicId, s)
        return { ...s, screen: 'MAP', map: advMap, floor }
      }
      return state
    }

    case 'SELECT_CARD': {
      if (!state.battle || state.battle.turn !== 'PLAYER') return state
      const { cardInstanceId } = action.payload
      if (state.battle.selectedCardId === cardInstanceId) {
        return { ...state, battle: { ...state.battle, selectedCardId: null } }
      }
      const card = state.battle.hand.find(c => c.instanceId === cardInstanceId)
      if (!card || card.cost > state.battle.energy) return state

      if (card.target !== 'ENEMY') {
        const result = BS.resolveCardEffect(state, cardInstanceId, 0)
        const end = BS.checkBattleEnd(result.battle)
        if (end === 'VICTORY') return handleVictory(result)
        if (result.player.hp <= 0) return { ...result, screen: 'GAME_OVER', battle: null }
        return { ...result, battle: { ...result.battle, selectedCardId: null } }
      }
      return { ...state, battle: { ...state.battle, selectedCardId: cardInstanceId } }
    }

    case 'DESELECT_CARD': {
      if (!state.battle) return state
      return { ...state, battle: { ...state.battle, selectedCardId: null } }
    }

    case 'PLAY_CARD': {
      if (!state.battle || state.battle.turn !== 'PLAYER') return state
      const { targetIndex } = action.payload
      const cardId = state.battle.selectedCardId
      if (!cardId) return state
      const card = state.battle.hand.find(c => c.instanceId === cardId)
      if (!card || card.cost > state.battle.energy) return state
      const result = BS.resolveCardEffect(state, cardId, targetIndex)
      const end = BS.checkBattleEnd(result.battle)
      if (end === 'VICTORY') return handleVictory(result)
      if (result.player.hp <= 0) return { ...result, screen: 'GAME_OVER', battle: null }
      return { ...result, battle: { ...result.battle, selectedCardId: null } }
    }

    case 'END_PLAYER_TURN': {
      if (!state.battle || state.battle.turn !== 'PLAYER') return state
      return BS.endPlayerTurn(state)
    }

    case 'ENEMY_TURN': {
      if (!state.battle || state.battle.turn !== 'ENEMY') return state
      const afterEnemy = BS.resolveEnemyTurn(state)
      if (afterEnemy.player.hp <= 0) return { ...afterEnemy, screen: 'GAME_OVER', battle: null }
      const afterStart = BS.startPlayerTurn(afterEnemy)
      // TURN_START: ART_OF_WAR (energy if no attack last turn), HAPPY_FLOWER (every 3 turns), etc.
      return applyTriggers('TURN_START', afterStart)
    }

    case 'CHOOSE_CARD_REWARD': {
      const { cardData } = action.payload
      let newDeck = [...state.player.deck]
      if (cardData) newDeck = [...newDeck, BS.createCardInstance(cardData)]

      const noGoldGain = state.player.relics.some(id => RELIC_DATA[id]?.passive?.noGoldGain)
      const goldAmt = noGoldGain ? 0 : (state.reward?.gold || 0)
      let s = { ...state, player: { ...state.player, deck: newDeck, gold: state.player.gold + goldAmt } }

      // Add elite relic via onObtain (fires OBTAIN triggers, singleton-safe)
      if (state.reward?.relicId) {
        s = applyOnObtain(state.reward.relicId, s)
      }

      // Boss reward → go to victory screen
      if (state.reward?.combatType === 'BOSS') {
        return { ...s, screen: 'VICTORY', reward: null }
      }

      const advMap = advanceMap(state.map, state.map.currentNodeId)
      return { ...s, screen: 'MAP', map: advMap, reward: null }
    }

    case 'CHOOSE_BOSS_RELIC': {
      const { relicId: chosenId } = action.payload
      let s = applyOnObtain(chosenId, state)
      return { ...s, screen: 'VICTORY', reward: null }
    }

    case 'BUY_ITEM': {
      const { itemType, index } = action.payload
      if (itemType === 'card') {
        const item = state.shop.cards[index]
        if (!item || item.sold || state.player.gold < item.price) return state
        const newDeck = [...state.player.deck, BS.createCardInstance(item.cardData)]
        const newCards = state.shop.cards.map((c, i) => i === index ? { ...c, sold: true } : c)
        return { ...state, player: { ...state.player, gold: state.player.gold - item.price, deck: newDeck }, shop: { ...state.shop, cards: newCards } }
      }
      if (itemType === 'relic') {
        const item = state.shop.relics[index]
        if (!item || item.sold || state.player.gold < item.price) return state
        if (state.player.relics.includes(item.relicData.id)) return state
        const newRelicItems = state.shop.relics.map((r, i) => i === index ? { ...r, sold: true } : r)
        let s = { ...state, player: { ...state.player, gold: state.player.gold - item.price }, shop: { ...state.shop, relics: newRelicItems } }
        s = applyOnObtain(item.relicData.id, s)
        return s
      }
      return state
    }

    case 'REMOVE_CARD_FROM_DECK': {
      const { cardInstanceId } = action.payload
      if (!state.shop || state.player.gold < state.shop.removePrice) return state
      const newDeck = state.player.deck.filter(c => c.instanceId !== cardInstanceId)
      return { ...state, player: { ...state.player, gold: state.player.gold - state.shop.removePrice, deck: newDeck } }
    }

    case 'LEAVE_SHOP': {
      const advMap = advanceMap(state.map, state.map.currentNodeId)
      return { ...state, screen: 'MAP', map: advMap, shop: null }
    }

    case 'REST_ACTION': {
      const { action: restAction, cardInstanceId } = action.payload
      if (restAction === 'heal') {
        const healAmt = Math.ceil(state.player.maxHp * 0.3)
        const newHp = Math.min(state.player.maxHp, state.player.hp + healAmt)
        const advMap = advanceMap(state.map, state.map.currentNodeId)
        let restState = { ...state, player: { ...state.player, hp: newHp } }
        restState = applyTriggers('REST', restState)
        return { ...restState, screen: 'MAP', map: advMap }
      }
      if (restAction === 'smith' && cardInstanceId) {
        const newDeck = state.player.deck.map(c => {
          if (c.instanceId === cardInstanceId && c.upgradeId && CARD_DATA[c.upgradeId]) {
            return { ...CARD_DATA[c.upgradeId], instanceId: c.instanceId }
          }
          return c
        })
        const advMap = advanceMap(state.map, state.map.currentNodeId)
        return { ...state, screen: 'MAP', map: advMap, player: { ...state.player, deck: newDeck } }
      }
      return state
    }

    case 'LEAVE_REST': {
      const advMap = advanceMap(state.map, state.map.currentNodeId)
      return { ...state, screen: 'MAP', map: advMap }
    }

    case 'CHOOSE_EVENT': {
      const { choiceIndex } = action.payload
      const choice = state.event.choices[choiceIndex]
      if (!choice) return state
      let newPlayer = { ...state.player }
      let result = ''
      let pendingRelicId = null

      switch (choice.effect) {
        case 'ADD_GOLD_30':
          newPlayer.gold += 30
          result = '获得了 30 金币！'
          break
        case 'ADD_GOLD_35':
          newPlayer.gold += 35
          result = '获得了 35 金币！'
          break
        case 'ADD_GOLD_75':
          newPlayer.gold += 75
          result = '获得了 75 金币！'
          break
        case 'ADD_GOLD_100':
          newPlayer.gold += 100
          result = '获得了 100 金币！'
          break
        case 'ADD_GOLD_135_LOSE_HP':
          newPlayer.gold += 135
          newPlayer.hp = Math.max(1, newPlayer.hp - 14)
          result = '你深入花朵，获得了 135 金币，但失去了 14 点生命！'
          break
        case 'GAIN_GOLD_LOSE_HP_8': {
          const gainedGold = 61 + Math.floor(Math.random() * 39)
          newPlayer.gold += gainedGold
          newPlayer.hp = Math.max(1, newPlayer.hp - 8)
          result = `艰难跋涉，获得了 ${gainedGold} 金币，失去了 8 点生命！`
          break
        }
        case 'RANDOM_RELIC': {
          const avail = COMMON_RELICS.filter(r => !newPlayer.relics.includes(r))
          if (avail.length > 0) {
            pendingRelicId = avail[Math.floor(Math.random() * avail.length)]
            result = `获得了遗物：${RELIC_DATA[pendingRelicId].name}！`
          } else {
            result = '没有可获得的遗物。'
          }
          break
        }
        case 'FULL_HEAL':
          newPlayer.hp = newPlayer.maxHp
          result = '生命值完全恢复！'
          break
        case 'HEAL_10':
          newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + 10)
          result = '恢复了 10 点生命值！'
          break
        case 'HEAL_30PCT': {
          const pctHeal = Math.ceil(newPlayer.maxHp * 0.3)
          newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + pctHeal)
          result = `恢复了 ${pctHeal} 点生命值！`
          break
        }
        case 'ADD_MAX_HP_7':
          newPlayer.maxHp += 7
          newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + 7)
          result = '最大生命值增加了 7！'
          break
        case 'ADD_MAX_HP_2_LOSE_HP_3':
          newPlayer.maxHp += 2
          newPlayer.hp = Math.max(1, Math.min(newPlayer.maxHp, newPlayer.hp + 2) - 3)
          result = '最大生命值增加了 2，但失去了 3 点生命！'
          break
        case 'LOSE_HP_5':
          newPlayer.hp = Math.max(1, newPlayer.hp - 5)
          result = '猛力扯掉水蛭，失去了 5 点生命！'
          break
        case 'UPGRADE_CARD': {
          const upgradable = newPlayer.deck.filter(c => !c.upgraded && c.upgradeId)
          if (upgradable.length > 0) {
            const target = upgradable[Math.floor(Math.random() * upgradable.length)]
            newPlayer.deck = newPlayer.deck.map(c =>
              c.instanceId === target.instanceId && CARD_DATA[c.upgradeId]
                ? { ...CARD_DATA[c.upgradeId], instanceId: c.instanceId }
                : c
            )
            result = `升级了 ${target.name}！`
          } else {
            result = '没有可升级的牌。'
          }
          break
        }
        case 'UPGRADE_TWO_CARDS': {
          const upgradable2 = newPlayer.deck.filter(c => !c.upgraded && c.upgradeId && CARD_DATA[c.upgradeId])
          const toUpgrade = BS.shuffleArray([...upgradable2]).slice(0, 2)
          if (toUpgrade.length > 0) {
            const upgradeSet = new Set(toUpgrade.map(c => c.instanceId))
            newPlayer.deck = newPlayer.deck.map(c =>
              upgradeSet.has(c.instanceId) && CARD_DATA[c.upgradeId]
                ? { ...CARD_DATA[c.upgradeId], instanceId: c.instanceId }
                : c
            )
            result = `随机升级了 ${toUpgrade.length} 张牌！`
          } else {
            result = '没有可升级的牌。'
          }
          break
        }
        case 'TRANSFORM_CARD': {
          const transformable = newPlayer.deck.filter(c => c.rarity !== 'BASIC' && c.rarity !== 'STATUS' && !c.upgraded)
          if (transformable.length > 0) {
            const target = transformable[Math.floor(Math.random() * transformable.length)]
            const sameRarity = Object.values(CARD_DATA).filter(c =>
              c.rarity === target.rarity && !c.upgraded && c.id !== target.id
            )
            if (sameRarity.length > 0) {
              const newCard = sameRarity[Math.floor(Math.random() * sameRarity.length)]
              newPlayer.deck = newPlayer.deck.map(c =>
                c.instanceId === target.instanceId
                  ? { ...newCard, instanceId: c.instanceId }
                  : c
              )
              result = `将 ${target.name} 变形为了 ${newCard.name}！`
            } else {
              result = '没有找到可变形的同稀有度牌。'
            }
          } else {
            result = '没有可变形的非基础牌。'
          }
          break
        }
        case 'ADD_RANDOM_CARD': {
          const cardPool = Object.values(CARD_DATA).filter(c =>
            c.rarity !== 'BASIC' && c.rarity !== 'STATUS' && !c.upgraded
          )
          if (cardPool.length > 0) {
            const picked = cardPool[Math.floor(Math.random() * cardPool.length)]
            newPlayer.deck = [...newPlayer.deck, BS.createCardInstance(picked)]
            result = `获得了卡牌：${picked.name}！`
          } else {
            result = '没有可获得的牌。'
          }
          break
        }
        case 'COMBINE_STRIKES': {
          const strikes = newPlayer.deck.filter(c => c.id === 'STRIKE_R')
          if (strikes.length >= 2) {
            let removed = 0
            newPlayer.deck = newPlayer.deck.filter(c => {
              if (c.id === 'STRIKE_R' && removed < 2) { removed++; return false }
              return true
            })
            const upgradable3 = newPlayer.deck.filter(c => !c.upgraded && c.upgradeId && CARD_DATA[c.upgradeId])
            if (upgradable3.length > 0) {
              const target = upgradable3[Math.floor(Math.random() * upgradable3.length)]
              newPlayer.deck = newPlayer.deck.map(c =>
                c.instanceId === target.instanceId
                  ? { ...CARD_DATA[c.upgradeId], instanceId: c.instanceId }
                  : c
              )
              result = `移除了 2 张打击，升级了 ${target.name}！`
            } else {
              result = '移除了 2 张打击！'
            }
          } else {
            result = '牌组中打击牌不足，无法合并。'
          }
          break
        }
        case 'COMBINE_DEFENDS': {
          const defends = newPlayer.deck.filter(c => c.id === 'DEFEND_R')
          if (defends.length >= 2) {
            let removed = 0
            newPlayer.deck = newPlayer.deck.filter(c => {
              if (c.id === 'DEFEND_R' && removed < 2) { removed++; return false }
              return true
            })
            const upgradable4 = newPlayer.deck.filter(c => !c.upgraded && c.upgradeId && CARD_DATA[c.upgradeId])
            if (upgradable4.length > 0) {
              const target = upgradable4[Math.floor(Math.random() * upgradable4.length)]
              newPlayer.deck = newPlayer.deck.map(c =>
                c.instanceId === target.instanceId
                  ? { ...CARD_DATA[c.upgradeId], instanceId: c.instanceId }
                  : c
              )
              result = `移除了 2 张防御，升级了 ${target.name}！`
            } else {
              result = '移除了 2 张防御！'
            }
          } else {
            result = '牌组中防御牌不足，无法合并。'
          }
          break
        }
        case 'ADD_STRENGTH_1':
          newPlayer.strength = (newPlayer.strength || 0) + 1
          result = '获得了 1 点永久力量！'
          break
        case 'GAMBLE_50':
          if (newPlayer.gold >= 50) {
            if (Math.random() > 0.5) {
              newPlayer.gold += 100
              result = '赌赢了！获得 100 金币！'
            } else {
              newPlayer.gold -= 50
              result = '赌输了，失去 50 金币...'
            }
          } else {
            result = '金币不足，无法参与赌注。'
          }
          break
        case 'NOTHING':
          result = '你选择离开，什么也没发生。'
          break
        default:
          result = '事件结束。'
      }

      let eventState = { ...state, player: newPlayer, event: { ...state.event, result } }
      if (pendingRelicId) eventState = applyOnObtain(pendingRelicId, eventState)
      return eventState
    }

    case 'LEAVE_EVENT': {
      const advMap = advanceMap(state.map, state.map.currentNodeId)
      return { ...state, screen: 'MAP', map: advMap, event: null }
    }

    default:
      return state
  }
}

function handleVictory(state) {
  const combatType = state.battle.combatType
  // COMBAT_END: BURNING_BLOOD (+6 hp), BLACK_BLOOD (+12 hp), etc.
  const afterEnd = applyTriggers('COMBAT_END', state)
  const { nextRarePityOffset, ...rewardFields } = generateReward(afterEnd, combatType)
  return {
    ...afterEnd,
    screen: 'BATTLE_REWARD',
    battle: null,
    reward: rewardFields,
    rarePityOffset: nextRarePityOffset,
  }
}
