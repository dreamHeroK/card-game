export const CARD_DATA = {
  // ── BASIC ───────────────────────────────────────────────────────────────
  STRIKE_R: {
    id: 'STRIKE_R', name: '打击', cost: 1, type: 'ATTACK', rarity: 'BASIC',
    target: 'ENEMY', damage: 6, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/strike_ironclad.png', description: '造成 6 点伤害。', upgradeId: 'STRIKE_R_PLUS',
  },
  STRIKE_R_PLUS: {
    id: 'STRIKE_R_PLUS', name: '打击+', cost: 1, type: 'ATTACK', rarity: 'BASIC',
    target: 'ENEMY', damage: 9, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/strike_ironclad.png', description: '造成 9 点伤害。',
  },
  DEFEND_R: {
    id: 'DEFEND_R', name: '防御', cost: 1, type: 'SKILL', rarity: 'BASIC',
    target: 'SELF', block: 5, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/defend_ironclad.png', description: '获得 5 点格挡。', upgradeId: 'DEFEND_R_PLUS',
  },
  DEFEND_R_PLUS: {
    id: 'DEFEND_R_PLUS', name: '防御+', cost: 1, type: 'SKILL', rarity: 'BASIC',
    target: 'SELF', block: 8, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/defend_ironclad.png', description: '获得 8 点格挡。',
  },
  BASH: {
    id: 'BASH', name: '重击', cost: 2, type: 'ATTACK', rarity: 'BASIC',
    target: 'ENEMY', damage: 8, magicNumber: 2, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/bash.png', description: '造成 8 点伤害，施加 2 层易伤。', upgradeId: 'BASH_PLUS',
  },
  BASH_PLUS: {
    id: 'BASH_PLUS', name: '重击+', cost: 2, type: 'ATTACK', rarity: 'BASIC',
    target: 'ENEMY', damage: 10, magicNumber: 3, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/bash.png', description: '造成 10 点伤害，施加 3 层易伤。',
  },

  // ── STATUS ──────────────────────────────────────────────────────────────
  BURN: {
    id: 'BURN', name: '灼烧', cost: 1, type: 'STATUS', rarity: 'STATUS',
    target: 'SELF', damage: 4, upgraded: false, exhaust: true, innate: false, retain: false,
    image: '/assets/cards/burn.png', description: '对自身造成 4 点伤害，然后消耗。',
  },

  // ── COMMON ──────────────────────────────────────────────────────────────
  ANGER: {
    id: 'ANGER', name: '愤怒', cost: 0, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 6, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/anger.png', description: '造成 6 点伤害，将一张副本加入弃牌堆。', upgradeId: 'ANGER_PLUS',
  },
  ANGER_PLUS: {
    id: 'ANGER_PLUS', name: '愤怒+', cost: 0, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 8, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/anger.png', description: '造成 8 点伤害，将一张副本加入弃牌堆。',
  },
  CLEAVE: {
    id: 'CLEAVE', name: '劈砍', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ALL_ENEMY', damage: 8, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/havoc.png', description: '对所有敌人各造成 8 点伤害。', upgradeId: 'CLEAVE_PLUS',
  },
  CLEAVE_PLUS: {
    id: 'CLEAVE_PLUS', name: '劈砍+', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ALL_ENEMY', damage: 11, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/havoc.png', description: '对所有敌人各造成 11 点伤害。',
  },
  ARMAMENTS: {
    id: 'ARMAMENTS', name: '军备', cost: 1, type: 'SKILL', rarity: 'COMMON',
    target: 'SELF', block: 5, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/armaments.png', description: '获得 5 点格挡。升级手牌中一张牌。', upgradeId: 'ARMAMENTS_PLUS',
  },
  ARMAMENTS_PLUS: {
    id: 'ARMAMENTS_PLUS', name: '军备+', cost: 1, type: 'SKILL', rarity: 'COMMON',
    target: 'SELF', block: 5, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/armaments.png', description: '获得 5 点格挡。升级手牌中所有牌。',
  },
  POMMEL_STRIKE: {
    id: 'POMMEL_STRIKE', name: '圆首打击', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 9, magicNumber: 1, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/pommel_strike.png', description: '造成 9 点伤害，摸 1 张牌。', upgradeId: 'POMMEL_STRIKE_PLUS',
  },
  POMMEL_STRIKE_PLUS: {
    id: 'POMMEL_STRIKE_PLUS', name: '圆首打击+', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 10, magicNumber: 2, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/pommel_strike.png', description: '造成 10 点伤害，摸 2 张牌。',
  },
  SHRUG_IT_OFF: {
    id: 'SHRUG_IT_OFF', name: '泰然处之', cost: 1, type: 'SKILL', rarity: 'COMMON',
    target: 'SELF', block: 8, magicNumber: 1, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/shrug_it_off.png', description: '获得 8 点格挡，摸 1 张牌。', upgradeId: 'SHRUG_IT_OFF_PLUS',
  },
  SHRUG_IT_OFF_PLUS: {
    id: 'SHRUG_IT_OFF_PLUS', name: '泰然处之+', cost: 1, type: 'SKILL', rarity: 'COMMON',
    target: 'SELF', block: 11, magicNumber: 1, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/shrug_it_off.png', description: '获得 11 点格挡，摸 1 张牌。',
  },
  FLEX: {
    id: 'FLEX', name: '屈肌', cost: 0, type: 'SKILL', rarity: 'COMMON',
    target: 'SELF', magicNumber: 2, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/lift.png', description: '本回合获得 2 点力量，回合结束时失去 2 点力量。', upgradeId: 'FLEX_PLUS',
  },
  FLEX_PLUS: {
    id: 'FLEX_PLUS', name: '屈肌+', cost: 0, type: 'SKILL', rarity: 'COMMON',
    target: 'SELF', magicNumber: 4, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/lift.png', description: '本回合获得 4 点力量，回合结束时失去 4 点力量。',
  },
  INFLAME: {
    id: 'INFLAME', name: '燃魂', cost: 1, type: 'POWER', rarity: 'COMMON',
    target: 'SELF', magicNumber: 2, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/inflame.png', description: '获得 2 点力量。', upgradeId: 'INFLAME_PLUS',
  },
  INFLAME_PLUS: {
    id: 'INFLAME_PLUS', name: '燃魂+', cost: 1, type: 'POWER', rarity: 'COMMON',
    target: 'SELF', magicNumber: 3, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/inflame.png', description: '获得 3 点力量。',
  },
  IRON_WAVE: {
    id: 'IRON_WAVE', name: '铁波浪', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 5, block: 5, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/iron_wave.png', description: '造成 5 点伤害，获得 5 点格挡。', upgradeId: 'IRON_WAVE_PLUS',
  },
  IRON_WAVE_PLUS: {
    id: 'IRON_WAVE_PLUS', name: '铁波浪+', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 7, block: 7, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/iron_wave.png', description: '造成 7 点伤害，获得 7 点格挡。',
  },
  HEADBUTT: {
    id: 'HEADBUTT', name: '头槌', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 9, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/headbutt.png', description: '造成 9 点伤害。将弃牌堆顶部的牌放到抽牌堆顶。', upgradeId: 'HEADBUTT_PLUS',
  },
  HEADBUTT_PLUS: {
    id: 'HEADBUTT_PLUS', name: '头槌+', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 12, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/headbutt.png', description: '造成 12 点伤害。将弃牌堆顶部的牌放到抽牌堆顶。',
  },
  THUNDERCLAP: {
    id: 'THUNDERCLAP', name: '雷鸣掌', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ALL_ENEMY', damage: 4, magicNumber: 1, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/thunderclap.png', description: '对所有敌人各造成 4 点伤害并施加 1 层易伤。', upgradeId: 'THUNDERCLAP_PLUS',
  },
  THUNDERCLAP_PLUS: {
    id: 'THUNDERCLAP_PLUS', name: '雷鸣掌+', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ALL_ENEMY', damage: 7, magicNumber: 1, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/thunderclap.png', description: '对所有敌人各造成 7 点伤害并施加 1 层易伤。',
  },
  TWIN_STRIKE: {
    id: 'TWIN_STRIKE', name: '双击', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 5, hits: 2, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/twin_strike.png', description: '造成 2 次 5 点伤害。', upgradeId: 'TWIN_STRIKE_PLUS',
  },
  TWIN_STRIKE_PLUS: {
    id: 'TWIN_STRIKE_PLUS', name: '双击+', cost: 1, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 7, hits: 2, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/twin_strike.png', description: '造成 2 次 7 点伤害。',
  },

  // ── UNCOMMON ────────────────────────────────────────────────────────────
  CARNAGE: {
    id: 'CARNAGE', name: '大屠杀', cost: 2, type: 'ATTACK', rarity: 'UNCOMMON',
    target: 'ENEMY', damage: 20, upgraded: false, exhaust: false, innate: false, retain: false, ethereal: true,
    image: '/assets/cards/bludgeon.png', description: '虚空。造成 20 点伤害。', upgradeId: 'CARNAGE_PLUS',
  },
  CARNAGE_PLUS: {
    id: 'CARNAGE_PLUS', name: '大屠杀+', cost: 2, type: 'ATTACK', rarity: 'UNCOMMON',
    target: 'ENEMY', damage: 28, upgraded: true, exhaust: false, innate: false, retain: false, ethereal: true,
    image: '/assets/cards/bludgeon.png', description: '虚空。造成 28 点伤害。',
  },
  UPPERCUT: {
    id: 'UPPERCUT', name: '上勾拳', cost: 2, type: 'ATTACK', rarity: 'UNCOMMON',
    target: 'ENEMY', damage: 13, magicNumber: 1, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/uppercut.png', description: '造成 13 点伤害，施加 1 层虚弱，施加 1 层易伤。', upgradeId: 'UPPERCUT_PLUS',
  },
  UPPERCUT_PLUS: {
    id: 'UPPERCUT_PLUS', name: '上勾拳+', cost: 2, type: 'ATTACK', rarity: 'UNCOMMON',
    target: 'ENEMY', damage: 13, magicNumber: 2, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/uppercut.png', description: '造成 13 点伤害，施加 2 层虚弱，施加 2 层易伤。',
  },
  ENTRENCH: {
    id: 'ENTRENCH', name: '深壕', cost: 2, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'SELF', upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/entrench.png', description: '使当前格挡值翻倍。', upgradeId: 'ENTRENCH_PLUS',
  },
  ENTRENCH_PLUS: {
    id: 'ENTRENCH_PLUS', name: '深壕+', cost: 1, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'SELF', upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/entrench.png', description: '使当前格挡值翻倍。',
  },
  HEMOKINESIS: {
    id: 'HEMOKINESIS', name: '血液动力', cost: 1, type: 'ATTACK', rarity: 'UNCOMMON',
    target: 'ENEMY', damage: 15, selfDamage: 2, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/hemokinesis.png', description: '失去 2 点生命值，造成 15 点伤害。', upgradeId: 'HEMOKINESIS_PLUS',
  },
  HEMOKINESIS_PLUS: {
    id: 'HEMOKINESIS_PLUS', name: '血液动力+', cost: 1, type: 'ATTACK', rarity: 'UNCOMMON',
    target: 'ENEMY', damage: 20, selfDamage: 2, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/hemokinesis.png', description: '失去 2 点生命值，造成 20 点伤害。',
  },
  METALLICIZE: {
    id: 'METALLICIZE', name: '金属化', cost: 1, type: 'POWER', rarity: 'UNCOMMON',
    target: 'SELF', magicNumber: 3, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/stone_armor.png', description: '每回合结束时获得 3 点格挡。', upgradeId: 'METALLICIZE_PLUS',
  },
  METALLICIZE_PLUS: {
    id: 'METALLICIZE_PLUS', name: '金属化+', cost: 1, type: 'POWER', rarity: 'UNCOMMON',
    target: 'SELF', magicNumber: 4, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/stone_armor.png', description: '每回合结束时获得 4 点格挡。',
  },
  FEEL_NO_PAIN: {
    id: 'FEEL_NO_PAIN', name: '感觉不到痛', cost: 1, type: 'POWER', rarity: 'UNCOMMON',
    target: 'SELF', magicNumber: 3, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/feel_no_pain.png', description: '每当一张牌被消耗时，获得 3 点格挡。', upgradeId: 'FEEL_NO_PAIN_PLUS',
  },
  FEEL_NO_PAIN_PLUS: {
    id: 'FEEL_NO_PAIN_PLUS', name: '感觉不到痛+', cost: 1, type: 'POWER', rarity: 'UNCOMMON',
    target: 'SELF', magicNumber: 4, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/feel_no_pain.png', description: '每当一张牌被消耗时，获得 4 点格挡。',
  },

  // ── RARE ────────────────────────────────────────────────────────────────
  LIMIT_BREAK: {
    id: 'LIMIT_BREAK', name: '极限突破', cost: 1, type: 'SKILL', rarity: 'RARE',
    target: 'SELF', upgraded: false, exhaust: true, innate: false, retain: false,
    image: '/assets/cards/limit_break.png', description: '使力量翻倍。消耗。', upgradeId: 'LIMIT_BREAK_PLUS',
  },
  LIMIT_BREAK_PLUS: {
    id: 'LIMIT_BREAK_PLUS', name: '极限突破+', cost: 1, type: 'SKILL', rarity: 'RARE',
    target: 'SELF', upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/limit_break.png', description: '使力量翻倍。',
  },
  REAPER: {
    id: 'REAPER', name: '死神镰刀', cost: 2, type: 'ATTACK', rarity: 'RARE',
    target: 'ALL_ENEMY', damage: 4, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/reap.png', description: '对所有敌人各造成 4 点伤害，回复等同于造成伤害量的生命值。', upgradeId: 'REAPER_PLUS',
  },
  REAPER_PLUS: {
    id: 'REAPER_PLUS', name: '死神镰刀+', cost: 2, type: 'ATTACK', rarity: 'RARE',
    target: 'ALL_ENEMY', damage: 5, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/reap.png', description: '对所有敌人各造成 5 点伤害，回复等同于造成伤害量的生命值。',
  },
  DEMON_FORM: {
    id: 'DEMON_FORM', name: '恶魔形态', cost: 3, type: 'POWER', rarity: 'RARE',
    target: 'SELF', magicNumber: 2, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/demon_form.png', description: '每回合开始时获得 2 点力量。', upgradeId: 'DEMON_FORM_PLUS',
  },
  DEMON_FORM_PLUS: {
    id: 'DEMON_FORM_PLUS', name: '恶魔形态+', cost: 3, type: 'POWER', rarity: 'RARE',
    target: 'SELF', magicNumber: 3, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/demon_form.png', description: '每回合开始时获得 3 点力量。',
  },
  BARRICADE: {
    id: 'BARRICADE', name: '路障', cost: 3, type: 'POWER', rarity: 'RARE',
    target: 'SELF', upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/barricade.png', description: '格挡不再在回合开始时消失。', upgradeId: 'BARRICADE_PLUS',
  },
  BARRICADE_PLUS: {
    id: 'BARRICADE_PLUS', name: '路障+', cost: 2, type: 'POWER', rarity: 'RARE',
    target: 'SELF', upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/barricade.png', description: '格挡不再在回合开始时消失。',
  },

  // ── STS2 新机制卡牌 ─────────────────────────────────────────────────────

  // SENTINEL — 展示【固有(Innate)】机制
  SENTINEL: {
    id: 'SENTINEL', name: '哨兵', cost: 1, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'SELF', block: 5, innate: true, upgraded: false, exhaust: false, retain: false,
    image: '/assets/cards/sentinel.png', description: '【固有】每场战斗开始时出现在手牌。获得 5 点格挡。', upgradeId: 'SENTINEL_PLUS',
  },
  SENTINEL_PLUS: {
    id: 'SENTINEL_PLUS', name: '哨兵+', cost: 1, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'SELF', block: 8, innate: true, upgraded: true, exhaust: false, retain: false,
    image: '/assets/cards/sentinel.png', description: '【固有】每场战斗开始时出现在手牌。获得 8 点格挡。',
  },

  // BATTLE_HYMN — 展示【活力(Vigor)】机制
  BATTLE_HYMN: {
    id: 'BATTLE_HYMN', name: '战歌', cost: 1, type: 'SKILL', rarity: 'COMMON',
    target: 'SELF', magicNumber: 3, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/flex.png', description: '获得 3 层活力。下一张攻击牌伤害 +3。', upgradeId: 'BATTLE_HYMN_PLUS',
  },
  BATTLE_HYMN_PLUS: {
    id: 'BATTLE_HYMN_PLUS', name: '战歌+', cost: 1, type: 'SKILL', rarity: 'COMMON',
    target: 'SELF', magicNumber: 5, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/flex.png', description: '获得 5 层活力。下一张攻击牌伤害 +5。',
  },

  // FLAME_BARRIER — 展示【荆棘(Thorns)】机制
  FLAME_BARRIER: {
    id: 'FLAME_BARRIER', name: '火焰壁垒', cost: 2, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'SELF', block: 12, magicNumber: 4, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/flame_barrier.png', description: '获得 12 点格挡。获得 4 层荆棘（被攻击时反弹 4 点伤害）。', upgradeId: 'FLAME_BARRIER_PLUS',
  },
  FLAME_BARRIER_PLUS: {
    id: 'FLAME_BARRIER_PLUS', name: '火焰壁垒+', cost: 2, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'SELF', block: 16, magicNumber: 6, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/flame_barrier.png', description: '获得 16 点格挡。获得 6 层荆棘。',
  },

  // TRUE_GRIT — 展示【消耗(Exhaust)】机制互动
  TRUE_GRIT: {
    id: 'TRUE_GRIT', name: '坚韧', cost: 1, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'SELF', block: 7, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/true_grit.png', description: '获得 7 点格挡。消耗手牌中一张随机牌。', upgradeId: 'TRUE_GRIT_PLUS',
  },
  TRUE_GRIT_PLUS: {
    id: 'TRUE_GRIT_PLUS', name: '坚韧+', cost: 1, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'SELF', block: 9, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/true_grit.png', description: '获得 9 点格挡。消耗手牌中一张随机牌。',
  },

  // SHOCKWAVE — 群体控制（弱化+易伤）
  SHOCKWAVE: {
    id: 'SHOCKWAVE', name: '冲击波', cost: 2, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'ALL_ENEMY', magicNumber: 3, upgraded: false, exhaust: true, innate: false, retain: false,
    image: '/assets/cards/shockwave.png', description: '对所有敌人施加 3 层虚弱和 3 层易伤。消耗。', upgradeId: 'SHOCKWAVE_PLUS',
  },
  SHOCKWAVE_PLUS: {
    id: 'SHOCKWAVE_PLUS', name: '冲击波+', cost: 2, type: 'SKILL', rarity: 'UNCOMMON',
    target: 'ALL_ENEMY', magicNumber: 5, upgraded: true, exhaust: true, innate: false, retain: false,
    image: '/assets/cards/shockwave.png', description: '对所有敌人施加 5 层虚弱和 5 层易伤。消耗。',
  },

  // CLOTHESLINE — 攻击+虚弱（使用现有图片）
  CLOTHESLINE: {
    id: 'CLOTHESLINE', name: '晾衣绳', cost: 2, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 12, magicNumber: 2, upgraded: false, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/uppercut.png', description: '造成 12 点伤害，施加 2 层虚弱。', upgradeId: 'CLOTHESLINE_PLUS',
  },
  CLOTHESLINE_PLUS: {
    id: 'CLOTHESLINE_PLUS', name: '晾衣绳+', cost: 2, type: 'ATTACK', rarity: 'COMMON',
    target: 'ENEMY', damage: 14, magicNumber: 3, upgraded: true, exhaust: false, innate: false, retain: false,
    image: '/assets/cards/uppercut.png', description: '造成 14 点伤害，施加 3 层虚弱。',
  },
}

export const STARTING_DECK = [
  'STRIKE_R', 'STRIKE_R', 'STRIKE_R', 'STRIKE_R', 'STRIKE_R',
  'DEFEND_R', 'DEFEND_R', 'DEFEND_R', 'DEFEND_R', 'BASH',
]

// Flat pool of all non-Basic/Status non-upgraded card IDs (used by shop)
export const IRONCLAD_CARD_POOL = [
  // Common
  'ANGER', 'CLEAVE', 'ARMAMENTS', 'POMMEL_STRIKE', 'SHRUG_IT_OFF', 'FLEX', 'INFLAME',
  'IRON_WAVE', 'HEADBUTT', 'THUNDERCLAP', 'TWIN_STRIKE',
  'BATTLE_HYMN', 'CLOTHESLINE',
  // Uncommon
  'CARNAGE', 'UPPERCUT', 'ENTRENCH', 'HEMOKINESIS', 'METALLICIZE', 'FEEL_NO_PAIN',
  'SENTINEL', 'FLAME_BARRIER', 'TRUE_GRIT', 'SHOCKWAVE',
  // Rare
  'LIMIT_BREAK', 'REAPER', 'DEMON_FORM', 'BARRICADE',
]
