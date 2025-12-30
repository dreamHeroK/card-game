// 战斗系统
export class BattleSystem {
  constructor(player, enemies) {
    this.player = player;
    this.enemies = Array.isArray(enemies) ? enemies : [enemies];
    this.turn = 0;
    this.playerTurn = true;
    this.hand = [];
    this.drawPile = [];
    this.discardPile = [];
    this.exhaustPile = [];
    this.energy = 3;
    this.maxEnergy = 3;
    this.block = 0;
  }

  // 初始化战斗
  initBattle() {
    this.turn = 1; // 从第1回合开始（第一回合是玩家回合）
    this.playerTurn = true;
    this.energy = this.maxEnergy;
    this.block = 0;
    this.shuffleDeck();
    this.drawCards(5);
  }

  // 洗牌
  shuffleDeck() {
    this.drawPile = [...this.player.deck];
    this.discardPile = [];
    // Fisher-Yates洗牌算法
    for (let i = this.drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
    }
  }

  // 抽牌
  drawCards(count) {
    for (let i = 0; i < count; i++) {
      if (this.drawPile.length === 0) {
        this.shuffleDiscardIntoDraw();
        if (this.drawPile.length === 0) break;
      }
      this.hand.push(this.drawPile.shift());
    }
  }

  // 将弃牌堆洗入抽牌堆
  shuffleDiscardIntoDraw() {
    this.drawPile = [...this.discardPile];
    this.discardPile = [];
    for (let i = this.drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
    }
  }

  // 打出卡牌
  playCard(cardIndex, targetIndex = 0) {
    if (cardIndex < 0 || cardIndex >= this.hand.length) return false;
    
    const card = this.hand[cardIndex];
    const cost = this.getCardCost(card);
    
    if (this.energy < cost) return false;
    if (targetIndex < 0 || targetIndex >= this.enemies.length) return false;

    this.energy -= cost;
    
    // 处理卡牌效果，返回伤害信息
    const damageInfo = this.applyCardEffect(card, targetIndex);
    
    // 从手牌移除
    this.hand.splice(cardIndex, 1);
    
    // 处理消耗
    if (card.exhaust) {
      this.exhaustPile.push(card);
    } else if (card.ethereal) {
      // 虚无牌回合结束时消耗
    } else {
      this.discardPile.push(card);
    }
    
    // 检查战斗状态（在造成伤害后）
    const battleState = this.checkBattleState();
    if (battleState === 'victory' || battleState === 'defeat') {
      return { status: battleState, damageInfo }; // 返回战斗状态和伤害信息
    }
    
    return { status: true, damageInfo }; // 返回成功状态和伤害信息
  }

  // 获取卡牌费用（与杀戮尖塔一致：升级后cost减少1，最低为0）
  getCardCost(card) {
    if (card.cost === 'X') return 0; // X费用需要特殊处理
    let cost = card.cost || 0;
    
    // 如果卡牌已升级，cost减少1（最低为0）
    if (card.upgraded && cost > 0) {
      cost = Math.max(0, cost - 1);
    }
    
    return cost;
  }

  // 应用卡牌效果
  applyCardEffect(card, targetIndex) {
    if (!this.enemies || this.enemies.length === 0) return null;
    if (targetIndex < 0 || targetIndex >= this.enemies.length) return null;
    
    const target = this.enemies[targetIndex];
    if (!target) return null;
    
    let damageInfo = null;
    
    // 伤害
    if (card.damage) {
      let damage = card.damage;
      
      // 力量加成
      if (this.player.strength) {
        damage += this.player.strength;
      }
      
      // 多次攻击
      if (card.hits) {
        const hits = [];
        for (let i = 0; i < card.hits; i++) {
          const result = this.dealDamage(target, damage);
          hits.push(result);
        }
        damageInfo = { targetIndex, hits, isMultiHit: true };
      } else {
        const result = this.dealDamage(target, damage);
        damageInfo = { targetIndex, ...result };
      }
    }
    
    // 格挡
    if (card.block) {
      this.block += card.block;
    }
    
    // 易伤
    if (card.vulnerable) {
      target.vulnerable = (target.vulnerable || 0) + card.vulnerable;
    }
    
    // 虚弱
    if (card.weak) {
      target.weak = (target.weak || 0) + card.weak;
    }
    
    // 力量
    if (card.strength) {
      this.player.strength = (this.player.strength || 0) + card.strength;
    }
    
    // 抽牌
    if (card.draw) {
      this.drawCards(card.draw);
    }
    
    // AOE伤害
    if (card.aoe) {
      const aoeHits = [];
      this.enemies.forEach((enemy, index) => {
        if (card.damage) {
          let damage = card.damage;
          if (this.player.strength) {
            damage += this.player.strength;
          }
          const result = this.dealDamage(enemy, damage);
          aoeHits.push({ targetIndex: index, ...result });
        }
      });
      if (aoeHits.length > 0) {
        damageInfo = { isAOE: true, hits: aoeHits };
      }
    }
    
    return damageInfo;
  }

