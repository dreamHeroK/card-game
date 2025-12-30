// 药水数据 - 参考杀戮尖塔
export const POTIONS = [
  {
    id: 'strength_potion',
    name: '力量药水',
    description: '获得2点力量。',
    rarity: 'common',
    effect: (player, battle) => {
      player.strength += 2;
      return { message: '获得了2点力量！' };
    }
  },
  {
    id: 'dexterity_potion',
    name: '敏捷药水',
    description: '获得2点敏捷。',
    rarity: 'common',
    effect: (player, battle) => {
      player.dexterity += 2;
      return { message: '获得了2点敏捷！' };
    }
  },
  {
    id: 'block_potion',
    name: '格挡药水',
    description: '获得12点格挡。',
    rarity: 'common',
    effect: (player, battle) => {
      if (battle) {
        battle.block += 12;
      }
      return { message: '获得了12点格挡！' };
    }
  },
  {
    id: 'heal_potion',
    name: '治疗药水',
    description: '恢复10点生命值。',
    rarity: 'common',
    effect: (player, battle) => {
      player.hp = Math.min(player.maxHp, player.hp + 10);
      return { message: '恢复了10点生命值！' };
    }
  },
  {
    id: 'energy_potion',
    name: '能量药水',
    description: '获得2点能量。',
    rarity: 'common',
    effect: (player, battle) => {
      if (battle) {
        battle.energy += 2;
        battle.maxEnergy = Math.max(battle.maxEnergy, battle.energy);
      }
      return { message: '获得了2点能量！' };
    }
  },
  {
    id: 'fire_potion',
    name: '火焰药水',
    description: '对所有敌人造成20点伤害。',
    rarity: 'common',
    effect: (player, battle) => {
      if (battle && battle.enemies) {
        battle.enemies.forEach(enemy => {
          enemy.hp = Math.max(0, enemy.hp - 20);
        });
      }
      return { message: '对所有敌人造成了20点伤害！' };
    }
  },
  {
    id: 'poison_potion',
    name: '毒药水',
    description: '对所有敌人施加5层中毒。',
    rarity: 'uncommon',
    effect: (player, battle) => {
      if (battle && battle.enemies) {
        battle.enemies.forEach(enemy => {
          enemy.poison = (enemy.poison || 0) + 5;
        });
      }
      return { message: '对所有敌人施加了5层中毒！' };
    }
  },
  {
    id: 'weak_potion',
    name: '虚弱药水',
    description: '对所有敌人施加2层虚弱。',
    rarity: 'uncommon',
    effect: (player, battle) => {
      if (battle && battle.enemies) {
        battle.enemies.forEach(enemy => {
          enemy.weak = (enemy.weak || 0) + 2;
        });
      }
      return { message: '对所有敌人施加了2层虚弱！' };
    }
  },
  {
    id: 'vulnerable_potion',
    name: '易伤药水',
    description: '对所有敌人施加2层易伤。',
    rarity: 'uncommon',
    effect: (player, battle) => {
      if (battle && battle.enemies) {
        battle.enemies.forEach(enemy => {
          enemy.vulnerable = (enemy.vulnerable || 0) + 2;
        });
      }
      return { message: '对所有敌人施加了2层易伤！' };
    }
  },
  {
    id: 'blessing_potion',
    name: '祝福药水',
    description: '抽3张牌。',
    rarity: 'uncommon',
    effect: (player, battle) => {
      if (battle) {
        battle.drawCards(3);
      }
      return { message: '抽了3张牌！' };
    }
  }
];

// 根据ID获取药水
export const getPotionById = (id) => {
  return POTIONS.find(potion => potion.id === id);
};

// 随机获取药水
export const getRandomPotion = (rarity = null) => {
  let filtered = POTIONS;
  if (rarity) {
    filtered = POTIONS.filter(potion => potion.rarity === rarity);
  }
  if (filtered.length === 0) return null;
  return { ...filtered[Math.floor(Math.random() * filtered.length)] };
};

