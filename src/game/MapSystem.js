import { ENCOUNTER_TABLE } from '../data/monsters.js'
import { NODE_TYPES } from '../types/index.js'
import { EVENT_DATA } from '../data/events.js'

const EVENT_IDS = Object.keys(EVENT_DATA)

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// STS2 map constants
const BOSS_COL = 11
const ANCHOR_COLS = [0, 4, 8, 11]
const ANCHOR_COL_SET = new Set(ANCHOR_COLS)
const ANCHOR_TYPES = {
  0: NODE_TYPES.BATTLE,
  4: NODE_TYPES.ELITE,
  8: NODE_TYPES.SHOP,
  11: NODE_TYPES.BOSS,
}

export const MAP_WIDTH = 1580
export const MAP_HEIGHT = 700
const COL_SPACING = 132
const X_OFFSET = 50

// STS2 节点类型概率按层段分布
// col 1-3 (Overgrowth早期): 战斗多、事件少
// col 5-7 (Underdocks中期): 均衡、事件增加
// col 9-10 (Underdocks后期): 精英多、事件最多
function pickNodeType(col) {
  if (ANCHOR_COL_SET.has(col)) return ANCHOR_TYPES[col]
  const roll = Math.random()
  if (col <= 3) {
    // 早期: Battle 45% | Elite 12% | Rest 13% | Shop 6% | Event 18% | Treasure 6%
    if (roll < 0.45) return NODE_TYPES.BATTLE
    if (roll < 0.57) return NODE_TYPES.ELITE
    if (roll < 0.70) return NODE_TYPES.REST
    if (roll < 0.76) return NODE_TYPES.SHOP
    if (roll < 0.94) return NODE_TYPES.EVENT
    return NODE_TYPES.TREASURE
  } else if (col <= 7) {
    // 中期: Battle 35% | Elite 16% | Rest 12% | Shop 8% | Event 23% | Treasure 6%
    if (roll < 0.35) return NODE_TYPES.BATTLE
    if (roll < 0.51) return NODE_TYPES.ELITE
    if (roll < 0.63) return NODE_TYPES.REST
    if (roll < 0.71) return NODE_TYPES.SHOP
    if (roll < 0.94) return NODE_TYPES.EVENT
    return NODE_TYPES.TREASURE
  } else {
    // 后期 (col 9-10): Battle 28% | Elite 22% | Rest 14% | Shop 5% | Event 26% | Treasure 5%
    if (roll < 0.28) return NODE_TYPES.BATTLE
    if (roll < 0.50) return NODE_TYPES.ELITE
    if (roll < 0.64) return NODE_TYPES.REST
    if (roll < 0.69) return NODE_TYPES.SHOP
    if (roll < 0.95) return NODE_TYPES.EVENT
    return NODE_TYPES.TREASURE
  }
}

// 按层段（col）选取对应区域的遭遇池
function getEnemyIdsForNode(type, col) {
  if (type === NODE_TYPES.BATTLE) {
    if (col <= 3) return pickRandom(ENCOUNTER_TABLE.NORMAL_EARLY)
    if (col <= 7) return pickRandom(ENCOUNTER_TABLE.NORMAL_MID)
    return pickRandom(ENCOUNTER_TABLE.NORMAL_LATE)
  }
  if (type === NODE_TYPES.ELITE) {
    // col 4 是 Overgrowth 精英锚点，col 5+ 用 Underdocks 精英
    if (col <= 4) return pickRandom(ENCOUNTER_TABLE.ELITE_EARLY)
    return pickRandom(ENCOUNTER_TABLE.ELITE_LATE)
  }
  if (type === NODE_TYPES.BOSS) return pickRandom(ENCOUNTER_TABLE.BOSS)
  return undefined
}