  // 造成伤害
  dealDamage(target, damage) {
    if (!target) return { actualDamage: 0, displayedDamage: 0 };
    
    // 记录基础伤害
    const baseDamage = damage;
    
    // 易伤加成
    if (target.vulnerable > 0) {
      damage = Math.floor(damage * 1.5);
    }
    
    // 虚弱减成
    if (this.player.weak > 0) {
      damage = Math.floor(damage * 0.75);
    }
    
    // 计算实际伤害（考虑格挡）
    const blockValue = target.block || 0;
    const actualDamage = Math.max(0, damage - blockValue);
    
    // 减少敌人生命值
    const oldHp = target.hp || 0;
    target.hp = Math.max(0, oldHp - actualDamage);
    
    // 减少格挡值
    if (target.block) {
      target.block = Math.max(0, target.block - damage);
    }
    
    // 返回实际伤害和显示的伤害值（用于UI显示）
    return {
      actualDamage,
      displayedDamage: damage, // 显示的伤害（考虑易伤/虚弱，但不考虑格挡）
      baseDamage,
      blocked: Math.min(blockValue, damage)
    };
  }

  // 结束回合
  endTurn() {
    // 检查是否还在玩家回合
    if (!this.playerTurn) {
      return 'continue';
    }
    
    // 处理回合结束效果
    this.processEndTurnEffects();
    
    // 处理虚无牌（在清空手牌之前）
    const etherealCards = [];
    const normalCards = [];
    this.hand.forEach(card => {
      if (card.ethereal) {
        etherealCards.push(card);
      } else {
        normalCards.push(card);
      }
    });
    
    // 虚无牌放入消耗堆
    this.exhaustPile.push(...etherealCards);
    
    // 普通手牌放入弃牌堆
    this.discardPile.push(...normalCards);
    
    // 清空手牌
    this.hand = [];
    
    this.playerTurn = false;
    this.turn++;
    
    // 敌人回合
    const result = this.enemyTurn();
    
    // 返回战斗状态
    return result || 'continue';
  }

  // 处理回合结束效果
  processEndTurnEffects() {
    // 格挡消失（除非有路障）
    if (!this.player.relics?.some(r => r.id === 'barricade')) {
      this.block = 0;
    }
    
    // 处理玩家状态效果
    if (this.player.poison) {
      this.player.hp = Math.max(0, this.player.hp - this.player.poison);
      this.player.poison = Math.max(0, this.player.poison - 1);
    }
    
    // 处理玩家虚弱（回合结束时减少）
    if (this.player.weak > 0) {
      this.player.weak--;
    }
    
    // 处理烧伤
    this.hand.forEach(card => {
      if (card.id === 'burn') {
        this.player.hp = Math.max(0, this.player.hp - 2);
      }
    });
    
    // 处理敌人状态效果（回合结束时减少）
    this.enemies.forEach(enemy => {
      if (enemy.vulnerable > 0) {
        enemy.vulnerable--;
      }
      if (enemy.weak > 0) {
        enemy.weak--;
      }
    });
  }

  // 敌人回合
  enemyTurn() {
    // 敌人行动（使用当前turn）
    this.enemies.forEach(enemy => {
      if (enemy.hp > 0) {
        this.enemyAction(enemy);
      }
    });
    
    // 检查战斗是否结束
    const battleState = this.checkBattleState();
    if (battleState === 'victory' || battleState === 'defeat') {
      return battleState;
    }
    
    // 回合数递增，进入下一个玩家回合
    this.turn++;
    
    // 玩家回合开始
    this.startPlayerTurn();
    return 'continue';
  }

