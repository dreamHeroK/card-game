// STS2 Act 1 monsters — based on spire-codex.com/zhs/encounters
// Pattern types: ATTACK | DEFEND | BUFF | DEBUFF
// BUFF:   { buffId, buffAmount }  — applies to self
// DEBUFF: { debuffId, debuffAmount } — applies to player

export const MONSTER_DATA = {

  // ─── OVERGROWTH · Normal ──────────────────────────────────────────────────

  NIBBIT: {
    id: 'NIBBIT', name: '尼比特', minHp: 14, maxHp: 18, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 5, times: 1, description: '啃咬 5' },
      { type: 'ATTACK', value: 7, times: 1, description: '猛扑 7' },
    ],
    image: '/assets/renders/nibbit.png',
  },

  CUBEX_CONSTRUCT: {
    id: 'CUBEX_CONSTRUCT', name: '方形构装体', minHp: 35, maxHp: 42, strength: 0, random: false,
    pattern: [
      { type: 'ATTACK', value: 9, times: 1, description: '冲撞 9' },
      { type: 'DEFEND', value: 8, times: 1, description: '加固 (+8格挡)' },
      { type: 'ATTACK', value: 12, times: 1, description: '重拳 12' },
    ],
    image: '/assets/renders/cubex_construct.png',
  },

  EYE_WITH_TEETH: {
    id: 'EYE_WITH_TEETH', name: '齿眼', minHp: 12, maxHp: 18, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 4, times: 2, description: '啃咬 4x2' },
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 1, value: null, times: 1, description: '凝视 (虚弱 1)' },
    ],
    image: '/assets/renders/eye_with_teeth.png',
  },

  FOGMOG: {
    id: 'FOGMOG', name: '雾怪', minHp: 22, maxHp: 30, strength: 0, random: false,
    pattern: [
      { type: 'DEBUFF', debuffId: 'VULNERABLE', debuffAmount: 1, value: null, times: 1, description: '包裹 (易伤 1)' },
      { type: 'ATTACK', value: 8, times: 1, description: '吞噬 8' },
      { type: 'ATTACK', value: 6, times: 2, description: '拍打 6x2' },
    ],
    image: '/assets/renders/fogmog.png',
  },

  FUZZY_WURM_CRAWLER: {
    id: 'FUZZY_WURM_CRAWLER', name: '绒毛爬虫', minHp: 22, maxHp: 30, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 7, times: 1, description: '撕咬 7' },
      { type: 'ATTACK', value: 4, times: 2, description: '连咬 4x2' },
      { type: 'DEFEND', value: 7, times: 1, description: '蜷缩 (+7格挡)' },
    ],
    image: '/assets/renders/fuzzy_wurm_crawler.png',
  },

  LEAF_SLIME_M: {
    id: 'LEAF_SLIME_M', name: '叶史莱姆(中)', minHp: 22, maxHp: 28, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 7, times: 1, description: '黏击 7' },
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 1, value: null, times: 1, description: '黏液 (虚弱 1)' },
    ],
    image: '/assets/renders/leaf_slime_m.png',
  },

  LEAF_SLIME_S: {
    id: 'LEAF_SLIME_S', name: '叶史莱姆(小)', minHp: 10, maxHp: 14, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 5, times: 1, description: '黏击 5' },
    ],
    image: '/assets/renders/leaf_slime_s.png',
  },

  TWIG_SLIME_M: {
    id: 'TWIG_SLIME_M', name: '枝史莱姆(中)', minHp: 22, maxHp: 28, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 6, times: 1, description: '黏击 6' },
      { type: 'ATTACK', value: 4, times: 2, description: '连击 4x2' },
    ],
    image: '/assets/renders/twig_slime_m.png',
  },

  TWIG_SLIME_S: {
    id: 'TWIG_SLIME_S', name: '枝史莱姆(小)', minHp: 10, maxHp: 14, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 5, times: 1, description: '黏击 5' },
    ],
    image: '/assets/renders/twig_slime_s.png',
  },

  INKLET: {
    id: 'INKLET', name: '墨虫', minHp: 18, maxHp: 26, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 6, times: 1, description: '喷墨 6' },
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 2, value: null, times: 1, description: '墨雾 (虚弱 2)' },
      { type: 'ATTACK', value: 9, times: 1, description: '触手 9' },
    ],
    image: '/assets/renders/inklet.png',
  },

  MAWLER: {
    id: 'MAWLER', name: '颌兽', minHp: 38, maxHp: 46, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 11, times: 1, description: '撕咬 11' },
      { type: 'ATTACK', value: 7, times: 1, description: '啃咬 7' },
      { type: 'DEFEND', value: 6, times: 1, description: '蜷缩 (+6格挡)' },
    ],
    image: '/assets/renders/mawler.png',
  },

  SHRINKER_BEETLE: {
    id: 'SHRINKER_BEETLE', name: '缩甲虫', minHp: 22, maxHp: 30, strength: 0, random: false,
    pattern: [
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 2, value: null, times: 1, description: '喷雾 (虚弱 2)' },
      { type: 'ATTACK', value: 8, times: 1, description: '撞击 8' },
      { type: 'ATTACK', value: 6, times: 1, description: '啃咬 6' },
    ],
    image: '/assets/renders/shrinker_beetle.png',
  },

  FLYCONID: {
    id: 'FLYCONID', name: '菇蘑精', minHp: 16, maxHp: 24, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 5, times: 1, description: '孢子攻击 5' },
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 1, value: null, times: 1, description: '孢子强化 (+1力量)' },
      { type: 'ATTACK', value: 7, times: 1, description: '孢子攻击 7' },
    ],
    image: '/assets/renders/flyconid.png',
  },

  SNAPPING_JAXFRUIT: {
    id: 'SNAPPING_JAXFRUIT', name: '咬裂果', minHp: 25, maxHp: 32, strength: 0, random: false,
    pattern: [
      { type: 'ATTACK', value: 10, times: 1, description: '猛咬 10' },
      { type: 'DEFEND', value: 10, times: 1, description: '硬化 (+10格挡)' },
    ],
    image: '/assets/renders/snapping_jaxfruit.png',
  },

  SLITHERING_STRANGLER: {
    id: 'SLITHERING_STRANGLER', name: '扭缠者', minHp: 32, maxHp: 40, strength: 0, random: false,
    pattern: [
      { type: 'DEBUFF', debuffId: 'FRAIL', debuffAmount: 2, value: null, times: 1, description: '缠绕 (脆弱 2)' },
      { type: 'ATTACK', value: 9, times: 1, description: '挤压 9' },
      { type: 'ATTACK', value: 6, times: 2, description: '鞭打 6x2' },
    ],
    image: '/assets/renders/slithering_strangler.png',
  },

  VINE_SHAMBLER: {
    id: 'VINE_SHAMBLER', name: '藤蔓行者', minHp: 42, maxHp: 52, strength: 0, random: false,
    pattern: [
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 2, value: null, times: 1, description: '生长 (+2力量)' },
      { type: 'ATTACK', value: 10, times: 1, description: '藤击 10' },
      { type: 'ATTACK', value: 7, times: 2, description: '缠击 7x2' },
    ],
    image: '/assets/renders/vine_shambler.png',
  },

  // Ruby Raiders — 每场战斗随机出现其中2名
  ASSASSIN_RAIDER: {
    id: 'ASSASSIN_RAIDER', name: '刺客劫匪', minHp: 22, maxHp: 28, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 6, times: 2, description: '双刺 6x2' },
      { type: 'ATTACK', value: 12, times: 1, description: '刺杀 12' },
    ],
    image: '/assets/renders/assassin_raider.png',
  },

  AXE_RAIDER: {
    id: 'AXE_RAIDER', name: '斧战劫匪', minHp: 30, maxHp: 40, strength: 0, random: false,
    pattern: [
      { type: 'ATTACK', value: 12, times: 1, description: '斧劈 12' },
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 2, value: null, times: 1, description: '战吼 (+2力量)' },
    ],
    image: '/assets/renders/axe_raider.png',
  },

  BRUTE_RAIDER: {
    id: 'BRUTE_RAIDER', name: '蛮力劫匪', minHp: 36, maxHp: 45, strength: 0, random: false,
    pattern: [
      { type: 'ATTACK', value: 14, times: 1, description: '猛击 14' },
      { type: 'DEFEND', value: 10, times: 1, description: '格挡 (+10格挡)' },
      { type: 'ATTACK', value: 9, times: 1, description: '砸击 9' },
    ],
    image: '/assets/renders/brute_raider.png',
  },

  CROSSBOW_RAIDER: {
    id: 'CROSSBOW_RAIDER', name: '弩手劫匪', minHp: 18, maxHp: 25, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 8, times: 1, description: '射击 8' },
      { type: 'DEBUFF', debuffId: 'VULNERABLE', debuffAmount: 2, value: null, times: 1, description: '毒箭 (易伤 2)' },
    ],
    image: '/assets/renders/crossbow_raider.png',
  },

  TRACKER_RAIDER: {
    id: 'TRACKER_RAIDER', name: '追踪劫匪', minHp: 20, maxHp: 28, strength: 0, random: true,
    pattern: [
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 2, value: null, times: 1, description: '追踪标记 (虚弱 2)' },
      { type: 'ATTACK', value: 7, times: 2, description: '连击 7x2' },
    ],
    image: '/assets/renders/tracker_raider.png',
  },

  // ─── UNDERDOCKS · Normal ─────────────────────────────────────────────────

  CORPSE_SLUG: {
    id: 'CORPSE_SLUG', name: '尸蛞蝓', minHp: 14, maxHp: 20, strength: 0, random: false,
    pattern: [
      { type: 'DEBUFF', debuffId: 'POISON', debuffAmount: 3, value: null, times: 1, description: '腐液 (毒素 3)' },
      { type: 'ATTACK', value: 7, times: 1, description: '撞击 7' },
    ],
    image: '/assets/renders/corpse_slug.png',
  },

  CALCIFIED_CULTIST: {
    id: 'CALCIFIED_CULTIST', name: '钙化狂徒', minHp: 45, maxHp: 52, strength: 0, random: false,
    pattern: [
      { type: 'BUFF', buffId: 'RITUAL', buffAmount: 2, value: null, times: 1, description: '石化仪式 (+2力量)' },
      { type: 'ATTACK', value: 7, times: 1, description: '攻击 7' },
    ],
    image: '/assets/renders/calcified_cultist.png',
  },

  DAMP_CULTIST: {
    id: 'DAMP_CULTIST', name: '潮湿狂徒', minHp: 36, maxHp: 44, strength: 0, random: false,
    pattern: [
      { type: 'DEBUFF', debuffId: 'POISON', debuffAmount: 2, value: null, times: 1, description: '浸毒 (毒素 2)' },
      { type: 'ATTACK', value: 6, times: 1, description: '攻击 6' },
      { type: 'BUFF', buffId: 'RITUAL', buffAmount: 1, value: null, times: 1, description: '潮湿仪式 (+1力量)' },
    ],
    image: '/assets/renders/damp_cultist.png',
  },

  GAS_BOMB: {
    id: 'GAS_BOMB', name: '毒气炸弹', minHp: 12, maxHp: 18, strength: 0, random: false,
    pattern: [
      { type: 'DEBUFF', debuffId: 'POISON', debuffAmount: 4, value: null, times: 1, description: '爆炸 (毒素 4)' },
      { type: 'DEBUFF', debuffId: 'VULNERABLE', debuffAmount: 2, value: null, times: 1, description: '气体 (易伤 2)' },
    ],
    image: '/assets/renders/gas_bomb.png',
  },

  LIVING_FOG: {
    id: 'LIVING_FOG', name: '活雾', minHp: 30, maxHp: 40, strength: 0, random: false,
    pattern: [
      { type: 'DEFEND', value: 8, times: 1, description: '雾化 (+8格挡)' },
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 2, value: null, times: 1, description: '迷雾 (虚弱 2)' },
      { type: 'ATTACK', value: 9, times: 1, description: '吞噬 9' },
    ],
    image: '/assets/renders/living_fog.png',
  },

  FOSSIL_STALKER: {
    id: 'FOSSIL_STALKER', name: '化石追踪者', minHp: 38, maxHp: 50, strength: 0, random: false,
    pattern: [
      { type: 'ATTACK', value: 10, times: 1, description: '突袭 10' },
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 2, value: null, times: 1, description: '觉醒 (+2力量)' },
      { type: 'ATTACK', value: 8, times: 2, description: '连击 8x2' },
    ],
    image: '/assets/renders/fossil_stalker.png',
  },

  HAUNTED_SHIP: {
    id: 'HAUNTED_SHIP', name: '幽灵船', minHp: 52, maxHp: 65, strength: 0, random: false,
    pattern: [
      { type: 'DEFEND', value: 12, times: 1, description: '船体加固 (+12格挡)' },
      { type: 'ATTACK', value: 13, times: 1, description: '船炮 13' },
      { type: 'ATTACK', value: 7, times: 2, description: '连炮 7x2' },
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 2, value: null, times: 1, description: '诅咒 (虚弱 2)' },
    ],
    image: '/assets/renders/haunted_ship.png',
  },

  PUNCH_CONSTRUCT: {
    id: 'PUNCH_CONSTRUCT', name: '拳击构装体', minHp: 36, maxHp: 46, strength: 0, random: false,
    pattern: [
      { type: 'ATTACK', value: 8, times: 1, description: '直拳 8' },
      { type: 'ATTACK', value: 6, times: 2, description: '连拳 6x2' },
      { type: 'ATTACK', value: 14, times: 1, description: '重拳 14' },
    ],
    image: '/assets/renders/punch_construct.png',
  },

  SEAPUNK: {
    id: 'SEAPUNK', name: '海朋克', minHp: 28, maxHp: 38, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 8, times: 1, description: '冲击 8' },
      { type: 'DEBUFF', debuffId: 'VULNERABLE', debuffAmount: 2, value: null, times: 1, description: '腐蚀 (易伤 2)' },
    ],
    image: '/assets/renders/seapunk.png',
  },

  SEWER_CLAM: {
    id: 'SEWER_CLAM', name: '下水道蚌', minHp: 24, maxHp: 34, strength: 0, random: false,
    pattern: [
      { type: 'DEFEND', value: 10, times: 1, description: '合壳 (+10格挡)' },
      { type: 'ATTACK', value: 11, times: 1, description: '夹击 11' },
    ],
    image: '/assets/renders/sewer_clam.png',
  },

  SLUDGE_SPINNER: {
    id: 'SLUDGE_SPINNER', name: '污泥纺织者', minHp: 28, maxHp: 38, strength: 0, random: false,
    pattern: [
      { type: 'DEBUFF', debuffId: 'POISON', debuffAmount: 3, value: null, times: 1, description: '喷毒 (毒素 3)' },
      { type: 'ATTACK', value: 7, times: 1, description: '旋击 7' },
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 1, value: null, times: 1, description: '裹缠 (虚弱 1)' },
    ],
    image: '/assets/renders/sludge_spinner.png',
  },

  TOADPOLE: {
    id: 'TOADPOLE', name: '蟾蜍幼体', minHp: 12, maxHp: 18, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 5, times: 1, description: '跳扑 5' },
      { type: 'ATTACK', value: 4, times: 2, description: '连扑 4x2' },
    ],
    image: '/assets/renders/toadpole.png',
  },

  FAT_GREMLIN: {
    id: 'FAT_GREMLIN', name: '胖妖灵', minHp: 28, maxHp: 36, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 4, times: 1, description: '扑打 4' },
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 1, value: null, times: 1, description: '臭气 (虚弱 1)' },
    ],
    image: '/assets/renders/fat_gremlin.png',
  },

  GREMLIN_MERC: {
    id: 'GREMLIN_MERC', name: '佣兵妖灵', minHp: 24, maxHp: 32, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 7, times: 1, description: '刺击 7' },
      { type: 'ATTACK', value: 5, times: 2, description: '连刺 5x2' },
    ],
    image: '/assets/renders/gremlin_merc.png',
  },

  SNEAKY_GREMLIN: {
    id: 'SNEAKY_GREMLIN', name: '鬼祟妖灵', minHp: 18, maxHp: 26, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 9, times: 1, description: '背刺 9' },
      { type: 'DEBUFF', debuffId: 'VULNERABLE', debuffAmount: 1, value: null, times: 1, description: '毒刃 (易伤 1)' },
    ],
    image: '/assets/renders/sneaky_gremlin.png',
  },

  TWO_TAILED_RAT: {
    id: 'TWO_TAILED_RAT', name: '双尾鼠', minHp: 36, maxHp: 46, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 8, times: 1, description: '啃咬 8' },
      { type: 'ATTACK', value: 5, times: 2, description: '双尾击 5x2' },
      { type: 'DEBUFF', debuffId: 'POISON', debuffAmount: 2, value: null, times: 1, description: '瘟疫 (毒素 2)' },
    ],
    image: '/assets/renders/two_tailed_rat.png',
  },

  // ─── OVERGROWTH · Elite ───────────────────────────────────────────────────

  BYGONE_EFFIGY: {
    id: 'BYGONE_EFFIGY', name: '往昔神像', minHp: 90, maxHp: 100, strength: 0, random: false, isElite: true,
    pattern: [
      { type: 'BUFF', buffId: 'RITUAL', buffAmount: 2, value: null, times: 1, description: '古老仪式 (+2力量)' },
      { type: 'ATTACK', value: 14, times: 1, description: '石拳 14' },
      { type: 'DEFEND', value: 15, times: 1, description: '石化 (+15格挡)' },
      { type: 'ATTACK', value: 10, times: 2, description: '连击 10x2' },
    ],
    image: '/assets/renders/bygone_effigy.png',
  },

  BYRDONIS: {
    id: 'BYRDONIS', name: '鸟多尼斯', minHp: 100, maxHp: 115, strength: 0, random: false, isElite: true,
    pattern: [
      { type: 'ATTACK', value: 12, times: 1, description: '俯冲 12' },
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 2, value: null, times: 1, description: '尖鸣 (虚弱 2)' },
      { type: 'ATTACK', value: 8, times: 3, description: '连啄 8x3' },
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 3, value: null, times: 1, description: '振翼 (+3力量)' },
    ],
    image: '/assets/renders/byrdonis.png',
  },

  PHROG_PARASITE: {
    id: 'PHROG_PARASITE', name: '蛙寄生虫', minHp: 82, maxHp: 96, strength: 0, random: false, isElite: true,
    pattern: [
      { type: 'DEBUFF', debuffId: 'VULNERABLE', debuffAmount: 2, value: null, times: 1, description: '寄生 (易伤 2)' },
      { type: 'ATTACK', value: 16, times: 1, description: '舌击 16' },
      { type: 'ATTACK', value: 8, times: 2, description: '爪击 8x2' },
    ],
    image: '/assets/renders/phrog_parasite.png',
  },

  WRIGGLER: {
    id: 'WRIGGLER', name: '扭动者', minHp: 20, maxHp: 28, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 6, times: 1, description: '缠绕 6' },
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 1, value: null, times: 1, description: '黏液 (虚弱 1)' },
    ],
    image: '/assets/renders/wriggler.png',
  },

  // ─── UNDERDOCKS · Elite ──────────────────────────────────────────────────

  PHANTASMAL_GARDENER: {
    id: 'PHANTASMAL_GARDENER', name: '幻影园丁', minHp: 92, maxHp: 108, strength: 0, random: false, isElite: true,
    pattern: [
      { type: 'DEBUFF', debuffId: 'POISON', debuffAmount: 4, value: null, times: 1, description: '毒孢 (毒素 4)' },
      { type: 'ATTACK', value: 12, times: 1, description: '藤鞭 12' },
      { type: 'BUFF', buffId: 'RITUAL', buffAmount: 2, value: null, times: 1, description: '生长仪式 (+2力量)' },
      { type: 'ATTACK', value: 8, times: 2, description: '连击 8x2' },
    ],
    image: '/assets/renders/phantasmal_gardener.png',
  },

  SKULKING_COLONY: {
    id: 'SKULKING_COLONY', name: '潜行群落', minHp: 98, maxHp: 112, strength: 0, random: false, isElite: true,
    pattern: [
      { type: 'ATTACK', value: 6, times: 3, description: '群攻 6x3' },
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 2, value: null, times: 1, description: '聚集 (+2力量)' },
      { type: 'DEFEND', value: 14, times: 1, description: '群聚防御 (+14格挡)' },
      { type: 'ATTACK', value: 18, times: 1, description: '群体冲击 18' },
    ],
    image: '/assets/renders/skulking_colony.png',
  },

  TERROR_EEL: {
    id: 'TERROR_EEL', name: '恐怖鳗', minHp: 88, maxHp: 104, strength: 0, random: false, isElite: true,
    pattern: [
      { type: 'ATTACK', value: 14, times: 1, description: '电击 14' },
      { type: 'DEBUFF', debuffId: 'FRAIL', debuffAmount: 2, value: null, times: 1, description: '感电 (脆弱 2)' },
      { type: 'ATTACK', value: 9, times: 2, description: '连击 9x2' },
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 2, value: null, times: 1, description: '加压 (+2力量)' },
    ],
    image: '/assets/renders/terror_eel.png',
  },

  // ─── OVERGROWTH · Boss ───────────────────────────────────────────────────

  CEREMONIAL_BEAST: {
    id: 'CEREMONIAL_BEAST', name: '仪式兽', minHp: 140, maxHp: 145, strength: 0, random: false, isBoss: true,
    pattern: [
      { type: 'BUFF', buffId: 'RITUAL', buffAmount: 3, value: null, times: 1, description: '仪式 (+3力量)' },
      { type: 'ATTACK', value: 15, times: 3, description: '爪击 15x3' },
      { type: 'DEFEND', value: 20, times: 1, description: '加固 (+20格挡)' },
      { type: 'ATTACK', value: 30, times: 1, description: '重击 30' },
    ],
    image: '/assets/bosses/ceremonial_beast_boss.png',
  },

  KIN_FOLLOWER: {
    id: 'KIN_FOLLOWER', name: '族群跟随者', minHp: 42, maxHp: 54, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 8, times: 1, description: '虔诚攻击 8' },
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 1, value: null, times: 1, description: '信仰强化 (+1力量)' },
    ],
    image: '/assets/bosses/kin_follower.png',
  },

  KIN_PRIEST: {
    id: 'KIN_PRIEST', name: '族群祭司', minHp: 88, maxHp: 100, strength: 0, random: false, isBoss: true,
    pattern: [
      { type: 'BUFF', buffId: 'RITUAL', buffAmount: 3, value: null, times: 1, description: '血祭 (+3力量)' },
      { type: 'ATTACK', value: 12, times: 2, description: '神圣冲击 12x2' },
      { type: 'DEFEND', value: 18, times: 1, description: '神圣护盾 (+18格挡)' },
      { type: 'ATTACK', value: 28, times: 1, description: '审判 28' },
    ],
    image: '/assets/bosses/kin_priest.png',
  },

  VANTOM: {
    id: 'VANTOM', name: '幻影', minHp: 152, maxHp: 168, strength: 0, random: false, isBoss: true,
    pattern: [
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 3, value: null, times: 1, description: '幻化 (虚弱 3)' },
      { type: 'ATTACK', value: 18, times: 1, description: '虚影穿刺 18' },
      { type: 'ATTACK', value: 10, times: 3, description: '幻影连击 10x3' },
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 4, value: null, times: 1, description: '实体化 (+4力量)' },
    ],
    image: '/assets/bosses/vantom.png',
  },

  // ─── UNDERDOCKS · Boss ───────────────────────────────────────────────────

  LAGAVULIN_MATRIARCH: {
    id: 'LAGAVULIN_MATRIARCH', name: '拉加冰窟女王', minHp: 150, maxHp: 168, strength: 0, random: false, isBoss: true,
    pattern: [
      { type: 'DEFEND', value: 18, times: 1, description: '坚甲 (+18格挡)' },
      { type: 'DEBUFF', debuffId: 'FRAIL', debuffAmount: 2, value: null, times: 1, description: '冰封 (脆弱 2)' },
      { type: 'ATTACK', value: 18, times: 2, description: '寒爪 18x2' },
      { type: 'ATTACK', value: 35, times: 1, description: '冰压 35' },
    ],
    image: '/assets/bosses/lagavulin_matriarch.png',
  },

  SOUL_FYSH: {
    id: 'SOUL_FYSH', name: '灵魂鱼', minHp: 142, maxHp: 158, strength: 0, random: false, isBoss: true,
    pattern: [
      { type: 'DEBUFF', debuffId: 'POISON', debuffAmount: 5, value: null, times: 1, description: '毒液注入 (毒素 5)' },
      { type: 'ATTACK', value: 14, times: 2, description: '鳍击 14x2' },
      { type: 'BUFF', buffId: 'RITUAL', buffAmount: 2, value: null, times: 1, description: '灵魂汲取 (+2力量)' },
      { type: 'ATTACK', value: 28, times: 1, description: '深渊冲击 28' },
    ],
    image: '/assets/bosses/soul_fysh.png',
  },

  WATERFALL_GIANT: {
    id: 'WATERFALL_GIANT', name: '瀑布巨人', minHp: 160, maxHp: 180, strength: 0, random: false, isBoss: true,
    pattern: [
      { type: 'ATTACK', value: 10, times: 3, description: '水流冲击 10x3' },
      { type: 'DEFEND', value: 22, times: 1, description: '水盾 (+22格挡)' },
      { type: 'DEBUFF', debuffId: 'VULNERABLE', debuffAmount: 3, value: null, times: 1, description: '洪流 (易伤 3)' },
      { type: 'ATTACK', value: 40, times: 1, description: '瀑布冲压 40' },
    ],
    image: '/assets/bosses/waterfall_giant.png',
  },
}