export function generateMap(act = 1) {
  const nodes = []
  const paths = []
  const colNodes = []

  // Step 1: Generate nodes for each column
  for (let col = 0; col <= BOSS_COL; col++) {
    const isAnchor = ANCHOR_COL_SET.has(col)
    const rowCount = isAnchor ? 1 : 2 + Math.floor(Math.random() * 3) // 2–4

    const colArr = []
    for (let row = 0; row < rowCount; row++) {
      const type = pickNodeType(col)
      const id = `n_${col}_${row}`
      const xJitter = isAnchor ? 0 : Math.round((Math.random() - 0.5) * 14)
      const x = col * COL_SPACING + X_OFFSET + xJitter

      const usableH = MAP_HEIGHT - 130
      const yJitter = rowCount === 1 ? 0 : Math.round((Math.random() - 0.5) * 14)
      const y = rowCount === 1
        ? Math.round(MAP_HEIGHT / 2 - 26)
        : Math.round(65 + (row / (rowCount - 1)) * usableH + yJitter)

      nodes.push({
        id, type, col, row,
        x: Math.round(x), y,
        isAnchor,
        visited: false,
        available: col === 0,
        enemyIds: getEnemyIdsForNode(type, col),
        eventId: type === NODE_TYPES.EVENT ? pickRandom(EVENT_IDS) : undefined,
      })
      colArr.push(id)
    }
    colNodes.push(colArr)
  }

  // Step 2: Connect nodes with distance-based rules
  const pathSet = new Set()
  function addPath(from, to) {
    const key = `${from}->${to}`
    if (pathSet.has(key)) return
    pathSet.add(key)
    paths.push({ from, to })
  }

  for (let col = 0; col < BOSS_COL; col++) {
    const fromCol = colNodes[col]
    const toCol = colNodes[col + 1]

    // Primary: proportional mapping from source row to dest row
    fromCol.forEach((fromId, fi) => {
      const ratio = fromCol.length === 1 ? 0.5 : fi / (fromCol.length - 1)
      const toIndex = Math.round(ratio * (toCol.length - 1))
      addPath(fromId, toCol[toIndex])

      // Secondary branch: adjacent dest node (55% chance)
      if (Math.random() < 0.55 && toCol.length > 1) {
        const goUp = toIndex > 0 && (toIndex === toCol.length - 1 || Math.random() < 0.5)
        const altIndex = goUp ? toIndex - 1 : Math.min(toIndex + 1, toCol.length - 1)
        addPath(fromId, toCol[altIndex])
      }
    })

    // Ensure every dest node has at least one incoming connection
    toCol.forEach(toId => {
      if (!paths.some(p => p.to === toId)) {
        addPath(pickRandom(fromCol), toId)
      }
    })

    // Skip connection to col+2 (20% chance), only when neither col+1 nor col+2 is an anchor.
    // Prevents skipping over mandatory nodes (elite at 4, shop at 8, boss at 11).
    if (col + 2 <= BOSS_COL && !ANCHOR_COL_SET.has(col + 1) && !ANCHOR_COL_SET.has(col + 2)) {
      fromCol.forEach(fromId => {
        if (Math.random() < 0.20) {
          addPath(fromId, pickRandom(colNodes[col + 2]))
        }
      })
    }
  }

  return {
    nodes,
    paths,
    currentNodeId: null,
    availableNodeIds: colNodes[0],
    anchorCols: ANCHOR_COLS,
    mapWidth: MAP_WIDTH,
    mapHeight: MAP_HEIGHT,
  }
}

export function advanceMap(map, visitedNodeId) {
  if (!visitedNodeId) return map
  const newNodes = map.nodes.map(n =>
    n.id === visitedNodeId ? { ...n, visited: true } : n
  )
  const nextIds = map.paths.filter(p => p.from === visitedNodeId).map(p => p.to)
  const updatedNodes = newNodes.map(n =>
    nextIds.includes(n.id) ? { ...n, available: true } : n
  )
  return {
    ...map,
    nodes: updatedNodes,
    currentNodeId: visitedNodeId,
    availableNodeIds: nextIds,
  }
}
