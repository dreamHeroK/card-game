export const MONSTER_DATA = {
  CULTIST: {
    id: 'CULTIST', name: '狂热者', minHp: 48, maxHp: 54, strength: 0, random: false,
    pattern: [
      { type: 'BUFF', buffId: 'RITUAL', buffAmount: 3, value: null, times: 1, description: '仪式 (+3力量)' },
      { type: 'ATTACK', value: 6, times: 1, description: '攻击 6' },
    ],
    image: '/assets/renders/cultists.png',
  },
  JAWWORM: {
    id: 'JAWWORM', name: '颌虫', minHp: 40, maxHp: 44, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 11, times: 1, description: '撕咬 11' },
      { type: 'ATTACK', value: 7, times: 1, description: '啃咬 7' },
      { type: 'DEFEND', value: 6, times: 1, description: '蜷缩 (+6格挡)' },
    ],
    image: '/assets/renders/mawler.png',
  },
  RED_LOUSE: {
    id: 'RED_LOUSE', name: '赤色虱', minHp: 10, maxHp: 15, strength: 0, random: true,
    pattern: [
      { type: 'ATTACK', value: 5, times: 2, description: '撕咬 5x2' },
      { type: 'BUFF', buffId: 'STRENGTH', buffAmount: 3, value: null, times: 1, description: '生长 (+3力量)' },
    ],
    image: '/assets/renders/chomper.png',
  },
  GREMLIN_NOB: {
    id: 'GREMLIN_NOB', name: '小鬼头目', minHp: 82, maxHp: 82, strength: 0, random: false, isElite: true,
    pattern: [
      { type: 'DEBUFF', debuffId: 'WEAK', debuffAmount: 2, value: null, times: 1, description: '勃然大怒 (施加2层虚弱)' },
      { type: 'ATTACK', value: 14, times: 1, description: '猛击 14' },
      { type: 'ATTACK', value: 8, times: 1, selfBuff: { buffId: 'STRENGTH', buffAmount: 2 }, description: '冲锋 8' },
    ],
    image: '/assets/renders/fat_gremlin.png',
  },
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
}

export const ENCOUNTER_TABLE = {
  NORMAL: [['CULTIST'], ['JAWWORM'], ['RED_LOUSE', 'RED_LOUSE'], ['CULTIST', 'RED_LOUSE']],
  ELITE: [['GREMLIN_NOB']],
  BOSS: [['CEREMONIAL_BEAST']],
}
