import { ENCOUNTER_TABLE } from '../data/monsters.js'
import { NODE_TYPES } from '../types/index.js'

const EVENT_IDS = ['DEAD_ADVENTURER', 'ANCIENT_WRITING', 'LIARS_GAME']

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

function pickNodeType(col) {
  if (ANCHOR_COL_SET.has(col)) return ANCHOR_TYPES[col]
  const roll = Math.random()
  if (roll < 0.42) return NODE_TYPES.BATTLE
  if (roll < 0.58) return NODE_TYPES.ELITE
  if (roll < 0.70) return NODE_TYPES.REST
  if (roll < 0.80) return NODE_TYPES.SHOP
  if (roll < 0.92) return NODE_TYPES.EVENT
  return NODE_TYPES.TREASURE
}

function getEnemyIdsForNode(type) {
  if (type === NODE_TYPES.BATTLE) return pickRandom(ENCOUNTER_TABLE.NORMAL)
  if (type === NODE_TYPES.ELITE) return ENCOUNTER_TABLE.ELITE[0]
  if (type === NODE_TYPES.BOSS) return ENCOUNTER_TABLE.BOSS[0]
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
        enemyIds: getEnemyIdsForNode(type),
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
