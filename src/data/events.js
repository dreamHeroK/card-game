// 事件数据 - 参考杀戮尖塔
import { getRandomRelic } from './relics.js';

export const EVENT_TYPE = {
  CLERIC: 'cleric', // 牧师事件
  RANDOM_BATTLE: 'random_battle', // 随机战斗
  ELITE_BATTLE: 'elite_battle', // 精英战斗
  TREASURE: 'treasure', // 宝箱
  UPGRADE_CARD: 'upgrade_card', // 升级卡片
  RANDOM_RELIC: 'random_relic', // 随机遗物
  GOLDEN_IDOL: 'golden_idol', // 黄金神像
  LIVING_WALL: 'living_wall', // 活体墙
  THE_MAUSOLEUM: 'the_mausoleum', // 陵墓
  THE_COLOSSEUM: 'the_colosseum', // 竞技场
  THE_LIBRARY: 'the_library', // 图书馆
  THE_ANCIENT_WRITING: 'the_ancient_writing', // 古代文字
  THE_SHRINE: 'the_shrine', // 神殿
  THE_NEST: 'the_nest', // 巢穴
  THE_JOUST: 'the_joust' // 比武
};

// 事件数据
export const EVENTS = [
  // 牧师事件
  {
    id: 'cleric',
    name: '牧师',
    type: EVENT_TYPE.CLERIC,
    description: '一位友善的牧师愿意为你治疗。',
    options: [
      {
        text: '恢复25%最大生命值（免费）',
        effect: (player) => {
          const healAmount = Math.floor(player.maxHp * 0.25);
          player.hp = Math.min(player.maxHp, player.hp + healAmount);
          return { message: `恢复了${healAmount}点生命值。` };
        }
      },
      {
        text: '恢复所有生命值（花费35金币）',
        effect: (player) => {
          if (player.gold >= 35) {
            player.gold -= 35;
            player.hp = player.maxHp;
            return { message: '恢复了所有生命值。' };
          }
          return { message: '金币不足！', error: true };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 随机战斗事件
  {
    id: 'random_battle',
    name: '随机遭遇',
    type: EVENT_TYPE.RANDOM_BATTLE,
    description: '你遇到了敌人！',
    options: [
      {
        text: '战斗',
        effect: (player, gameState) => {
          return { battle: true, message: '进入战斗！' };
        }
      }
    ]
  },
  // 精英战斗事件
  {
    id: 'elite_battle',
    name: '精英遭遇',
    type: EVENT_TYPE.ELITE_BATTLE,
    description: '你遇到了强大的精英敌人！',
    options: [
      {
        text: '战斗',
        effect: (player, gameState) => {
          return { battle: true, elite: true, message: '进入精英战斗！' };
        }
      }
    ]
  },
  // 宝箱事件
  {
    id: 'treasure',
    name: '宝箱',
    type: EVENT_TYPE.TREASURE,
    description: '你发现了一个宝箱！',
    options: [
      {
        text: '打开',
        effect: (player, gameState) => {
          const relic = getRandomRelic();
          if (relic) {
            player.relics.push(relic);
            return { message: `获得了遗物：${relic.name}！`, relic };
          }
          return { message: '宝箱是空的。' };
        }
      }
    ]
  },
  // 升级卡片事件
  {
    id: 'upgrade_card',
    name: '升级',
    type: EVENT_TYPE.UPGRADE_CARD,
    description: '你可以升级一张卡牌。',
    options: [
      {
        text: '选择卡牌升级',
        effect: (player, gameState) => {
          return { upgrade: true, message: '选择一张卡牌升级。' };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 随机遗物事件
  {
    id: 'random_relic',
    name: '遗物',
    type: EVENT_TYPE.RANDOM_RELIC,
    description: '你发现了一个遗物！',
    options: [
      {
        text: '获得',
        effect: (player, gameState) => {
          const relic = getRandomRelic();
          if (relic) {
            player.relics.push(relic);
            return { message: `获得了遗物：${relic.name}！`, relic };
          }
          return { message: '没有找到遗物。' };
        }
      }
    ]
  },
  // 黄金神像事件
  {
    id: 'golden_idol',
    name: '黄金神像',
    type: EVENT_TYPE.GOLDEN_IDOL,
    description: '你发现了一个黄金神像，但拿走它会受到诅咒。',
    options: [
      {
        text: '拿走（获得黄金神像，受到诅咒）',
        effect: (player, gameState) => {
          const goldenIdol = { id: 'golden_idol', name: '黄金神像', rarity: 'special', description: '每当你获得金币时，获得更多金币。' };
          player.relics.push(goldenIdol);
          // 添加诅咒卡牌
          const curse = { id: 'curse', name: '诅咒', type: 'curse', cost: 0, description: '诅咒。无法打出。', curse: true };
          player.deck.push(curse);
          return { message: '获得了黄金神像，但受到了诅咒！', relic: goldenIdol };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 活体墙事件
  {
    id: 'living_wall',
    name: '活体墙',
    type: EVENT_TYPE.LIVING_WALL,
    description: '一堵活体墙挡住了去路。',
    options: [
      {
        text: '攻击（失去生命值，获得遗物）',
        effect: (player, gameState) => {
          if (player.hp > 10) {
            player.hp = Math.max(1, player.hp - 10);
            const relic = getRandomRelic('common');
            if (relic) {
              player.relics.push(relic);
              return { message: `失去了10点生命值，获得了遗物：${relic.name}！`, relic };
            }
          }
          return { message: '生命值不足！', error: true };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 陵墓事件
  {
    id: 'the_mausoleum',
    name: '陵墓',
    type: EVENT_TYPE.THE_MAUSOLEUM,
    description: '你发现了一座古老的陵墓。',
    options: [
      {
        text: '探索（可能获得遗物或受到伤害）',
        effect: (player, gameState) => {
          const rand = Math.random();
          if (rand < 0.5) {
            const relic = getRandomRelic();
            if (relic) {
              player.relics.push(relic);
              return { message: `获得了遗物：${relic.name}！`, relic };
            }
          } else {
            const damage = Math.floor(player.maxHp * 0.1);
            player.hp = Math.max(1, player.hp - damage);
            return { message: `受到了${damage}点伤害！` };
          }
          return { message: '什么也没找到。' };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 竞技场事件
  {
    id: 'the_colosseum',
    name: '竞技场',
    type: EVENT_TYPE.THE_COLOSSEUM,
    description: '你来到了一个竞技场。',
    options: [
      {
        text: '战斗（连续3场战斗，获得奖励）',
        effect: (player, gameState) => {
          return { battle: true, colosseum: true, message: '进入竞技场战斗！' };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 图书馆事件
  {
    id: 'the_library',
    name: '图书馆',
    type: EVENT_TYPE.THE_LIBRARY,
    description: '你发现了一个图书馆。',
    options: [
      {
        text: '选择一张卡牌加入牌组',
        effect: (player, gameState) => {
          return { chooseCard: true, message: '选择一张卡牌加入牌组。' };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 古代文字事件
  {
    id: 'the_ancient_writing',
    name: '古代文字',
    type: EVENT_TYPE.THE_ANCIENT_WRITING,
    description: '你发现了刻有古代文字的石碑。',
    options: [
      {
        text: '阅读（升级一张卡牌）',
        effect: (player, gameState) => {
          return { upgrade: true, message: '选择一张卡牌升级。' };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 神殿事件
  {
    id: 'the_shrine',
    name: '神殿',
    type: EVENT_TYPE.THE_SHRINE,
    description: '你发现了一个神殿。',
    options: [
      {
        text: '祈祷（获得遗物，失去金币）',
        effect: (player, gameState) => {
          if (player.gold >= 50) {
            player.gold -= 50;
            const relic = getRandomRelic();
            if (relic) {
              player.relics.push(relic);
              return { message: `花费50金币，获得了遗物：${relic.name}！`, relic };
            }
          }
          return { message: '金币不足！', error: true };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 巢穴事件
  {
    id: 'the_nest',
    name: '巢穴',
    type: EVENT_TYPE.THE_NEST,
    description: '你发现了一个怪物巢穴。',
    options: [
      {
        text: '战斗',
        effect: (player, gameState) => {
          return { battle: true, message: '进入战斗！' };
        }
      },
      {
        text: '离开',
        effect: () => ({ message: '你离开了。' })
      }
    ]
  },
  // 比武事件
  {
    id: 'the_joust',
    name: '比武',
    type: EVENT_TYPE.THE_JOUST,
    description: '你遇到了一个骑士，他邀请你比武。',
    options: [
      {
        text: '接受（战斗，获得奖励）',
        effect: (player, gameState) => {
          return { battle: true, message: '进入战斗！' };
        }
      },
      {
        text: '拒绝',
        effect: () => ({ message: '你拒绝了。' })
      }
    ]
  }
];

// 根据ID获取事件
export const getEventById = (id) => {
  return EVENTS.find(event => event.id === id);
};

// 随机获取事件
export const getRandomEvent = () => {
  return EVENTS[Math.floor(Math.random() * EVENTS.length)];
};

// 根据类型获取事件
export const getEventsByType = (type) => {
  return EVENTS.filter(event => event.type === type);
};
