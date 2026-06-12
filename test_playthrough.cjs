/**
 * 完整流程测试：从主菜单到通关
 * 验证 buff 修复：非永久 buff 不应带入下一场战斗
 */
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5174';
const SLOW_MO = 150;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function screenshot(page, label) {
  const file = `test_ss_${label}.png`;
  await page.screenshot({ path: file });
  console.log(`  [截图] ${file}`);
}

// 检测当前显示的是哪个界面
async function detectScreen(page) {
  return page.evaluate(() => {
    if (document.querySelector('.screen-victory'))   return 'VICTORY';
    if (document.querySelector('.screen-game-over')) return 'GAME_OVER';
    if (document.querySelector('.battle-screen'))    return 'BATTLE';
    if (document.querySelector('.reward-screen'))    return 'BATTLE_REWARD';
    if (document.querySelector('.rest-screen'))      return 'REST';
    if (document.querySelector('.event-screen'))     return 'EVENT';
    if (document.querySelector('.shop-screen'))      return 'SHOP';
    if (document.querySelector('.map-screen'))       return 'MAP';
    if (document.querySelector('.app-main-menu'))    return 'MAIN_MENU';
    return 'UNKNOWN';
  });
}

// 读取玩家当前的 buff 状态（用于验证修复）
async function getPlayerEffects(page) {
  return page.evaluate(() => {
    const badges = document.querySelectorAll('.player-area .status-badge');
    return Array.from(badges).map(b => b.textContent.trim());
  });
}

// 从地图界面读取 HP
async function getMapHpPct(page) {
  return page.evaluate(() => {
    const txt = document.querySelector('.map-header-right .stat-chip')?.textContent || '';
    const m = txt.match(/(\d+)\/(\d+)/);
    return m ? parseInt(m[1]) / parseInt(m[2]) : 1;
  }).catch(() => 1);
}

// 读取战斗信息（含敌人意图）
async function getBattleInfo(page) {
  return page.evaluate(() => {
    const hpText = document.querySelector('.topbar-item .hp-bar-text')?.textContent || '?/?';
    const energyText = document.querySelector('.energy-value')?.textContent || '?/?';
    const handCount = document.querySelectorAll('.battle-card').length;
    const playableCount = document.querySelectorAll('.battle-card:not(.disabled)').length;
    const isPlayerTurn = !document.querySelector('.enemy-turn-overlay');
    const enemies = Array.from(document.querySelectorAll('.enemy-card:not(.dead)')).map(e => {
      const intentEl = e.querySelector('.intent-display span');
      const intentText = intentEl?.textContent || '';
      // 从意图文字解析伤害：如 "攻击 54" 或 "攻击 15 x3"
      const dmgMatch = intentText.match(/攻击\s*(\d+)(?:\s*x(\d+))?/);
      const dmg = dmgMatch ? parseInt(dmgMatch[1]) * (dmgMatch[2] ? parseInt(dmgMatch[2]) : 1) : 0;
      return {
        name: e.querySelector('.enemy-name')?.textContent,
        hp: e.querySelector('.hp-bar-text')?.textContent,
        intentText,
        incomingDamage: dmg,
        isAttacking: intentText.includes('攻击') || intentText.includes('爪') || intentText.includes('击'),
      };
    });
    return { hpText, energyText, handCount, playableCount, isPlayerTurn, enemies };
  });
}

// ===== 各界面处理函数 =====

async function handleMainMenu(page) {
  console.log('  点击"开始新游戏"');
  await page.click('.menu-start-btn');
  await sleep(800);
}

