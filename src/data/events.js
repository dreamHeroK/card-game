export const EVENT_DATA = {
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
}