  // 获取敌人当前回合的意图（用于显示，不执行）
  // 在玩家回合显示的是下一个敌人回合的意图
  getEnemyIntent(enemy) {
    if (!enemy.intents || enemy.intents.length === 0) return null;
    
    // 计算下一个敌人回合的意图
    // 如果当前是玩家回合，显示下一个敌人回合的意图
    // 如果当前是敌人回合，显示当前敌人回合的意图
    // turn从1开始：turn=1是第一个玩家回合，turn=2是第一个敌人回合
    const enemyTurn = this.playerTurn ? this.turn + 1 : this.turn;
    
    // 使用turnPattern（回合模式）或默认循环
    // 敌人回合从2开始（第一个敌人回合是2），所以用enemyTurn - 2来计算索引
    let intentIndex;
    if (enemy.turnPattern && enemy.turnPattern.length > 0) {
      // 第一个敌人回合是turn=2，对应turnPattern[0]
      // 所以用(enemyTurn - 2)来计算patternIndex
      const patternIndex = (enemyTurn - 2) % enemy.turnPattern.length;
      // 确保patternIndex非负
      const safePatternIndex = patternIndex < 0 ? patternIndex + enemy.turnPattern.length : patternIndex;
      intentIndex = enemy.turnPattern[safePatternIndex];
    } else {
      const safeIndex = (enemyTurn - 2) % enemy.intents.length;
      intentIndex = safeIndex < 0 ? safeIndex + enemy.intents.length : safeIndex;
    }
    
    // 确保intentIndex有效
    if (intentIndex < 0 || intentIndex >= enemy.intents.length) {
      intentIndex = 0; // 默认使用第一个意图
    }
    
    const intent = enemy.intents[intentIndex];
    if (!intent) return null;
    
    // 返回格式化的意图信息
    return this.formatIntent(intent, enemy);
  }
  
  // 格式化意图信息（用于UI显示）
  formatIntent(intent, enemy) {
    const baseValue = intent.value || 0;
    const enemyStrength = enemy.strength || 0;
    
    // 根据意图类型格式化显示
    switch (intent.type) {
      // 攻击类意图
      case 'attack':
      case 'stab':
      case 'chomp':
      case 'thrash':
      case 'rush':
      case 'tackle':
      case 'bite':
      case 'flame_tackle':
      case 'bolt':
      case 'sear':
      case 'skull_bash': {
        const attackDamage = baseValue + enemyStrength;
        return {
          type: 'attack',
          icon: '⚔️',
          text: `攻击 ${attackDamage}`,
          damage: attackDamage,
          description: `造成${attackDamage}点伤害`
        };
      }
      
      // 强化类意图
      case 'ritual':
        return {
          type: 'buff',
          icon: '⬆️',
          text: `强化 +${baseValue || 3}`,
          value: baseValue || 3,
          description: `获得${baseValue || 3}点力量`
        };
      case 'bellow':
      case 'grow':
        return {
          type: 'buff',
          icon: '⬆️',
          text: '强化 +3',
          value: 3,
          description: '获得3点力量'
        };
      
      // 状态类意图
      case 'weak':
      case 'lick':
      case 'spit_web':
      case 'beam':
        return {
          type: 'debuff',
          icon: '⬇️',
          text: '虚弱',
          value: baseValue || 1,
          description: `给予${baseValue || 1}层虚弱`
        };
      case 'vulnerable':
        return {
          type: 'debuff',
          icon: '⬇️',
          text: '易伤',
          value: baseValue || 1,
          description: `给予${baseValue || 1}层易伤`
        };
      case 'entangle':
        return {
          type: 'debuff',
          icon: '🔒',
          text: '缠绕',
          description: '无法打出攻击牌'
        };
      
      // 格挡类意图
      case 'charge_up':
      case 'defensive_mode':
      case 'curl_up':
        return {
          type: 'block',
          icon: '🛡️',
          text: `格挡 ${baseValue || 15}`,
          value: baseValue || 15,
          description: `获得${baseValue || 15}点格挡`
        };
      
      // 特殊意图
      case 'sleep':
        return {
          type: 'special',
          icon: '😴',
          text: '睡觉',
          description: '不行动，但获得力量'
        };
      case 'activate':
        return {
          type: 'special',
          icon: '⚡',
          text: '激活',
          description: '激活状态'
        };
      case 'inferno': {
        const infernoDamage = Math.floor(this.player.maxHp / 12);
        return {
          type: 'attack',
          icon: '🔥',
          text: `火焰 ${infernoDamage}`,
          damage: infernoDamage,
          description: `造成${infernoDamage}点火焰伤害`
        };
      }
      case 'split':
        return {
          type: 'special',
          icon: '💥',
          text: '分裂',
          description: '生命值低于50%时分裂'
        };
      
      default:
        return {
          type: 'unknown',
          icon: '❓',
          text: '未知',
          description: '未知意图'
        };
    }
  }