async function handleMap(page) {
  await page.waitForSelector('.map-node', { timeout: 5000 }).catch(() => {});

  const availableNodes = await page.$$('.map-node.available');
  if (availableNodes.length === 0) {
    console.log('  没有可用节点，等待...');
    await sleep(1000);
    return;
  }

  const nodeInfo = await page.evaluate(() => {
    const nodes = document.querySelectorAll('.map-node.available');
    return Array.from(nodes).map(n => ({
      cls: [...n.classList].find(c => c.startsWith('map-node-') && !['map-node','map-node-anchor'].includes(c) && !['available','visited','current'].some(x=>c.includes(x))) || '',
      title: n.getAttribute('title') || '',
    }));
  });

  console.log(`  可用节点: ${nodeInfo.map(n => n.title.split(' ')[0]).join(', ')}`);

  const hpPct = await getMapHpPct(page);
  console.log(`  当前 HP ${Math.round(hpPct * 100)}%`);

  // 根据 HP 动态调整优先级
  let priority;
  if (hpPct < 0.45) {
    // 血量危险，必须休息
    priority = ['map-node-rest', 'map-node-event', 'map-node-treasure', 'map-node-shop', 'map-node-battle', 'map-node-elite', 'map-node-boss'];
  } else if (hpPct < 0.65) {
    // 血量偏低，优先休息，但战斗可接受
    priority = ['map-node-rest', 'map-node-battle', 'map-node-event', 'map-node-treasure', 'map-node-shop', 'map-node-elite', 'map-node-boss'];
  } else {
    // 血量充足，优先战斗
    priority = ['map-node-battle', 'map-node-elite', 'map-node-rest', 'map-node-event', 'map-node-treasure', 'map-node-boss', 'map-node-shop'];
  }

  let clicked = false;
  for (const cls of priority) {
    const node = await page.$(`.map-node.available.${cls}`);
    if (node) {
      const title = await node.getAttribute('title');
      console.log(`  选择节点: ${title}`);
      await node.click();
      clicked = true;
      break;
    }
  }
  if (!clicked) {
    await availableNodes[0].click();
  }
  await sleep(1000);
}

async function handleBattle(page, battleCount) {
  console.log(`\n  === 战斗 #${battleCount} ===`);

  if (battleCount > 1) {
    const effects = await getPlayerEffects(page);
    if (effects.length > 0) {
      console.log(`  ❌ BUG：战斗开始时玩家有遗留 buff: [${effects.join(', ')}]`);
    } else {
      console.log(`  ✅ Buff 修复验证通过：effects 为空`);
    }
  }

  await screenshot(page, `battle${battleCount}_start`);

  let turnCount = 0;
  const MAX_TURNS = 50;

  while (turnCount < MAX_TURNS) {
    turnCount++;
    const screen = await detectScreen(page);
    if (screen !== 'BATTLE') {
      console.log(`  战斗结束，进入: ${screen}`);
      break;
    }

    // 等待玩家回合（最多8秒）
    await page.waitForFunction(
      () => !document.querySelector('.enemy-turn-overlay'),
      { timeout: 8000 }
    ).catch(() => {});

    const info = await getBattleInfo(page);
    if (!info.isPlayerTurn) { await sleep(500); continue; }

    const energy = parseInt((info.energyText || '0').split('/')[0]);
    console.log(`  回合 ${turnCount}: HP=${info.hpText} 能量=${energy} 手牌=${info.handCount}(可出${info.playableCount}) 敌人=${info.enemies.length}`);

    // 根据 HP 和敌人意图动态调整出牌优先级
    const hpParts = info.hpText.split('/');
    const curHp = parseInt(hpParts[0]) || 1;
    const maxHp = parseInt(hpParts[1]) || 80;
    const battleHpPct = curHp / maxHp;

    // 计算敌人本回合总伤害威胁
    const totalIncoming = info.enemies.reduce((s, e) => s + (e.incomingDamage || 0), 0);
    const mustBlock = totalIncoming > curHp * 0.6; // 即将受到超过当前 HP 60% 的伤害

    // 智能决策：威胁大时优先格挡，否则优先输出
    const TYPE_PRIORITY = (mustBlock || battleHpPct < 0.2)
      ? ['SKILL', 'ATTACK', 'POWER', 'STATUS']
      : ['ATTACK', 'POWER', 'SKILL', 'STATUS'];

    if (totalIncoming > 0) {
      console.log(`    敌人意图: ${info.enemies.map(e => e.intentText).join(', ')} → 威胁 ${totalIncoming} 伤害 ${mustBlock ? '(优先格挡)' : '(优先攻击)'}`);
    }

    for (let attempt = 0; attempt < 10; attempt++) {
      const curScreen = await detectScreen(page);
      if (curScreen !== 'BATTLE') break;

      // 如果在瞄准状态，先选择目标
      const targeting = await page.$('.targeting-hint');
      if (targeting) {
        const target = await page.$('.enemy-card.targetable:not(.dead)');
        if (target) {
          await target.click();
          await sleep(350);
          continue;
        }
      }

      // 重新读取能量
      const curEnergy = await page.$eval('.energy-value', el => parseInt(el.textContent)).catch(() => 0);
      if (curEnergy <= 0) break;

      // 按优先级找可出的牌（ATTACK > POWER > SKILL > STATUS）
      let played = false;
      for (const typePref of TYPE_PRIORITY) {
        const handle = await page.evaluateHandle(({ type, energy }) => {
          const cards = Array.from(document.querySelectorAll('.battle-card:not(.disabled)'));
          for (const card of cards) {
            const t = card.querySelector('.card-type')?.textContent || '';
            const c = parseInt(card.querySelector('.card-cost')?.textContent || '9');
            if (t.includes(type) && c <= energy) return card;
          }
          return null;
        }, { type: typePref, energy: curEnergy });

        const el = handle.asElement();
        if (el) { await el.click(); await sleep(350); played = true; break; }
      }

      // 没找到优先类型时，打第一张可出的
      if (!played) {
        const first = await page.$('.battle-card:not(.disabled)');
        if (!first) break;
        const costEl = await first.$('.card-cost');
        const cost = costEl ? parseInt(await costEl.textContent()) : 0;
        if (curEnergy < cost) break;
        await first.click();
        await sleep(350);
      }
    }

    // 结束回合
    const endBtn = await page.$('.end-turn-btn:not(.disabled):not([disabled])');
    if (endBtn) {
      await endBtn.click();
      await sleep(400);
    }

    // 等待敌方回合（至少1100ms覆盖900ms setTimeout）
    await sleep(1300);
  }

  await screenshot(page, `battle${battleCount}_end`);
}

