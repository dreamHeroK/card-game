import { describe, it, expect, beforeEach } from 'vitest';
import { ShopSystem } from '../ShopSystem.js';
import { GameState } from '../GameState.js';
import { CHARACTER, RELIC_RARITY } from '../../types/index.js';

describe('商店遗物生成', () => {
  let player;
  let shop;

  beforeEach(() => {
    player = new GameState(CHARACTER.IRONCLAD);
    shop = new ShopSystem(player);
  });

  it('应该生成3件遗物', () => {
    expect(shop.relics.length).toBe(3);
  });

  it('最右边一件遗物应该是SHOP类型', () => {
    const lastRelic = shop.relics[shop.relics.length - 1];
    expect(lastRelic).toBeDefined();
    expect(lastRelic.rarity).toBe(RELIC_RARITY.SHOP);
  });

  it('前两件遗物不应该是BOSS或SHOP类型', () => {
    for (let i = 0; i < 2; i++) {
      const relic = shop.relics[i];
      expect(relic).toBeDefined();
      expect(relic.rarity).not.toBe(RELIC_RARITY.BOSS);
      expect(relic.rarity).not.toBe(RELIC_RARITY.SHOP);
      expect(relic.rarity).not.toBe(RELIC_RARITY.SPECIAL);
    }
  });

  it('每件遗物应该有价格', () => {
    shop.relics.forEach(relic => {
      expect(relic.price).toBeDefined();
      expect(typeof relic.price).toBe('number');
      expect(relic.price).toBeGreaterThan(0);
    });
  });

  it('SHOP类型遗物价格应该是200', () => {
    const shopRelic = shop.relics.find(relic => relic.rarity === RELIC_RARITY.SHOP);
    expect(shopRelic).toBeDefined();
    expect(shopRelic.price).toBe(200);
  });

  it('遗物价格应该根据稀有度正确设置', () => {
    shop.relics.forEach(relic => {
      if (relic.rarity === RELIC_RARITY.SHOP) {
        expect(relic.price).toBe(200);
      } else if (relic.rarity === RELIC_RARITY.RARE) {
        expect(relic.price).toBe(300);
      } else if (relic.rarity === RELIC_RARITY.UNCOMMON) {
        expect(relic.price).toBe(150);
      } else if (relic.rarity === RELIC_RARITY.COMMON) {
        expect(relic.price).toBe(100);
      }
    });
  });

  it('应该能够购买遗物', () => {
    const initialGold = player.gold;
    const initialRelicsCount = player.relics.length;
    const relic = shop.relics[0];
    
    // 确保有足够的金币
    player.gold = relic.price;
    
    const success = shop.buyRelic(0);
    
    expect(success).toBe(true);
    expect(player.gold).toBe(0);
    expect(player.relics.length).toBe(initialRelicsCount + 1);
    expect(shop.relics.length).toBe(2); // 遗物数量减少
  });

  it('金币不足时不应该能够购买遗物', () => {
    const initialGold = player.gold;
    const initialRelicsCount = player.relics.length;
    const relic = shop.relics[0];
    
    // 设置金币不足
    player.gold = relic.price - 1;
    
    const success = shop.buyRelic(0);
    
    expect(success).toBe(false);
    expect(player.gold).toBe(relic.price - 1);
    expect(player.relics.length).toBe(initialRelicsCount);
    expect(shop.relics.length).toBe(3); // 遗物数量不变
  });
});

