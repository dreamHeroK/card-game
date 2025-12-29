import { RELIC_RARITY } from '../types/index.js';

// 遗物数据 - 参考杀戮尖塔
export const RELICS = [
  // Boss遗物（初始遗物）
  {
    id: 'burning_blood',
    name: '燃烧之血',
    rarity: RELIC_RARITY.BOSS,
    description: '战斗结束时，恢复6点生命。'
  },
  {
    id: 'ring_of_the_snake',
    name: '蛇之戒指',
    rarity: RELIC_RARITY.BOSS,
    description: '每场战斗开始时，抽2张牌。'
  },
  {
    id: 'cracked_core',
    name: '破碎核心',
    rarity: RELIC_RARITY.BOSS,
    description: '战斗开始时，充能1个充能球栏位。'
  },
  {
    id: 'pure_water',
    name: '纯净之水',
    rarity: RELIC_RARITY.BOSS,
    description: '战斗开始时，将1张奇迹加入手牌。'
  },
  // 普通遗物
  {
    id: 'lantern',
    name: '灯笼',
    rarity: RELIC_RARITY.COMMON,
    description: '每回合开始时，获得1点额外能量。'
  },
  {
    id: 'anchor',
    name: '船锚',
    rarity: RELIC_RARITY.COMMON,
    description: '战斗开始时，获得10点格挡。'
  },
  {
    id: 'art_of_war',
    name: '战争艺术',
    rarity: RELIC_RARITY.COMMON,
    description: '如果你本回合没有打出攻击牌，回合结束时获得1点能量。'
  },
  {
    id: 'bag_of_marbles',
    name: '弹珠袋',
    rarity: RELIC_RARITY.COMMON,
    description: '战斗开始时，对所有敌人给予1层易伤。'
  },
  {
    id: 'bag_of_preparation',
    name: '准备袋',
    rarity: RELIC_RARITY.COMMON,
    description: '战斗开始时，抽2张牌。'
  },
  {
    id: 'bloody_idol',
    name: '血腥神像',
    rarity: RELIC_RARITY.COMMON,
    description: '每当你获得金币时，恢复5点生命。'
  },
  {
    id: 'bronze_scales',
    name: '青铜鳞片',
    rarity: RELIC_RARITY.COMMON,
    description: '每当你受到攻击伤害时，对随机敌人造成3点伤害。'
  },
  {
    id: 'centennial_puzzle',
    name: '百年谜题',
    rarity: RELIC_RARITY.COMMON,
    description: '第一次受到伤害时，抽3张牌。'
  },
  {
    id: 'ceramic_fish',
    name: '陶瓷鱼',
    rarity: RELIC_RARITY.COMMON,
    description: '每当你获得3张牌时，获得9金币。'
  },
  {
    id: 'dream_catcher',
    name: '捕梦网',
    rarity: RELIC_RARITY.COMMON,
    description: '在休息处休息时，你可以选择获得1张牌。'
  },
  {
    id: 'happy_flower',
    name: '快乐花',
    rarity: RELIC_RARITY.COMMON,
    description: '每3回合开始时，获得1点能量。'
  },
  {
    id: 'juzu_bracelet',
    name: '念珠手镯',
    rarity: RELIC_RARITY.COMMON,
    description: '普通敌人战斗不再出现在？房间。'
  },
  {
    id: 'oddly_smooth_stone',
    name: '异常光滑的石头',
    rarity: RELIC_RARITY.COMMON,
    description: '战斗开始时，获得1点敏捷。'
  },
  {
    id: 'omamori',
    name: '御守',
    rarity: RELIC_RARITY.COMMON,
    description: '抵消2次诅咒。'
  },
  {
    id: 'pen_nib',
    name: '笔尖',
    rarity: RELIC_RARITY.COMMON,
    description: '每10次攻击后，下一次攻击造成双倍伤害。'
  },
  {
    id: 'preserved_insect',
    name: '保存的昆虫',
    rarity: RELIC_RARITY.COMMON,
    description: '精英敌人生命值减少25%。'
  },
  {
    id: 'red_skull',
    name: '红色骷髅',
    rarity: RELIC_RARITY.COMMON,
    description: '当你的生命值低于50%时，获得3点力量。'
  },
  {
    id: 'regal_pillow',
    name: '皇家枕头',
    rarity: RELIC_RARITY.COMMON,
    description: '在休息处休息时，额外恢复15点生命。'
  },
  {
    id: 'smiling_mask',
    name: '笑脸面具',
    rarity: RELIC_RARITY.COMMON,
    description: '商店中移除卡牌的费用减少50金币。'
  },
  {
    id: 'smooth_stone',
    name: '光滑的石头',
    rarity: RELIC_RARITY.COMMON,
    description: '战斗开始时，获得1点敏捷。'
  },
  {
    id: 'strawberry',
    name: '草莓',
    rarity: RELIC_RARITY.COMMON,
    description: '获得最大生命值+7。'
  },
  {
    id: 'the_boot',
    name: '靴子',
    rarity: RELIC_RARITY.COMMON,
    description: '对生命值低于5的敌人造成5点额外伤害。'
  },
  {
    id: 'tiny_chest',
    name: '小箱子',
    rarity: RELIC_RARITY.COMMON,
    description: '每打开4个宝箱后，获得一个遗物。'
  },
  {
    id: 'toy_ornithopter',
    name: '玩具鸟',
    rarity: RELIC_RARITY.COMMON,
    description: '每当你使用药水时，恢复5点生命。'
  },
  {
    id: 'vajra',
    name: '金刚杵',
    rarity: RELIC_RARITY.COMMON,
    description: '战斗开始时，获得1点力量。'
  },
  {
    id: 'war_paint',
    name: '战争涂料',
    rarity: RELIC_RARITY.COMMON,
    description: '战斗开始时，随机升级2张技能牌。'
  },
  {
    id: 'whetstone',
    name: '磨刀石',
    rarity: RELIC_RARITY.COMMON,
    description: '战斗开始时，随机升级2张攻击牌。'
  },
  // 罕见遗物
  {
    id: 'barricade',
    name: '路障',
    rarity: RELIC_RARITY.RARE,
    description: '格挡不会在回合结束时消失。'
  },
  {
    id: 'calipers',
    name: '卡尺',
    rarity: RELIC_RARITY.RARE,
    description: '回合结束时，保留最多15点格挡。'
  },
  {
    id: 'captains_wheel',
    name: '船长之轮',
    rarity: RELIC_RARITY.RARE,
    description: '战斗开始时，获得18点格挡。'
  },
  {
    id: 'champion_belt',
    name: '冠军腰带',
    rarity: RELIC_RARITY.RARE,
    description: '每当你对敌人施加虚弱时，获得3点格挡。'
  },
  {
    id: 'charons_ashes',
    name: '卡戎的骨灰',
    rarity: RELIC_RARITY.RARE,
    description: '每当你消耗一张牌时，对所有敌人造成3点伤害。'
  },
  {
    id: 'chemical_x',
    name: '化学X',
    rarity: RELIC_RARITY.RARE,
    description: '使用X费用卡牌时，额外触发2次。'
  },
  {
    id: 'clockwork_souvenir',
    name: '发条纪念品',
    rarity: RELIC_RARITY.RARE,
    description: '战斗开始时，获得1点敏捷。'
  },
  {
    id: 'dollys_mirror',
    name: '多莉的镜子',
    rarity: RELIC_RARITY.RARE,
    description: '在商店中，你可以复制一张牌（一次）。'
  },
  {
    id: 'frozen_egg',
    name: '冰冻蛋',
    rarity: RELIC_RARITY.RARE,
    description: '每当你获得一张技能牌时，将其升级。'
  },
  {
    id: 'gambling_chip',
    name: '赌博筹码',
    rarity: RELIC_RARITY.RARE,
    description: '战斗开始时，丢弃任意数量的手牌，然后抽相同数量的牌。'
  },
  {
    id: 'hand_drill',
    name: '手钻',
    rarity: RELIC_RARITY.RARE,
    description: '每当你突破敌人格挡时，给予2层易伤。'
  },
  {
    id: 'ice_cream',
    name: '冰淇淋',
    rarity: RELIC_RARITY.RARE,
    description: '未使用的能量在回合结束时保留。'
  },
  {
    id: 'incense_burner',
    name: '香炉',
    rarity: RELIC_RARITY.RARE,
    description: '每6回合开始时，获得1层无实体。'
  },
  {
    id: 'maw_bank',
    name: '巨口银行',
    rarity: RELIC_RARITY.RARE,
    description: '每当你在商店中花费金币时，获得12金币。战斗后失去。'
  },
  {
    id: 'meat_on_the_bone',
    name: '骨上的肉',
    rarity: RELIC_RARITY.RARE,
    description: '如果你的生命值低于50%，恢复12点生命。'
  },
  {
    id: 'mercury_hourglass',
    name: '水银沙漏',
    rarity: RELIC_RARITY.RARE,
    description: '每回合开始时，对所有敌人造成3点伤害。'
  },
  {
    id: 'molten_egg',
    name: '熔岩蛋',
    rarity: RELIC_RARITY.RARE,
    description: '每当你获得一张攻击牌时，将其升级。'
  },
  {
    id: 'mummified_hand',
    name: '木乃伊手',
    rarity: RELIC_RARITY.RARE,
    description: '每当你消耗一张牌时，随机一张手牌的费用变为0。'
  },
  {
    id: 'pantograph',
    name: '缩放仪',
    rarity: RELIC_RARITY.RARE,
    description: '战斗开始时，恢复25点生命。'
  },
  {
    id: 'paper_phrog',
    name: '纸青蛙',
    rarity: RELIC_RARITY.RARE,
    description: '敌人受到的易伤效果翻倍。'
  },
  {
    id: 'peace_pipe',
    name: '和平烟斗',
    rarity: RELIC_RARITY.RARE,
    description: '在休息处休息时，你可以选择移除一张牌。'
  },
  {
    id: 'pocketwatch',
    name: '怀表',
    rarity: RELIC_RARITY.RARE,
    description: '如果你在回合的前3张牌中打出少于3张牌，抽3张牌。'
  },
  {
    id: 'prayer_wheel',
    name: '转经轮',
    rarity: RELIC_RARITY.RARE,
    description: '普通敌人战斗后，你可以选择获得1张牌。'
  },
  {
    id: 'shuriken',
    name: '手里剑',
    rarity: RELIC_RARITY.RARE,
    description: '每当你打出3张攻击牌时，获得1点力量。'
  },
  {
    id: 'singing_bowl',
    name: '唱歌碗',
    rarity: RELIC_RARITY.RARE,
    description: '每当你选择跳过一张牌时，获得最大生命值+2。'
  },
  {
    id: 'snecko_eye',
    name: '蛇眼',
    rarity: RELIC_RARITY.RARE,
    description: '战斗开始时，抽2张额外牌。所有卡牌的费用随机。'
  },
  {
    id: 'sundial',
    name: '日晷',
    rarity: RELIC_RARITY.RARE,
    description: '每当你洗牌3次时，获得2点能量。'
  },
  {
    id: 'the_abacus',
    name: '算盘',
    rarity: RELIC_RARITY.RARE,
    description: '每当你洗牌时，获得6点格挡。'
  },
  {
    id: 'thread_and_needle',
    name: '针线',
    rarity: RELIC_RARITY.RARE,
    description: '战斗开始时，获得4层金属化。'
  },
  {
    id: 'tori',
    name: '鸟居',
    rarity: RELIC_RARITY.RARE,
    description: '每当你受到攻击伤害时，减少1点伤害。'
  },
  {
    id: 'tough_bandages',
    name: '坚韧绷带',
    rarity: RELIC_RARITY.RARE,
    description: '每当你丢弃一张牌时，获得3点格挡。'
  },
  {
    id: 'turnip',
    name: '萝卜',
    rarity: RELIC_RARITY.RARE,
    description: '你不再能够获得虚弱。'
  },
  {
    id: 'unceasing_top',
    name: '无尽陀螺',
    rarity: RELIC_RARITY.RARE,
    description: '每当你打出一张牌时，如果手牌为空，抽1张牌。'
  },
  {
    id: 'wrist_blade',
    name: '腕刃',
    rarity: RELIC_RARITY.RARE,
    description: '0费用攻击牌造成+4伤害。'
  }
];

// 根据ID获取遗物
export const getRelicById = (id) => {
  return RELICS.find(relic => relic.id === id);
};

// 根据稀有度获取遗物
export const getRelicsByRarity = (rarity) => {
  return RELICS.filter(relic => relic.rarity === rarity);
};

// 随机获取遗物
export const getRandomRelic = (rarity = null) => {
  let filtered = RELICS;
  if (rarity) {
    filtered = RELICS.filter(relic => relic.rarity === rarity);
  }
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// 重新导出 RELIC_RARITY
export { RELIC_RARITY };
