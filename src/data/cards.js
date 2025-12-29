import { CHARACTER, CARD_TYPE, CARD_RARITY } from '../types/index.js';

// 卡牌数据 - 简化版本，包含基础卡牌
export const CARDS = [
  // 铁甲战士基础卡牌
  {
    id: 'strike',
    name: '打击',
    type: CARD_TYPE.ATTACK,
    rarity: CARD_RARITY.BASIC,
    character: CHARACTER.IRONCLAD,
    cost: 1,
    damage: 6,
    description: '造成6点伤害。',
    upgraded: false
  },
  {
    id: 'defend',
    name: '防御',
    type: CARD_TYPE.SKILL,
    rarity: CARD_RARITY.BASIC,
    character: CHARACTER.IRONCLAD,
    cost: 1,
    block: 5,
    description: '获得5点格挡。',
    upgraded: false
  },
  {
    id: 'bash',
    name: '重击',
    type: CARD_TYPE.ATTACK,
    rarity: CARD_RARITY.BASIC,
    character: CHARACTER.IRONCLAD,
    cost: 2,
    damage: 8,
    vulnerable: 2,
    description: '造成8点伤害。给予2层易伤。',
    upgraded: false
  }
];

// 根据角色获取卡牌
export const getCardsByCharacter = (character) => {
  return CARDS.filter(card => card.character === character);
};

// 根据ID获取卡牌
export const getCardById = (id) => {
  return CARDS.find(card => card.id === id);
};

