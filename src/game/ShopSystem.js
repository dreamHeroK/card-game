import { RELIC_RARITY, RELICS } from '../data/relics.js';
import { getCardsByCharacter } from '../data/cards.js';
import { CARD_RARITY, CARD_TYPE } from '../types/index.js';

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

  // 生成商店遗物（与杀戮尖塔一致：3件遗物，最右边一件必定是商店遗物）
  generateShopRelics() {
    const shopRelics = [];
    
    // 筛选出可以在商店出售的遗物（排除BOSS和SHOP类型）
    const availableRelics = RELICS.filter(relic => 
      relic.rarity !== RELIC_RARITY.BOSS && 
      relic.rarity !== RELIC_RARITY.SHOP &&
      relic.rarity !== RELIC_RARITY.SPECIAL
    );
    
    // 随机选择2件普通遗物
    const shuffled = [...availableRelics].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(2, shuffled.length); i++) {
      const relic = { ...shuffled[i], price: this.getRelicPrice(shuffled[i]) };
      shopRelics.push(relic);
    }
    
    // 最右边一件必定是商店遗物（SHOP类型）
    const shopOnlyRelics = RELICS.filter(relic => relic.rarity === RELIC_RARITY.SHOP);
    if (shopOnlyRelics.length > 0) {
      const shopRelic = shopOnlyRelics[Math.floor(Math.random() * shopOnlyRelics.length)];
      shopRelics.push({ ...shopRelic, price: this.getRelicPrice(shopRelic) });
    } else {
      // 如果没有商店遗物，添加一个默认的
      shopRelics.push({ 
        id: 'membership_card', 
        name: '会员卡', 
        rarity: RELIC_RARITY.SHOP, 
        price: 200, 
        description: '商店中的商品价格降低50%。' 
      });
    }
    
    return shopRelics;
  }
  
  // 获取遗物价格
  getRelicPrice(relic) {
    if (relic.rarity === RELIC_RARITY.SHOP) return 200; // 商店遗物固定200
    if (relic.rarity === RELIC_RARITY.RARE) return 300;
    if (relic.rarity === RELIC_RARITY.UNCOMMON) return 150;
    return 100; // COMMON
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

