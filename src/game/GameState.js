// 游戏状态管理
import { BattleSystem } from './BattleSystem.js';
import { ShopSystem } from './ShopSystem.js';
import { MapSystem } from './MapSystem.js';
import { CHARACTER } from '../types/index.js';
import { getCardsByCharacter } from '../data/cards.js';
import { getRandomRelic } from '../data/relics.js';
import { getRandomPotion } from '../data/potions.js';

export class GameState {
  constructor(character = CHARACTER.IRONCLAD) {
    this.character = character;
    this.act = 1;
    this.maxHp = this.getStartingMaxHp(character);
    this.hp = this.maxHp;
    this.gold = 99;
    this.deck = this.getStartingDeck(character);
    this.relics = [this.getStartingRelic(character)];
    this.potions = [];
    this.strength = 0;
    this.dexterity = 0;
    this.focus = 0;
    this.weak = 0;
    this.vulnerable = 0;
    this.frail = 0;
    this.poison = 0;
    this.map = new MapSystem(this.act);
    this.battle = null;
    this.shop = null;
    this.currentEvent = null;
    this.currentScreen = 'map'; // map, battle, shop, rest, event, treasure
  }
  
  // 获取当前层数
  get floor() {
    const currentNode = this.map.getCurrentNode();
    return currentNode ? currentNode.floor : 0;
  }

  // 获取起始最大生命
  getStartingMaxHp(character) {
    switch (character) {
      case CHARACTER.IRONCLAD:
        return 80;
      case CHARACTER.SILENT:
        return 70;
      case CHARACTER.DEFECT:
        return 75;
      case CHARACTER.WATCHER:
        return 72;
      default:
        return 80;
    }
  }

  // 获取起始牌组
  getStartingDeck(character) {
    const cards = getCardsByCharacter(character);
    const startingDeck = [];
    
    // 基础牌组：5张打击，4张防御，1张重击（铁甲战士）
    if (character === CHARACTER.IRONCLAD) {
      for (let i = 0; i < 5; i++) {
        startingDeck.push(cards.find(c => c.id === 'strike'));
      }
      for (let i = 0; i < 4; i++) {
        startingDeck.push(cards.find(c => c.id === 'defend'));
      }
      startingDeck.push(cards.find(c => c.id === 'bash'));
    }
    
    return startingDeck;
  }

  // 获取起始遗物
  getStartingRelic(character) {
    switch (character) {
      case CHARACTER.IRONCLAD:
        return { id: 'burning_blood', name: '燃烧之血', rarity: 'boss', description: '战斗结束时，恢复6点生命。' };
      case CHARACTER.SILENT:
        return { id: 'ring_of_the_snake', name: '蛇之戒指', rarity: 'boss', description: '每场战斗开始时，抽2张牌。' };
      case CHARACTER.DEFECT:
        return { id: 'cracked_core', name: '破碎核心', rarity: 'boss', description: '战斗开始时，充能1个充能球栏位。' };
      case CHARACTER.WATCHER:
        return { id: 'pure_water', name: '纯净之水', rarity: 'boss', description: '战斗开始时，将1张奇迹加入手牌。' };
      default:
        return { id: 'burning_blood', name: '燃烧之血', rarity: 'boss', description: '战斗结束时，恢复6点生命。' };
    }
  }

  // 开始战斗
  startBattle(monster) {
    const enemies = Array.isArray(monster) ? monster : [monster];
    this.battle = new BattleSystem(this, enemies);
    this.battle.initBattle();
    this.currentScreen = 'battle';
    return this.battle;
  }

  // 结束战斗
  endBattle(victory) {
    if (victory) {
      // 生成战斗奖励
      this.battleReward = this.generateBattleReward();
      
      // 检查是否是boss节点
      const currentNode = this.map.getCurrentNode();
      if (currentNode && currentNode.type === 'boss') {
        // Boss奖励更丰厚
        this.battleReward.gold += 50;
        this.battleReward.isBoss = true;
      }
      
      // 显示奖励界面（battle暂时保留，直到接受奖励）
      this.currentScreen = 'battle_reward';
    } else {
      // 失败时直接清除
      this.battle = null;
      this.currentScreen = 'map';
    }
  }
  
