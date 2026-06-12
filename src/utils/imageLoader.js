const CARD_FILENAMES = {
  STRIKE_R: 'strike_ironclad', STRIKE_R_PLUS: 'strike_ironclad',
  DEFEND_R: 'defend_ironclad', DEFEND_R_PLUS: 'defend_ironclad',
  BASH: 'bash', BASH_PLUS: 'bash',
  ANGER: 'anger', ANGER_PLUS: 'anger',
  CLEAVE: 'thunderclap', CLEAVE_PLUS: 'thunderclap',
  ARMAMENTS: 'armaments', ARMAMENTS_PLUS: 'armaments',
  POMMEL_STRIKE: 'pommel_strike', POMMEL_STRIKE_PLUS: 'pommel_strike',
  SHRUG_IT_OFF: 'shrug_it_off', SHRUG_IT_OFF_PLUS: 'shrug_it_off',
  FLEX: 'lift', FLEX_PLUS: 'lift',
  INFLAME: 'inflame', INFLAME_PLUS: 'inflame',
  BURN: 'burn',
}

const NODE_FILENAMES = {
  BATTLE: 'map_monster', ELITE: 'map_elite', REST: 'map_rest',
  SHOP: 'map_shop', EVENT: 'map_unknown', TREASURE: 'map_chest', BOSS: 'map_chest_boss',
}

export function getCardImage(cardId) {
  const filename = CARD_FILENAMES[cardId] || 'beta'
  return `/assets/cards/${filename}.png`
}

export function getMonsterImage(monsterId) {
  const imageMap = {
    CULTIST: 'cultists', JAWWORM: 'mawler', RED_LOUSE: 'chomper',
    GREMLIN_NOB: 'fat_gremlin', CEREMONIAL_BEAST: 'ceremonial_beast_boss',
  }
  const name = imageMap[monsterId] || monsterId.toLowerCase()
  return `/assets/renders/${name}.png`
}

export function getIntentImage(intentType) {
  if (!intentType) return '/assets/intents/unknown.png'
  const t = intentType.toLowerCase()
  if (t === 'sleep') return '/assets/intents/sleep.png'
  return `/assets/intents/${t}.png`
}

export function getNodeImage(nodeType) {
  const filename = NODE_FILENAMES[nodeType] || 'map_unknown'
  return `/assets/ui-map-nodes/${filename}.png`
}

export function getRelicImage(relicId) {
  if (!relicId) return '/assets/relics/burning_blood.png'
  return `/assets/relics/${relicId.toLowerCase()}.png`
}