  // 敌人行动
  enemyAction(enemy) {
    if (!enemy.intents || enemy.intents.length === 0) return;
    
    // 使用turnPattern（回合模式）或默认循环
    let intentIndex;
    if (enemy.turnPattern && enemy.turnPattern.length > 0) {
      const patternIndex = (this.turn - 1) % enemy.turnPattern.length;
      intentIndex = enemy.turnPattern[patternIndex];
    } else {
      intentIndex = (this.turn - 1) % enemy.intents.length;
    }
    
    const intent = enemy.intents[intentIndex];
    if (!intent) return;
    
    switch (intent.type) {
      // 攻击类
      case 'attack':
      case 'stab':
      case 'chomp':
      case 'thrash':
      case 'rush':
      case 'tackle':
      case 'bite':
      case 'flame_tackle':
      case 'bolt':
      case 'sear':
        this.enemyAttack(enemy, (intent.value || 0) + (enemy.strength || 0));
        break;
      
      // 强化类
      case 'ritual':
        enemy.strength = (enemy.strength || 0) + (intent.value || 3);
        break;
      case 'bellow':
        enemy.strength = (enemy.strength || 0) + 3;
        break;
      case 'grow':
        enemy.strength = (enemy.strength || 0) + 3;
        break;
      
      // 状态类
      case 'weak':
        this.player.weak = (this.player.weak || 0) + (intent.value || 1);
        break;
      case 'vulnerable':
        this.player.vulnerable = (this.player.vulnerable || 0) + (intent.value || 1);
        break;
      case 'entangle': // 缠绕（无法打出攻击牌）
        this.player.entangled = (this.player.entangled || 0) + 1;
        break;
      case 'lick': // 给予虚弱
        this.player.weak = (this.player.weak || 0) + 1;
        break;
      case 'spit_web': // 给予虚弱
        this.player.weak = (this.player.weak || 0) + 1;
        break;
      case 'beam': // 给予虚弱
        this.player.weak = (this.player.weak || 0) + 1;
        break;
      
      // 格挡类
      case 'charge_up':
      case 'defensive_mode':
        enemy.block = (enemy.block || 0) + (intent.value || 15);
        break;
      
      // 特殊行为
      case 'sleep': // 睡觉（乐加维林）
        // 前3回合睡觉，不行动
        break;
      case 'siphon_soul': // 减少力量
        this.player.strength = Math.max(0, (this.player.strength || 0) - 2);
        break;
      case 'split': // 分裂（史莱姆Boss）
        if (enemy.hp <= enemy.maxHp * 0.5) {
          // 分裂成两个小史莱姆（简化处理，只恢复生命）
          enemy.hp = Math.min(enemy.maxHp, enemy.hp + 50);
        }
        break;
      case 'activate': // 激活（六火亡魂）
        // 第一回合激活，不行动
        break;
      case 'inferno': { // 火焰攻击（六火亡魂）
        // 每6回合使用，对所有敌人造成伤害（这里简化为对玩家造成伤害）
        const infernoDamage = Math.floor(this.player.maxHp / 12);
        this.enemyAttack(enemy, infernoDamage);
        break;
      }
      case 'skull_bash': // 头槌（地精大块头）
        this.enemyAttack(enemy, intent.value || 6);
        this.player.vulnerable = (this.player.vulnerable || 0) + 1;
        break;
      
      default:
        console.warn('Unknown intent type:', intent.type);
        break;
    }
  }

  // 敌人攻击
  enemyAttack(enemy, damage) {
    // 虚弱减成
    if (enemy.weak > 0) {
      damage = Math.floor(damage * 0.75);
    }
    
    const actualDamage = Math.max(0, damage - this.block);
    this.player.hp = Math.max(0, this.player.hp - actualDamage);
    this.block = Math.max(0, this.block - damage);
    
    // 减少虚弱层数
    if (enemy.weak > 0) {
      enemy.weak--;
    }
  }

  // 开始玩家回合
  startPlayerTurn() {
    this.playerTurn = true;
    this.energy = this.maxEnergy;
    this.drawCards(5);
    
    // 处理回合开始效果
    if (this.player.relics?.some(r => r.id === 'lantern')) {
      this.energy++;
    }
  }

  // 检查战斗状态
  checkBattleState() {
    if (this.player.hp <= 0) {
      return 'defeat';
    }
    if (this.enemies.every(e => e.hp <= 0)) {
      return 'victory';
    }
    return 'continue';
  }
}