  // 生成战斗奖励
  generateBattleReward() {
    const currentNode = this.map.getCurrentNode();
    const isElite = currentNode && (currentNode.type === 'elite' || currentNode.type === 'monster' && currentNode.data?.isElite);
    const isBoss = currentNode && currentNode.type === 'boss';
    
    // 基础金币奖励
    let gold = 10 + Math.floor(Math.random() * 10);
    if (isElite) gold += 20;
    if (isBoss) gold += 50;
    
    // 生成卡牌选择（3选1）
    const cardChoices = this.generateCardChoices(3);
    
    // 生成遗物（精英和boss才有）
    let relic = null;
    if (isElite || isBoss) {
      relic = getRandomRelic(isBoss ? 'boss' : null);
    }
    
    // 生成药水（30%概率）
    let potion = null;
    if (Math.random() < 0.3) {
      potion = getRandomPotion();
    }
    
    return {
      gold,
      cardChoices,
      relic,
      potion,
      isElite: !!isElite,
      isBoss: !!isBoss
    };
  }
  
  // 生成卡牌选择
  generateCardChoices(count = 3) {
    const allCards = getCardsByCharacter(this.character);
    const choices = [];
    
    // 随机选择卡牌（避免重复）
    const selected = new Set();
    while (choices.length < count && selected.size < allCards.length) {
      const randomIndex = Math.floor(Math.random() * allCards.length);
      if (!selected.has(randomIndex)) {
        selected.add(randomIndex);
        choices.push({ ...allCards[randomIndex] });
      }
    }
    
    return choices;
  }
  
  // 接受战斗奖励
  acceptBattleReward(selectedCardIndex = null, acceptRelic = true, acceptPotion = true) {
    if (!this.battleReward) return;
    
    // 获得金币
    this.gold += this.battleReward.gold;
    
    // 选择卡牌
    if (selectedCardIndex !== null && this.battleReward.cardChoices[selectedCardIndex]) {
      const selectedCard = this.battleReward.cardChoices[selectedCardIndex];
      this.deck.push(selectedCard);
    }
    
    // 获得遗物
    if (acceptRelic && this.battleReward.relic) {
      this.relics.push(this.battleReward.relic);
    }
    
    // 获得药水
    if (acceptPotion && this.battleReward.potion) {
      this.potions.push(this.battleReward.potion);
    }
    
    // 恢复生命（燃烧之血）
    if (this.relics.some(r => r.id === 'burning_blood')) {
      this.hp = Math.min(this.maxHp, this.hp + 6);
    }
    
    // 检查是否是boss节点
    const currentNode = this.map.getCurrentNode();
    if (currentNode && currentNode.type === 'boss') {
      // 标记boss节点为已访问
      this.map.visitNode(currentNode.id);
      
      // 检查是否需要进入下一层（act < 3表示还有下一层）
      if (this.act < 3) {
        // Boss胜利，进入下一层
        this.nextAct();
      }
    }
    
    // 清除奖励和战斗
    this.battleReward = null;
    this.battle = null;
    this.currentScreen = 'map';
  }
  
  // 进入下一层
  nextAct() {
    this.act++;
    // 生成新的地图
    this.map = new MapSystem(this.act);
    // 重置当前节点（让玩家选择起始节点）
    this.map.currentNodeId = null;
  }

  // 进入商店
  enterShop() {
    this.shop = new ShopSystem(this);
    this.currentScreen = 'shop';
  }

  // 离开商店
  leaveShop() {
    this.shop = null;
    this.currentScreen = 'map';
    // 商店节点已经访问过了，不需要再次标记
  }

  // 进入休息处
  enterRest() {
    this.currentScreen = 'rest';
  }
  
  // 进入事件
  enterEvent(event) {
    this.currentEvent = event;
    this.currentScreen = 'event';
  }
  
  // 离开事件
  leaveEvent() {
    this.currentEvent = null;
    this.currentScreen = 'map';
  }

  // 休息
  rest() {
    this.hp = this.maxHp;
    this.currentScreen = 'map';
    // 休息节点已经访问过了，不需要再次标记
  }

  // 升级卡牌
  upgradeCard(cardIndex) {
    if (cardIndex < 0 || cardIndex >= this.deck.length) return false;
    const card = this.deck[cardIndex];
    if (card.upgraded) return false;
    
    // 升级卡牌（简化处理）
    card.upgraded = true;
    if (card.damage) card.damage += 2;
    if (card.block) card.block += 2;
    if (card.cost && card.cost > 0) card.cost--;
    
    return true;
  }

  // 移动到下一层（已废弃，使用handleNodeClick代替）
  moveToNextFloor() {
    // 这个方法不再使用，节点移动由handleNodeClick处理
    return null;
  }

  // 检查游戏状态
  checkGameState() {
    if (this.hp <= 0) {
      return 'defeat';
    }
    const currentNode = this.map.getCurrentNode();
    if (currentNode && currentNode.type === 'boss' && currentNode.visited && this.currentScreen === 'map') {
      return 'victory';
    }
    return 'playing';
  }
}

