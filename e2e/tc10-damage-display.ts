import { test, expect, Page } from '@playwright/test'
import { startGame, waitForBattle, waitForPlayerTurn } from './helpers'

// ── helpers (new UI selectors) ────────────────────────────────────────────────

async function goToBattle(page: Page): Promise<boolean> {
  await startGame(page)
  const battle = page.locator('.map-node-battle.available').first()
  if (await battle.count() > 0) {
    await battle.click()
  } else {
    await page.locator('.map-node.available').first().click()
  }
  const ok = await page.locator('.battle-screen').isVisible({ timeout: 6000 }).catch(() => false)
  if (!ok) { test.skip(true, '非战斗节点'); return false }
  await waitForBattle(page)
  return true
}

/** 读取玩家力量（来自 .sbadge-strength 徽章） */
async function getPlayerStrength(page: Page): Promise<number> {
  const badge = page.locator('.player-zone .sbadge-strength')
  if (!await badge.isVisible({ timeout: 500 }).catch(() => false)) return 0
  const txt = await badge.innerText()
  const m = txt.match(/\d+/)
  return m ? parseInt(m[0]) : 0
}

/** 读取第一个存活敌人的易伤层数 */
async function getEnemyVulnStacks(page: Page): Promise<number> {
  const badge = page.locator('.enemy-zone:not(.dead) .sbadge-vulnerable').first()
  if (!await badge.isVisible({ timeout: 500 }).catch(() => false)) return 0
  const txt = await badge.innerText()
  const m = txt.match(/\d+/)
  return m ? parseInt(m[0]) : 0
}

/** 悬停指定索引的手牌（先移开避免预览遮挡） */
async function hoverCard(page: Page, idx: number) {
  await page.mouse.move(640, 40)
  await page.waitForTimeout(100)
  await page.locator('.hc-frame').nth(idx).hover()
  await page.waitForTimeout(300)
}

// ── TC-10-A: 基础计算值显示 ────────────────────────────────────────────────────

test('TC-10-A: 攻击牌显示 ⚔ 计算伤害值，格挡牌显示 🛡 计算格挡值', async ({ page }) => {
  if (!await goToBattle(page)) return

  const cards = page.locator('.hc-frame')
  const count = await cards.count()
  expect(count).toBeGreaterThan(0)

  let foundDmg = false, foundBlk = false

  for (let i = 0; i < count; i++) {
    const calcDmg = await cards.nth(i).locator('.hc-calc-dmg').isVisible().catch(() => false)
    const calcBlk = await cards.nth(i).locator('.hc-calc-blk').isVisible().catch(() => false)
    if (calcDmg) foundDmg = true
    if (calcBlk) foundBlk = true
  }

  // 初始牌组：Strike（有伤害）和 Defend（有格挡）
  expect(foundDmg || foundBlk).toBe(true)
})

// ── TC-10-B: 力量 buff 使卡牌伤害数值增加 ────────────────────────────────────

test('TC-10-B: 打出炽焰(INFLAME)后，攻击牌显示的伤害值 = 基础 + 力量', async ({ page }) => {
  if (!await goToBattle(page)) return

  // 找一张攻击牌，记录当前显示的伤害值
  const strikeCard = page.locator('.hc-frame').filter({
    has: page.locator('.hc-calc-dmg')
  }).first()

  if (await strikeCard.count() === 0) {
    test.skip(true, '手牌无有伤害的攻击牌')
    return
  }

  const dmgBefore = await strikeCard.locator('.hc-calc-dmg').innerText()
  const baseDmg = parseInt(dmgBefore.replace(/\D/g, '')) || 0

  // 找炽焰（INFLAME），若没有则跳过
  const inflame = page.locator('.hc-frame:not(.hc-disabled)').filter({
    has: page.locator('.hc-name', { hasText: /炽焰|Inflame/i })
  }).first()

  if (await inflame.count() === 0) {
    test.skip(true, '手牌无炽焰牌')
    return
  }

  await inflame.click()
  await page.waitForTimeout(400)

  const str = await getPlayerStrength(page)
  expect(str).toBeGreaterThan(0)

  // 再次读取同一张攻击牌的伤害值
  const dmgAfter = await page.locator('.hc-frame').filter({
    has: page.locator('.hc-calc-dmg')
  }).first().locator('.hc-calc-dmg').innerText()
  const newDmg = parseInt(dmgAfter.replace(/\D/g, '')) || 0

  expect(newDmg).toBe(baseDmg + str)

  // 卡牌上应显示 "+N 力量" 修正标签（黄色）
  const strMod = page.locator('.hc-frame').filter({ has: page.locator('.hc-calc-dmg') })
    .first().locator('.hc-calc-mod', { hasText: /力量/ })
  await expect(strMod).toBeVisible()
})

// ── TC-10-C: 易伤使攻击牌伤害显示值 ×1.5 ────────────────────────────────────

