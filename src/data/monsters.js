import { MONSTER_TYPE } from '../types/index.js';

// 怪物数据 - 参考杀戮尖塔
export const MONSTERS = [
  // 第一层普通怪物
  {
    id: 'cultist',
    name: '邪教徒',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 48,
    intents: [
      { type: 'ritual', value: 3 }, // 第一回合：获得3力量
      { type: 'attack', value: 6 },
      { type: 'attack', value: 6 }
    ],
    description: '第一回合使用仪式获得力量，之后攻击。',
    turnPattern: [0, 1, 2] // 回合模式
  },
  {
    id: 'jaw_worm',
    name: '大颚虫',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 40,
    intents: [
      { type: 'chomp', value: 11 }, // 攻击
      { type: 'bellow', value: 0 }, // 获得3力量
      { type: 'thrash', value: 7 }  // 攻击
    ],
    description: '攻击或强化。',
    turnPattern: [0, 1, 2]
  },
  {
    id: 'red_slaver',
    name: '红色奴隶贩',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 46,
    intents: [
      { type: 'stab', value: 12 },
      { type: 'entangle', value: 0 } // 给予缠绕
    ],
    description: '攻击或给予缠绕。',
    turnPattern: [0, 1]
  },
  {
    id: 'blue_slaver',
    name: '蓝色奴隶贩',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 46,
    intents: [
      { type: 'stab', value: 12 },
      { type: 'rake', value: 7 }
    ],
    description: '攻击。',
    turnPattern: [0, 1]
  },
  {
    id: 'louse_red',
    name: '红色虱虫',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 10,
    intents: [
      { type: 'bite', value: 6 },
      { type: 'grow', value: 0 } // 获得3力量
    ],
    description: '攻击或强化。',
    turnPattern: [0, 1]
  },
  {
    id: 'louse_green',
    name: '绿色虱虫',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 11,
    intents: [
      { type: 'spit_web', value: 0 }, // 给予虚弱
      { type: 'bite', value: 5 }
    ],
    description: '攻击或给予虚弱。',
    turnPattern: [0, 1]
  },
  {
    id: 'acid_slime_s',
    name: '小酸液史莱姆',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 8,
    intents: [
      { type: 'lick', value: 0 }, // 给予虚弱
      { type: 'tackle', value: 3 }
    ],
    description: '攻击或给予虚弱。',
    turnPattern: [0, 1]
  },
  {
    id: 'acid_slime_m',
    name: '中酸液史莱姆',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 28,
    intents: [
      { type: 'lick', value: 0 }, // 给予虚弱
      { type: 'tackle', value: 8 }
    ],
    description: '攻击或给予虚弱。',
    turnPattern: [0, 1]
  },
  {
    id: 'spike_slime_s',
    name: '小尖刺史莱姆',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 10,
    intents: [
      { type: 'tackle', value: 3 },
      { type: 'flame_tackle', value: 5 }
    ],
    description: '攻击。',
    turnPattern: [0, 1]
  },
  {
    id: 'spike_slime_m',
    name: '中尖刺史莱姆',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 28,
    intents: [
      { type: 'tackle', value: 8 },
      { type: 'flame_tackle', value: 12 }
    ],
    description: '攻击。',
    turnPattern: [0, 1]
  },
  {
    id: 'fungi_beast',
    name: '真菌兽',
    type: MONSTER_TYPE.NORMAL,
    act: 1,
    maxHp: 22,
    intents: [
      { type: 'bite', value: 6 },
      { type: 'grow', value: 0 } // 获得3力量
    ],
    description: '攻击或强化。',
    turnPattern: [0, 1]
  },
  // 第一层精英
  {
    id: 'gremlin_nob',
    name: '地精大块头',
    type: MONSTER_TYPE.ELITE,
    act: 1,
    maxHp: 82,
    intents: [
      { type: 'rush', value: 14 },
      { type: 'skull_bash', value: 6 }
    ],
    description: '攻击，使用技能时获得力量。',
    turnPattern: [0, 1]
  },
  {
    id: 'lagavulin',
    name: '乐加维林',
    type: MONSTER_TYPE.ELITE,
    act: 1,
    maxHp: 109,
    intents: [
      { type: 'sleep', value: 0 }, // 前3回合睡觉
      { type: 'attack', value: 18 },
      { type: 'siphon_soul', value: 0 } // 减少力量
    ],
    description: '前3回合睡觉，之后攻击或削弱。',
    turnPattern: [0, 0, 0, 1, 2] // 前3回合睡觉
  },
  {
    id: 'sentries',
    name: '哨卫',
    type: MONSTER_TYPE.ELITE,
    act: 1,
    maxHp: 38, // 每个
    intents: [
      { type: 'bolt', value: 5 },
      { type: 'beam', value: 0 } // 给予虚弱
    ],
    description: '攻击或给予虚弱。',
    turnPattern: [0, 1],
    isGroup: true, // 群体战斗
    groupSize: 3
  },
  // Boss
  {
    id: 'slime_boss',
    name: '史莱姆老大',
    type: MONSTER_TYPE.BOSS,
    act: 1,
    maxHp: 140,
    intents: [
      { type: 'tackle', value: 18 },
      { type: 'lick', value: 0 }, // 给予虚弱
      { type: 'split', value: 0 } // 分裂（HP低于50%时）
    ],
    description: '攻击、给予虚弱或分裂。',
    turnPattern: [0, 1, 0, 1]
  },
  {
    id: 'guardian',
    name: '守护者',
    type: MONSTER_TYPE.BOSS,
    act: 1,
    maxHp: 240,
    intents: [
      { type: 'charge_up', value: 0 }, // 获得格挡
      { type: 'defensive_mode', value: 0 }, // 防御模式
      { type: 'fierce_bash', value: 36 }
    ],
    description: '格挡或攻击。',
    turnPattern: [0, 1, 2]
  },
  {
    id: 'hexaghost',
    name: '六火亡魂',
    type: MONSTER_TYPE.BOSS,
    act: 1,
    maxHp: 250,
    intents: [
      { type: 'activate', value: 0 }, // 第一回合激活
      { type: 'inferno', value: 0 }, // 每6回合使用
      { type: 'sear', value: 6 },
      { type: 'tackle', value: 6 }
    ],
    description: '激活、攻击或使用火焰。',
    turnPattern: [0, 2, 3, 2, 3, 1] // 每6回合使用inferno
  }
];

// 根据ID获取怪物
export const getMonsterById = (id) => {
  return MONSTERS.find(monster => monster.id === id);
};

// 根据类型获取怪物
export const getMonstersByType = (type, act = null) => {
  let filtered = MONSTERS.filter(monster => monster.type === type);
  if (act !== null) {
    filtered = filtered.filter(monster => monster.act === act);
  }
  return filtered;
};

// 随机获取怪物
export const getRandomMonster = (type, act = null) => {
  const monsters = getMonstersByType(type, act);
  if (monsters.length === 0) return null;
  return monsters[Math.floor(Math.random() * monsters.length)];
};

// 重新导出 MONSTER_TYPE
export { MONSTER_TYPE };