// ─── ENCOUNTER TABLE (STS2 Act 1, 按层数/区域分段) ────────────────────────
// 地图结构: col 0(起点战斗) → 1-3(Overgrowth早期) → 4(精英锚点)
//           → 5-7(Underdocks中期) → 8(商店锚点) → 9-10(Underdocks后期) → 11(Boss)
export const ENCOUNTER_TABLE = {

  // ── Overgrowth 普通战斗 (col 0-3) ──────────────────────────────────────
  NORMAL_EARLY: [
    ['NIBBIT'],
    ['NIBBIT', 'NIBBIT'],
    ['CUBEX_CONSTRUCT'],
    ['EYE_WITH_TEETH', 'FOGMOG'],
    ['FUZZY_WURM_CRAWLER'],
    ['LEAF_SLIME_M', 'LEAF_SLIME_S'],
    ['TWIG_SLIME_M', 'TWIG_SLIME_S'],
    ['LEAF_SLIME_M', 'TWIG_SLIME_M'],
    ['INKLET'],
    ['SHRINKER_BEETLE'],
    ['FLYCONID', 'SNAPPING_JAXFRUIT'],
    ['SLITHERING_STRANGLER'],
    ['ASSASSIN_RAIDER', 'CROSSBOW_RAIDER'],
    ['TRACKER_RAIDER', 'ASSASSIN_RAIDER'],
  ],

  // ── Underdocks 普通战斗 (col 5-7) ──────────────────────────────────────
  NORMAL_MID: [
    ['CORPSE_SLUG'],
    ['CALCIFIED_CULTIST', 'DAMP_CULTIST'],
    ['GAS_BOMB', 'LIVING_FOG'],
    ['SEAPUNK'],
    ['SEWER_CLAM'],
    ['TOADPOLE', 'TOADPOLE'],
    ['FAT_GREMLIN', 'GREMLIN_MERC'],
    ['TWO_TAILED_RAT'],
    ['SLUDGE_SPINNER'],
    ['MAWLER'],
    ['FUZZY_WURM_CRAWLER', 'SHRINKER_BEETLE'],
  ],

  // ── Underdocks 后期普通战斗 (col 9-10) ─────────────────────────────────
  NORMAL_LATE: [
    ['FOSSIL_STALKER'],
    ['HAUNTED_SHIP'],
    ['PUNCH_CONSTRUCT'],
    ['CORPSE_SLUG', 'CORPSE_SLUG'],
    ['FAT_GREMLIN', 'GREMLIN_MERC', 'SNEAKY_GREMLIN'],
    ['CALCIFIED_CULTIST', 'SEAPUNK'],
    ['VINE_SHAMBLER'],
    ['AXE_RAIDER', 'BRUTE_RAIDER'],
    ['TWO_TAILED_RAT'],
  ],

  // ── Overgrowth 精英 (col 4 anchor) ─────────────────────────────────────
  ELITE_EARLY: [
    ['BYGONE_EFFIGY'],
    ['BYRDONIS'],
    ['PHROG_PARASITE', 'WRIGGLER'],
  ],

  // ── Underdocks 精英 (col 5-10 中出现的精英节点) ─────────────────────────
  ELITE_LATE: [
    ['PHANTASMAL_GARDENER'],
    ['SKULKING_COLONY'],
    ['TERROR_EEL'],
  ],

  BOSS: [
    // Overgrowth
    ['CEREMONIAL_BEAST'],
    ['KIN_FOLLOWER', 'KIN_PRIEST'],
    ['VANTOM'],
    // Underdocks
    ['LAGAVULIN_MATRIARCH'],
    ['SOUL_FYSH'],
    ['WATERFALL_GIANT'],
  ],
}
