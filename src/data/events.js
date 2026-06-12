export const EVENT_DATA = {
  // ── 原始事件 ────────────────────────────────────────────────────────────
  DEAD_ADVENTURER: {
    id: 'DEAD_ADVENTURER', title: '死亡的冒险者',
    body: '你发现了一具倒在地上的冒险者尸体。他看起来是被怪物袭击的。他的随身物品散落一地...',
    image: '/assets/renders/osty.png',
    choices: [
      { text: '拿走金币 (+30 金)', effect: 'ADD_GOLD_30' },
      { text: '拿走遗物 (随机普通遗物)', effect: 'RANDOM_RELIC' },
      { text: '默默离开', effect: 'NOTHING' },
    ],
  },
  ANCIENT_WRITING: {
    id: 'ANCIENT_WRITING', title: '古代文字',
    body: '你在石壁上发现了一段古老的铭文，似乎记载着神秘的力量。你感觉可以从中汲取力量...',
    image: '/assets/renders/nonupeipe.png',
    choices: [
      { text: '提炼知识 (随机升级牌组中一张牌)', effect: 'UPGRADE_CARD' },
      { text: '提炼力量 (获得 1 点永久力量)', effect: 'ADD_STRENGTH_1' },
    ],
  },
  LIARS_GAME: {
    id: 'LIARS_GAME', title: '赌徒的游戏',
    body: '一个神秘的面具赌徒拦住了你的去路："勇者，来赌一把？赢了你会得到丰厚回报，但输了就要付出代价..."',
    image: '/assets/renders/vakuu.png',
    choices: [
      { text: '接受赌注 (花费50金，50%概率获得100金)', effect: 'GAMBLE_50' },
      { text: '拒绝，继续前行', effect: 'NOTHING' },
    ],
  },

  // ── Act 1 - 过度生长 ───────────────────────────────────────────────────
  BYRDONIS_NEST: {
    id: 'BYRDONIS_NEST', title: '鸟巢',
    body: '一只巨大的怪兽追赶着一只受伤的绿色大鸟，迫使它仓皇出逃。在它离开的角落里，一颗孤零零的蛋被遗弃在巢中。\n\n你的肚子咕噜作响...',
    image: '/assets/renders/osty.png',
    choices: [
      { text: '吃掉鸟蛋 (最大生命值 +7)', effect: 'ADD_MAX_HP_7' },
      { text: '带走鸟蛋 (获得一张随机牌)', effect: 'ADD_RANDOM_CARD' },
    ],
  },
  AROMA_OF_CHAOS: {
    id: 'AROMA_OF_CHAOS', title: '混沌香气',
    body: '踏过茂密丛林进入一片空地，一股难以名状的气息扑面而来。花香、腐败气息与某种完全陌生的味道混合在一起，世界仿佛开始扭曲变形。\n\n你渐渐失去自我的感知...',
    image: '/assets/renders/nonupeipe.png',
    choices: [
      { text: '随波逐流 (变形牌组中一张牌)', effect: 'TRANSFORM_CARD' },
      { text: '保持清醒 (升级牌组中一张牌)', effect: 'UPGRADE_CARD' },
    ],
  },
  DENSE_VEGETATION: {
    id: 'DENSE_VEGETATION', title: '茂密丛林',
    body: '你走错了路，陷入了一片茂密的蕨草、灌木与藤蔓中，尤其是藤蔓。疲惫袭来，心中浮现出一个黑暗念头：\n\n"你已迷失，毫无准备，死亡正在靠近。"\n\n你该怎么办？',
    image: '/assets/renders/osty.png',
    choices: [
      { text: '艰难跋涉 (获得 61-99 金，失去 8 血)', effect: 'GAIN_GOLD_LOSE_HP_8' },
      { text: '原地休息 (恢复 30% 最大生命值)', effect: 'HEAL_30PCT' },
    ],
  },

  // ── 共享事件 ─────────────────────────────────────────────────────────────
  ABYSSAL_BATHS: {
    id: 'ABYSSAL_BATHS', title: '深渊温泉',
    body: '你发现了一处隐秘的洞室，蒸腾的雾气从色彩流动的温泉中升起。墙壁上挂着甲壳状的奇异生长物，不断滴落粘稠液体，接触水面时嗤嗤作响。\n\n你靠近最大的温泉边缘，水面随之荡漾，仿佛在期待你的入浴...',
    image: '/assets/renders/nonupeipe.png',
    choices: [
      { text: '浸入温泉 (最大生命值 +2，失去 3 血)', effect: 'ADD_MAX_HP_2_LOSE_HP_3' },
      { text: '克制欲望 (恢复 10 血)', effect: 'HEAL_10' },
    ],
  },
  BRAIN_LEECH: {
    id: 'BRAIN_LEECH', title: '脑蛭',
    body: '"砰！"\n\n头顶一阵剧痛，一个念头刺入你的脑海：\n\n"分享知识？？？"\n\n你不确定该如何应对...',
    image: '/assets/renders/vakuu.png',
    choices: [
      { text: '分享知识 (获得一张随机牌)', effect: 'ADD_RANDOM_CARD' },
      { text: '扯掉水蛭 (失去 5 血，将它赶走)', effect: 'LOSE_HP_5' },
    ],
  },

  // ── Act 2 - 蜂巢 ───────────────────────────────────────────────────────
  BUGSLAYER: {
    id: 'BUGSLAYER', title: '灭虫者',
    body: '你正在对抗一群凶猛的昆虫，突然意识到一个魁梧的战士一直在你身边并肩作战！\n\n昆虫感到大势已去，四散逃窜。战士转向你："需要一些灭虫技巧的指点吗？"\n\n多有礼貌啊，你点头接受了他的提议。',
    image: '/assets/renders/vakuu.png',
    choices: [
      { text: '学习灭除技 (升级牌组中一张牌)', effect: 'UPGRADE_CARD' },
      { text: '学习踩踏技 (获得 1 点永久力量)', effect: 'ADD_STRENGTH_1' },
    ],
  },
  COLOSSAL_FLOWER: {
    id: 'COLOSSAL_FLOWER', title: '巨型花朵',
    body: '一朵巨大的花朵矗立在一座白骨之山之上，色彩斑斓的花瓣不断脉动着。你能感受到中心深处蕴含着强大的能量，但那些花瓣锋利如刀刃，变幻莫测。\n\n你可以采集外层的金色花蜜，但花心深处的宝物更加令人心动...',
    image: '/assets/renders/osty.png',
    choices: [
      { text: '提取花蜜 (获得 35 金)', effect: 'ADD_GOLD_35' },
      { text: '深入探索 (获得 135 金，失去 14 血)', effect: 'ADD_GOLD_135_LOSE_HP' },
    ],
  },
  AMALGAMATOR: {
    id: 'AMALGAMATOR', title: '合并机',
    body: '"叮！叮叮！！"\n\n金属撞击的回声从墙壁的另一侧传来。你将耳朵贴近倾听，墙壁突然开启，露出一个正在忙碌着的六臂庞然大物。它的"脸"是一个由发光符文组成的漩涡。\n\n"一个拥有提升精神的旅者找来了？让我们进行一次合并吧！"',
    image: '/assets/renders/nonupeipe.png',
    choices: [
      { text: '合并打击 (移除 2 张打击，升级一张牌)', effect: 'COMBINE_STRIKES' },
      { text: '合并防御 (移除 2 张防御，升级一张牌)', effect: 'COMBINE_DEFENDS' },
    ],
  },

  // ── Act 3 - 荣耀 ───────────────────────────────────────────────────────
  BATTLEWORN_DUMMY: {
    id: 'BATTLEWORN_DUMMY', title: '训练假人',
    body: '你刚靠近，它便开始震动闪烁，发出耀眼的光芒！\n\n"嗞！！！训练时间！！你有 3 回合击败我！选择一个难度设置，否则将面临屈辱的惩罚！"\n\n恐吓过后，假人认真地读出了详细说明。你会选择什么？',
    image: '/assets/renders/vakuu.png',
    choices: [
      { text: '设置一 (获得 1 件随机遗物)', effect: 'RANDOM_RELIC' },
      { text: '设置二 (随机升级 2 张牌)', effect: 'UPGRADE_TWO_CARDS' },
      { text: '设置三 (获得 100 金)', effect: 'ADD_GOLD_100' },
    ],
  },
}