async function handleBattleReward(page) {
  console.log('  战斗奖励');

  // Boss 遗物优先
  const bossRelic = await page.$('.boss-relic-card');
  if (bossRelic) {
    console.log('  选择 Boss 遗物');
    await bossRelic.click();
    await sleep(800);
    return;
  }

  // 选择 ATTACK 类型的卡牌（优先），否则选第一张
  const cardData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.reward-card'));
    return cards.map((c, i) => ({
      idx: i,
      type: c.querySelector('.reward-card-type')?.textContent || '',
      name: c.querySelector('.reward-card-name')?.textContent || '',
    }));
  });

  if (cardData.length > 0) {
    // 优先选 ATTACK，其次选第一张
    const attackIdx = cardData.findIndex(c => c.type === 'ATTACK');
    const choiceIdx = attackIdx >= 0 ? attackIdx : 0;
    console.log(`  选择卡牌: ${cardData[choiceIdx].name} (${cardData[choiceIdx].type})`);
    const cards = await page.$$('.reward-card');
    if (cards[choiceIdx]) {
      await cards[choiceIdx].click();
      await sleep(800);
      return;
    }
  }

  // 没有卡牌可选时跳过
  const skipBtn = await page.$('.skip-btn');
  if (skipBtn) {
    console.log('  跳过（无合适卡牌）');
    await skipBtn.click();
    await sleep(800);
  }
}

async function handleRest(page) {
  console.log('  休息点');
  const hp = await page.$eval('.rest-hp', el => {
    const m = el.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    return m ? { cur: parseInt(m[1]), max: parseInt(m[2]) } : { cur: 99, max: 99 };
  }).catch(() => ({ cur: 99, max: 99 }));

  const hpPct = hp.cur / hp.max;
  if (hpPct < 0.85) {
    console.log(`  HP ${hp.cur}/${hp.max}，选择休息恢复`);
    const healBtn = await page.$('.rest-option-btn');
    if (healBtn) { await healBtn.click(); await sleep(500); }
  } else {
    // HP满，选升级一张牌（优先升 Strike 或 Bash）
    console.log(`  HP ${hp.cur}/${hp.max}，尝试升级牌`);
    const upgradeable = await page.$('.deck-card-item:not(.card-grayed)');
    if (upgradeable) {
      await upgradeable.click();
      await sleep(500);
      const confirm = await page.$('.btn-confirm');
      if (confirm) { await confirm.click(); await sleep(500); }
    } else {
      const leaveBtn = await page.$('.leave-rest-btn');
      if (leaveBtn) { await leaveBtn.click(); await sleep(500); }
    }
  }

  // 确保离开（heal 后回到地图，smith 后停留）
  await sleep(800);
  const curScreen = await detectScreen(page);
  if (curScreen === 'REST') {
    const leaveBtn = await page.$('.leave-rest-btn');
    if (leaveBtn) { await leaveBtn.click(); await sleep(500); }
  }
}

