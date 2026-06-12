import { test, expect } from '@playwright/test'
import { startGame, waitForBattle, getEnergy, getBlock } from './helpers'

/** 进入战斗节点（跳过非战斗界面） */
async function goToBattle(page: any) {
  await startGame(page)
  // 优先找战斗节点
  const battleNode = page.locator('.map-node-battle.available').first()
  if (await battleNode.count() > 0) {
    await battleNode.click()
  } else {
    await page.locator('.map-node.available').first().click()
  }
  // 若进入非战斗屏幕则跳过
  const isBattle = await page.locator('.battle-screen').isVisible({ timeout: 5000 }).catch(() => false)
  if (!isBattle) {
    test.skip(true, '首个可用节点非战斗节点，跳过本测试')
    return false
  }
  await waitForBattle(page)
  return true
}

// TC-03-A: 手牌显示
test('TC-03-A: 进入战斗后手牌区域显示卡牌', async ({ page }) => {
  if (!await goToBattle(page)) return
  const cards = page.locator('.battle-card')
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeGreaterThanOrEqual(1)
})

// TC-03-B: ENEMY 目标牌进入 selected 状态（SELF 目标牌立即打出，不经过 selected）
test('TC-03-B: 点击 ENEMY 目标攻击牌后出现选中状态和目标提示', async ({ page }) => {
  if (!await goToBattle(page)) return
  // 找 ATTACK 类型且需要目标的牌（card-type 文字 = ATTACK）
  const attackCard = page.locator('.battle-card:not(.disabled)').filter({
    has: page.locator('.card-type', { hasText: 'ATTACK' }),
  }).first()
  if (await attackCard.count() === 0) {
    test.skip(true, '手牌无 ATTACK 类型牌')
    return
  }
  await attackCard.click()
  // ATTACK → ENEMY 目标，应进入 selected 状态并显示目标提示
  await expect(page.locator('.targeting-hint')).toBeVisible({ timeout: 3000 })
  await expect(page.locator('.battle-card.selected')).toBeVisible({ timeout: 1000 })
})

// TC-03-C: 出牌后能量减少
test('TC-03-C: 打出一张牌后能量减少', async ({ page }) => {
  if (!await goToBattle(page)) return
  const energyBefore = await getEnergy(page)
  const card = page.locator('.battle-card:not(.disabled)').first()
  const cardCostText = await card.locator('.card-cost').innerText().catch(() => '1')
  const cardCost = parseInt(cardCostText) || 1

  await card.click()
  // 如需选择目标
  const hint = page.locator('.targeting-hint')
  if (await hint.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.locator('.enemy-card:not(.dead)').first().click()
  }
  await page.waitForTimeout(300)
  const energyAfter = await getEnergy(page)
  expect(energyAfter).toBe(energyBefore - cardCost)
})

// TC-03-D: 取消选牌
test('TC-03-D: 选牌后点击取消，卡牌取消选中', async ({ page }) => {
  if (!await goToBattle(page)) return
  await page.locator('.battle-card:not(.disabled)').first().click()
  // 等待 selected 状态或取消按钮
  const cancelBtn = page.locator('.cancel-btn')
  if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await cancelBtn.click()
    await expect(page.locator('.battle-card.selected')).not.toBeVisible({ timeout: 2000 })
  }
})

// TC-03-E: 出防御牌获得格挡
test('TC-03-E: 出"防御"卡后玩家格挡值增加', async ({ page }) => {
  if (!await goToBattle(page)) return
  const blockBefore = await getBlock(page)
  // 防御牌文字包含"防御"
  const defendCard = page.locator('.battle-card:not(.disabled)').filter({ hasText: /防御/ }).first()
  if (await defendCard.count() === 0) {
    test.skip(true, '手牌中无防御牌')
    return
  }
  await defendCard.click()
  // 防御牌是 SELF 目标，不需要选敌
  await page.waitForTimeout(400)
  const blockAfter = await getBlock(page)
  expect(blockAfter).toBeGreaterThan(blockBefore)
})
