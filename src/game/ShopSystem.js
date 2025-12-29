import { RELIC_RARITY } from '../data/relics.js';
import { getCardsByCharacter } from '../data/cards.js';
import { CARD_RARITY } from '../types/index.js';

export class ShopSystem {
  constructor(player) {
    this.player = player;
    this.cards = this.generateShopCards();
    this.relics = this.generateShopRelics();
    this.potions = this.generateShopPotions();
  }

  // 生成商店卡牌
  generateShopCards() {
    const allCards = getCardsByCharacter(this.player.character);
    const shopCards = [];
    
    // 随机选择3-5张卡牌
    const count = 3 + Math.floor(Math.random() * 3);
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      shopCards.push({ ...shuffled[i], price: this.getCardPrice(shuffled[i]) });
    }
    
    return shopCards;
  }

  // 获取卡牌价格
  getCardPrice(card) {
    if (card.rarity === CARD_RARITY.RARE) return 150;
    if (card.rarity === CARD_RARITY.UNCOMMON) return 75;
    return 50; // COMMON
  }

  // 生成商店遗物
  generateShopRelics() {
    return [
      { id: 'lantern', name: '灯笼', rarity: RELIC_RARITY.COMMON, price: 150, description: '每回合开始时，获得1点额外能量。' }
    ];
  }

  // 生成商店药水
  generateShopPotions() {
    return [
      { id: 'potion1', name: '生命药水', price: 50, description: '恢复10点生命。' }
    ];
  }

  // 购买卡牌
  buyCard(index) {
    if (index < 0 || index >= this.cards.length) return false;
    const card = this.cards[index];
    if (this.player.gold < card.price) return false;
    
    this.player.gold -= card.price;
    this.player.deck.push(card);
    this.cards.splice(index, 1);
    return true;
  }

  // 购买遗物
  buyRelic(index) {
    if (index < 0 || index >= this.relics.length) return false;
    const relic = this.relics[index];
    if (this.player.gold < relic.price) return false;
    
    this.player.gold -= relic.price;
    this.player.relics.push(relic);
    this.relics.splice(index, 1);
    return true;
  }

  // 购买药水
  buyPotion(index) {
    if (index < 0 || index >= this.potions.length) return false;
    const potion = this.potions[index];
    if (this.player.gold < potion.price) return false;
    
    this.player.gold -= potion.price;
    this.player.potions.push(potion);
    this.potions.splice(index, 1);
    return true;
  }

  // 移除卡牌
  removeCard(index) {
    if (index < 0 || index >= this.player.deck.length) return false;
    if (this.player.gold < 75) return false;
    
    this.player.gold -= 75;
    this.player.deck.splice(index, 1);
    return true;
  }
}

