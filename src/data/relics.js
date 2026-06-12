// pool: STARTER | COMMON | UNCOMMON | RARE | BOSS | SHOP | EVENT
// class: ALL | IRONCLAD
// triggers[].when: OBTAIN | COMBAT_START | COMBAT_END | TURN_START | TURN_END | REST | EXHAUST | CARD_PLAY | ON_DAMAGE_TAKEN
// passive: flags consumed directly in BattleSystem / GameState

export const RELIC_DATA = {

  // ── STARTER ────────────────────────────────────────────────────────────
  BURNING_BLOOD: {
    id: 'BURNING_BLOOD', name: '燃烧之血', rarity: 'STARTER', pool: 'STARTER', class: 'IRONCLAD',
    description: '战斗结束后，恢复 6 点生命值。',
    image: '/assets/relics/burning_blood.png',
    triggers: [{ when: 'COMBAT_END', effect: 'HEAL', amount: 6 }],
  },

  // ── COMMON ────────────────────────────────────────────────────────────
  AKABEKO: {
    id: 'AKABEKO', name: '赤牛', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '本次战斗第一张攻击牌额外造成 8 点伤害。',
    image: '/assets/relics/akabeko.png',
    triggers: [{ when: 'FIRST_ATTACK', effect: 'BONUS_DAMAGE', amount: 8 }],
  },
  ANCHOR: {
    id: 'ANCHOR', name: '船锚', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '每场战斗开始时获得 10 点格挡。',
    image: '/assets/relics/anchor.png',
    triggers: [{ when: 'COMBAT_START', effect: 'BLOCK', amount: 10 }],
  },
  BAG_OF_MARBLES: {
    id: 'BAG_OF_MARBLES', name: '弹珠袋', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '战斗开始时对所有敌人施加 1 层易伤。',
    image: '/assets/relics/bag_of_marbles.png',
    triggers: [{ when: 'COMBAT_START', effect: 'VULNERABLE_ALL', amount: 1 }],
  },
  BAG_OF_PREPARATION: {
    id: 'BAG_OF_PREPARATION', name: '准备袋', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '战斗开始时额外摸 2 张牌。',
    image: '/assets/relics/bag_of_preparation.png',
    triggers: [{ when: 'COMBAT_START', effect: 'DRAW', amount: 2 }],
  },
  VAJRA: {
    id: 'VAJRA', name: '金刚杵', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '每场战斗开始时，获得 1 点力量。',
    image: '/assets/relics/vajra.png',
    triggers: [{ when: 'COMBAT_START', effect: 'STRENGTH', amount: 1 }],
  },
  BLOOD_VIAL: {
    id: 'BLOOD_VIAL', name: '小血瓶', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '每场战斗开始时，回复 2 点生命。',
    image: '/assets/relics/blood_vial.png',
    triggers: [{ when: 'COMBAT_START', effect: 'HEAL', amount: 2 }],
  },
  STRAWBERRY: {
    id: 'STRAWBERRY', name: '草莓', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '拾起时，将最大生命值提升 7。',
    image: '/assets/relics/strawberry.png',
    triggers: [{ when: 'OBTAIN', effect: 'MAX_HP', amount: 7 }],
  },
  RED_MASK: {
    id: 'RED_MASK', name: '红面具', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '每场战斗开始时，对所有敌人施加 1 层虚弱。',
    image: '/assets/relics/red_mask.png',
    triggers: [{ when: 'COMBAT_START', effect: 'WEAK_ALL', amount: 1 }],
  },
  RED_SKULL: {
    id: 'RED_SKULL', name: '红头骨', rarity: 'COMMON', pool: 'COMMON', class: 'IRONCLAD',
    description: '当生命值低于等于 50% 时，战斗开始额外获得 3 点力量。',
    image: '/assets/relics/red_skull.png',
    triggers: [{ when: 'COMBAT_START', effect: 'STRENGTH', amount: 3, condition: 'HP_BELOW_HALF' }],
  },
  WAR_PAINT: {
    id: 'WAR_PAINT', name: '战纹涂料', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '拾起时，随机升级 2 张技能牌。',
    image: '/assets/relics/war_paint.png',
    triggers: [{ when: 'OBTAIN', effect: 'UPGRADE_SKILLS', count: 2 }],
  },
  WHETSTONE: {
    id: 'WHETSTONE', name: '磨刀石', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '拾起时，随机升级 2 张攻击牌。',
    image: '/assets/relics/whetstone.png',
    triggers: [{ when: 'OBTAIN', effect: 'UPGRADE_ATTACKS', count: 2 }],
  },
  HAPPY_FLOWER: {
    id: 'HAPPY_FLOWER', name: '开心小花', rarity: 'COMMON', pool: 'COMMON', class: 'ALL',
    description: '每 3 个回合，获得 1 点能量。',
    image: '/assets/relics/happy_flower.png',
    triggers: [{ when: 'TURN_START', effect: 'ENERGY', amount: 1, everyN: 3, counter: 'HAPPY_FLOWER' }],
  },

  // ── UNCOMMON ──────────────────────────────────────────────────────────
  ART_OF_WAR: {
    id: 'ART_OF_WAR', name: '孙子兵法', rarity: 'UNCOMMON', pool: 'UNCOMMON', class: 'ALL',
    description: '如果上一回合没有打出攻击牌，本回合开始时获得 1 点能量。',
    image: '/assets/relics/art_of_war.png',
    triggers: [{ when: 'TURN_START', effect: 'ENERGY', amount: 1, condition: 'NO_ATTACK_LAST_TURN' }],
  },
  ORICHALCUM: {
    id: 'ORICHALCUM', name: '奥利哈钢', rarity: 'UNCOMMON', pool: 'UNCOMMON', class: 'ALL',
    description: '如果回合结束时没有任何格挡，获得 6 点格挡。',
    image: '/assets/relics/orichalcum.png',
    triggers: [{ when: 'TURN_END', effect: 'BLOCK', amount: 6, condition: 'NO_BLOCK' }],
  },
  MERCURY_HOURGLASS: {
    id: 'MERCURY_HOURGLASS', name: '水银沙漏', rarity: 'UNCOMMON', pool: 'UNCOMMON', class: 'ALL',
    description: '每回合开始时，对所有敌人造成 3 点伤害。',
    image: '/assets/relics/mercury_hourglass.png',
    triggers: [{ when: 'TURN_START', effect: 'DAMAGE_ALL', amount: 3 }],
  },
  PEAR: {
    id: 'PEAR', name: '梨子', rarity: 'UNCOMMON', pool: 'UNCOMMON', class: 'ALL',
    description: '拾起时，将最大生命值提升 10。',
    image: '/assets/relics/pear.png',
    triggers: [{ when: 'OBTAIN', effect: 'MAX_HP', amount: 10 }],
  },
  HORN_CLEAT: {
    id: 'HORN_CLEAT', name: '船夹板', rarity: 'UNCOMMON', pool: 'UNCOMMON', class: 'ALL',
    description: '第二回合开始时，获得 14 点格挡。',
    image: '/assets/relics/horn_cleat.png',
    triggers: [{ when: 'TURN_START', effect: 'BLOCK', amount: 14, onTurn: 2 }],
  },
  NUNCHAKU: {
    id: 'NUNCHAKU', name: '双截棍', rarity: 'UNCOMMON', pool: 'UNCOMMON', class: 'ALL',
    description: '每打出 10 张攻击牌，获得 1 点能量。',
    image: '/assets/relics/nunchaku.png',
    triggers: [{ when: 'CARD_PLAY', effect: 'ENERGY', amount: 1, everyN: 10, counter: 'NUNCHAKU', cardType: 'ATTACK' }],
  },
  PAPER_PHROG: {
    id: 'PAPER_PHROG', name: '纸蛙', rarity: 'UNCOMMON', pool: 'UNCOMMON', class: 'IRONCLAD',
    description: '有易伤状态的敌人受到的伤害增加 75% 而非 50%。',
    image: '/assets/relics/paper_phrog.png',
    passive: { vulnerableMultiplier: 1.75 },
  },
  SELF_FORMING_CLAY: {
    id: 'SELF_FORMING_CLAY', name: '自成型黏土', rarity: 'UNCOMMON', pool: 'UNCOMMON', class: 'IRONCLAD',
    description: '每当在战斗中失去生命，下回合开始时获得 3 点格挡。',
    image: '/assets/relics/self_forming_clay.png',
    triggers: [{ when: 'ON_DAMAGE_TAKEN', effect: 'PENDING_BLOCK', amount: 3 }],
  },
  ETERNAL_FEATHER: {
    id: 'ETERNAL_FEATHER', name: '永恒羽毛', rarity: 'UNCOMMON', pool: 'UNCOMMON', class: 'ALL',
    description: '进入休息处时，牌组每有 5 张牌就回复 3 点生命。',
    image: '/assets/relics/eternal_feather.png',
    triggers: [{ when: 'REST', effect: 'HEAL_PER_5_CARDS' }],
  },

  // ── RARE ──────────────────────────────────────────────────────────────
  ICE_CREAM: {
    id: 'ICE_CREAM', name: '冰淇淋', rarity: 'RARE', pool: 'RARE', class: 'ALL',
    description: '多余的能量可以留到下一回合。',
    image: '/assets/relics/ice_cream.png',
    passive: { iceCream: true },
  },
  MANGO: {
    id: 'MANGO', name: '芒果', rarity: 'RARE', pool: 'RARE', class: 'ALL',
    description: '拾起时，将最大生命值提升 14。',
    image: '/assets/relics/mango.png',
    triggers: [{ when: 'OBTAIN', effect: 'MAX_HP', amount: 14 }],
  },
  OLD_COIN: {
    id: 'OLD_COIN', name: '古钱币', rarity: 'RARE', pool: 'RARE', class: 'ALL',
    description: '拾起时，获得 300 金币。',
    image: '/assets/relics/old_coin.png',
    triggers: [{ when: 'OBTAIN', effect: 'GOLD', amount: 300 }],
  },
  LIZARD_TAIL: {
    id: 'LIZARD_TAIL', name: '蜥蜴尾巴', rarity: 'RARE', pool: 'RARE', class: 'ALL',
    description: '当生命值将降至 0 时，回复到最大生命值的 50%（仅一次）。',
    image: '/assets/relics/lizard_tail.png',
    passive: { lizardTail: true },
  },
  MEAT_ON_THE_BONE: {
    id: 'MEAT_ON_THE_BONE', name: '带骨肉', rarity: 'RARE', pool: 'RARE', class: 'ALL',
    description: '战斗结束时若生命值低于等于 50%，回复 12 点生命。',
    image: '/assets/relics/meat_on_the_bone.png',
    triggers: [{ when: 'COMBAT_END', effect: 'HEAL', amount: 12, condition: 'HP_BELOW_HALF' }],
  },
  TUNGSTEN_ROD: {
    id: 'TUNGSTEN_ROD', name: '钨合金棍', rarity: 'RARE', pool: 'RARE', class: 'ALL',
    description: '每次失去生命时，减少失去的生命值 1 点。',
    image: '/assets/relics/tungsten_rod.png',
    passive: { damageReduction: 1 },
  },
  CHARONS_ASHES: {
    id: 'CHARONS_ASHES', name: '卡戎之灰', rarity: 'RARE', pool: 'RARE', class: 'IRONCLAD',
    description: '每当消耗一张牌，对所有敌人造成 3 点伤害。',
    image: '/assets/relics/charons_ashes.png',
    triggers: [{ when: 'EXHAUST', effect: 'DAMAGE_ALL', amount: 3 }],
  },
  RUINED_HELMET: {
    id: 'RUINED_HELMET', name: '损毁头盔', rarity: 'RARE', pool: 'RARE', class: 'IRONCLAD',
    description: '战斗中第一次获得的力量值翻倍。',
    image: '/assets/relics/ruined_helmet.png',
    passive: { doubleFirstStrength: true },
  },

  // ── BOSS ──────────────────────────────────────────────────────────────
  BLACK_BLOOD: {
    id: 'BLACK_BLOOD', name: '黑暗之血', rarity: 'BOSS', pool: 'BOSS', class: 'IRONCLAD',
    description: '战斗结束后，恢复 12 点生命值。替换"燃烧之血"。',
    image: '/assets/relics/black_blood.png',
    triggers: [{ when: 'COMBAT_END', effect: 'HEAL', amount: 12 }],
    replacesRelic: 'BURNING_BLOOD',
  },
  PHILOSOPHERS_STONE: {
    id: 'PHILOSOPHERS_STONE', name: '哲学家之石', rarity: 'BOSS', pool: 'BOSS', class: 'ALL',
    description: '获得 1 点额外最大能量。每场战斗开始时，所有敌人获得 1 点力量。',
    image: '/assets/relics/philosophers_stone.png',
    triggers: [
      { when: 'OBTAIN', effect: 'ENERGY_MAX', amount: 1 },
      { when: 'COMBAT_START', effect: 'ENEMY_STRENGTH', amount: 1 },
    ],
  },
  VELVET_CHOKER: {
    id: 'VELVET_CHOKER', name: '丝绒颈套', rarity: 'BOSS', pool: 'BOSS', class: 'ALL',
    description: '获得 1 点额外最大能量。每回合最多打出 6 张牌。',
    image: '/assets/relics/velvet_choker.png',
    triggers: [{ when: 'OBTAIN', effect: 'ENERGY_MAX', amount: 1 }],
    passive: { maxCardsPerTurn: 6 },
  },
  SNECKO_EYE: {
    id: 'SNECKO_EYE', name: '蜗蛇之眼', rarity: 'BOSS', pool: 'BOSS', class: 'ALL',
    description: '每回合额外摸 2 张牌，手牌费用随机化（0-3）。',
    image: '/assets/relics/snecko_eye.png',
    passive: { sneckoEye: true },
  },
  RUNIC_PYRAMID: {
    id: 'RUNIC_PYRAMID', name: '符文金字塔', rarity: 'BOSS', pool: 'BOSS', class: 'ALL',
    description: '回合结束时不再弃置手牌。',
    image: '/assets/relics/runic_pyramid.png',
    passive: { retainHand: true },
  },
  ECTOPLASM: {
    id: 'ECTOPLASM', name: '灵质', rarity: 'BOSS', pool: 'BOSS', class: 'ALL',
    description: '获得 1 点额外最大能量。你无法再获得金币。',
    image: '/assets/relics/ectoplasm.png',
    triggers: [{ when: 'OBTAIN', effect: 'ENERGY_MAX', amount: 1 }],
    passive: { noGoldGain: true },
  },
}

export const STARTING_RELIC = 'BURNING_BLOOD'

// Build pools by filtering pool tag + class (ALL or IRONCLAD)
function makePool(poolTag) {
  return Object.values(RELIC_DATA)
    .filter(r => r.pool === poolTag && (r.class === 'ALL' || r.class === 'IRONCLAD'))
    .map(r => r.id)
}
export const COMMON_RELICS   = makePool('COMMON')
export const UNCOMMON_RELICS = makePool('UNCOMMON')
export const RARE_RELICS     = makePool('RARE')
export const BOSS_RELICS     = makePool('BOSS')