test('TC-10-C: 敌人有易伤时，攻击牌显示 ×1.5 后的伤害值及易伤标签', async ({ page }) => {
  if (!await goToBattle(page)) return

  // 找一张有基础伤害的攻击牌
  const strikeCard = page.locator('.hc-frame').filter({ has: page.locator('.hc-calc-dmg') }).first()
  if (await strikeCard.count() === 0) { test.skip(true, '手牌无攻击牌'); return }

  const dmgBefore = parseInt((await strikeCard.locator('.hc-calc-dmg').innerText()).replace(/\D/g, ''))

  // 找撞击（Bash）或雷霆掌（Thunderclap）施加易伤
  const vulnCard = page.locator('.hc-frame:not(.hc-disabled)').filter({
    has: page.locator('.hc-name', { hasText: /撞击|雷霆掌|Bash|Thunderclap/i })
  }).first()

  if (await vulnCard.count() === 0) { test.skip(true, '手牌无施加易伤的牌'); return }

  await vulnCard.click()
  await page.waitForTimeout(200)
  // 若需要选目标
  if (await page.locator('.targeting-hint').isVisible({ timeout: 500 }).catch(() => false)) {
    await page.locator('.enemy-zone:not(.dead)').first().click()
    await page.waitForTimeout(500)
  }

  // 确认敌人有易伤
  const vuln = await getEnemyVulnStacks(page)
  expect(vuln).toBeGreaterThan(0)

  // 找剩余手牌中的攻击牌
  const remainAttack = page.locator('.hc-frame').filter({ has: page.locator('.hc-calc-dmg') }).first()
  if (await remainAttack.count() === 0) { test.skip(true, '打出 Bash 后手牌无攻击牌'); return }

  const dmgAfterTxt = await remainAttack.locator('.hc-calc-dmg').innerText()
  const dmgAfter = parseInt(dmgAfterTxt.replace(/\D/g, ''))

  // 易伤后伤害应为 floor(原值 × 1.5)
  const expected = Math.floor(dmgBefore * 1.5)
  expect(dmgAfter).toBe(expected)

  // 应有 ×1.5 易伤 红色标签
  const vulnMod = remainAttack.locator('.hc-calc-mod', { hasText: /易伤/ })
  await expect(vulnMod).toBeVisible()
})

// ── TC-10-D: 大预览卡（LargeCard）也显示计算值 ────────────────────────────────

test('TC-10-D: 悬停攻击牌时大预览卡显示计算伤害值', async ({ page }) => {
  if (!await goToBattle(page)) return

  const attackCard = page.locator('.hc-frame').filter({ has: page.locator('.hc-calc-dmg') }).first()
  if (await attackCard.count() === 0) { test.skip(true, '手牌无攻击牌'); return }

  await attackCard.hover()
  await page.waitForTimeout(400)

  // 大预览卡的计算值区域
  await expect(page.locator('.lc-calc-stats')).toBeVisible({ timeout: 2000 })
  await expect(page.locator('.lcs-damage')).toBeVisible()

  const lcDmg = await page.locator('.lcs-damage').innerText()
  const smallDmg = await attackCard.locator('.hc-calc-dmg').innerText()

  // 大预览和小牌的数值应一致
  expect(lcDmg).toContain(smallDmg.replace('⚔', '').trim().split('×')[0].trim())
})

// ── TC-10-E: 浮动伤害数字出现 ─────────────────────────────────────────────────

test('TC-10-E: 打出攻击牌后，敌人区域出现浮动伤害数字', async ({ page }) => {
  if (!await goToBattle(page)) return

  const attackCard = page.locator('.hc-frame:not(.hc-disabled)').filter({
    has: page.locator('.hc-calc-dmg')
  }).first()
  if (await attackCard.count() === 0) { test.skip(true, '手牌无可打出的攻击牌'); return }

  await attackCard.click()
  await page.waitForTimeout(150)
  if (await page.locator('.targeting-hint').isVisible({ timeout: 500 }).catch(() => false)) {
    await page.locator('.enemy-zone:not(.dead)').first().click()
  }

  // 浮动数字应在动画期间（300ms 内）出现
  const floatNum = page.locator('.float-num')
  await expect(floatNum.first()).toBeVisible({ timeout: 800 })

  // 颜色为白色（伤害），内容应为负值（如 -8）
  const floatText = await floatNum.first().locator('.float-main').innerText()
  expect(floatText).toMatch(/^-\d+/)
})

// ── TC-10-F: 格挡牌触发绿色浮动数字 ──────────────────────────────────────────

test('TC-10-F: 打出防御牌后，玩家区域出现绿色格挡浮动数字', async ({ page }) => {
  if (!await goToBattle(page)) return

  const defendCard = page.locator('.hc-frame:not(.hc-disabled)').filter({
    has: page.locator('.hc-calc-blk')
  }).first()
  if (await defendCard.count() === 0) { test.skip(true, '手牌无格挡牌'); return }

  await defendCard.click()
  await page.waitForTimeout(150)

  // 格挡浮动数字应出现（绿色 + 前缀）
  const floatBlock = page.locator('.float-num.float-block, .float-num')
  await expect(floatBlock.first()).toBeVisible({ timeout: 800 })
  const txt = await page.locator('.float-main').first().innerText()
  expect(txt).toMatch(/^\+\d+/)
})