async function handleEvent(page) {
  console.log('  事件');
  const continueBtn = await page.$('.event-continue-btn');
  if (continueBtn) {
    await continueBtn.click();
    await sleep(500);
    return;
  }
  const choices = await page.$$('.event-choice-btn');
  if (choices.length > 0) {
    const text = await choices[0].textContent();
    console.log(`  选择: ${text.trim().substring(0, 40)}`);
    await choices[0].click();
    await sleep(800);
  }
  const cont = await page.$('.event-continue-btn');
  if (cont) { await cont.click(); await sleep(500); }
}

async function handleShop(page) {
  console.log('  商店：直接离开');
  const leaveBtn = await page.$('.leave-shop-btn');
  if (leaveBtn) { await leaveBtn.click(); await sleep(500); }
}

// ===== 主函数 =====

async function runAttempt(page, attemptNum, results) {
  console.log(`\n====== 第 ${attemptNum} 次尝试 ======`);

  // 如果不是主菜单，先重新开始
  let screen = await detectScreen(page);
  if (screen !== 'MAIN_MENU') {
    await handleMainMenu(page).catch(() => {});
    await sleep(1000);
    screen = await detectScreen(page);
  }

  let battleCount = 0;
  let round = 0;
  const MAX_ROUNDS = 120;

  while (round < MAX_ROUNDS) {
    round++;
    screen = await detectScreen(page);

    if (screen === 'VICTORY') {
      await screenshot(page, `attempt${attemptNum}_VICTORY`);
      console.log(`\n🎉 第 ${attemptNum} 次尝试通关！经历 ${battleCount} 场战斗`);
      console.log(`Buff 修复验证：${results.buffsOk} 次通过，${results.bugsFound} 次发现遗留 buff`);
      return 'VICTORY';
    }

    if (screen === 'GAME_OVER') {
      await screenshot(page, `attempt${attemptNum}_GAME_OVER`);
      console.log(`\n💀 第 ${attemptNum} 次尝试失败（${round} 步，${battleCount} 场战斗）`);
      // 点击重新开始
      const restartBtn = await page.$('.overlay-btn-gameover');
      if (restartBtn) { await restartBtn.click(); await sleep(1000); }
      return 'GAME_OVER';
    }

    if (round % 10 === 0) console.log(`  [步骤 ${round}] screen=${screen}`);

    switch (screen) {
      case 'MAIN_MENU':
        await handleMainMenu(page);
        break;
      case 'MAP':
        await handleMap(page);
        break;
      case 'BATTLE':
        battleCount++;
        results.battles++;
        if (battleCount > 1) {
          const effects = await getPlayerEffects(page);
          if (effects.length > 0) results.bugsFound++;
          else results.buffsOk++;
        }
        await handleBattle(page, battleCount);
        break;
      case 'BATTLE_REWARD':
        await handleBattleReward(page);
        break;
      case 'REST':
        await handleRest(page);
        break;
      case 'EVENT':
        await handleEvent(page);
        break;
      case 'SHOP':
        await handleShop(page);
        break;
      default:
        await sleep(1500);
    }

    await sleep(200);
  }

  return 'TIMEOUT';
}

(async () => {
  console.log('=== STS2 完整流程测试（持续尝试直到通关）===\n');

  const browser = await chromium.launch({ headless: false, slowMo: SLOW_MO });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  page.on('console', m => {
    if (m.type() === 'error') console.log('[JS Error]', m.text().substring(0, 100));
  });

  await page.goto(BASE_URL);
  await sleep(2000);

  const results = { battles: 0, buffsOk: 0, bugsFound: 0 };
  const MAX_ATTEMPTS = 8;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const outcome = await runAttempt(page, attempt, results);
    if (outcome === 'VICTORY') break;
    if (attempt === MAX_ATTEMPTS) {
      console.log(`\n⏰ ${MAX_ATTEMPTS} 次尝试均未通关`);
    }
    await sleep(800);
  }

  console.log(`\n总计: ${results.battles} 场战斗，Buff 验证 ${results.buffsOk} 通过，${results.bugsFound} 个遗留`);
  await sleep(2000);
  await browser.close();

  console.log('\n=== 测试完成 ===');
  process.exit(results.bugsFound > 0 ? 1 : 0);
})().catch(e => {
  console.error('\n测试出错:', e.message);
  process.exit(1);
});
