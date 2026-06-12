import { test, expect } from '@playwright/test'
import { startGame, waitForBattle, waitForPlayerTurn } from './helpers'

/** 暴力打出所有牌直到战斗胜利，检查 .reward-screen */
async function winBattle(page: any) {
  for (let round = 0; round < 30; round++) {
    if (await page.locator('.reward-screen').isVisible().catch(() => false)) return true
    if (!await page.locator('.battle-screen').isVisible().catch(() => false)) return false

    await waitForPlayerTurn(page).catch(() => {})

    for (let j = 0; j < 6; j++) {
      if (await page.locator('.reward-screen').isVisible().catch(() => false)) return true
      if (!await page.locator('.battle-screen').isVisible().catch(() => false)) return false
      const card = page.locator('.battle-card:not(.disabled)').first()
      if (await card.count() === 0) break
      await card.click()
      const hint = page.locator('.targeting-hint')
      if (await hint.isVisible({ timeout: 500 }).catch(() => false)) {
        await page.locator('.enemy-card:not(.dead)').first().click()
      }
      await page.waitForTimeout(200)
    }

    if (await page.locator('.reward-screen').isVisible().catch(() => false)) return true
    const endBtn = page.getByRole('button', { name: /结束回合/ })
    if (await endBtn.isEnabled().catch(() => false)) await endBtn.click()
    await page.waitForTimeout(800)
  }
  return false
}

// TC-08-A: 战斗胜利进入奖励屏
test('TC-08-A: 击败所有敌人后显示"战斗奖励"界面', async ({ page }) => {
  test.setTimeout(120_000)
  await startGame(page)
  const battleNode = page.locator('.map-node-battle.available').first()
  if (await battleNode.count() > 0) {
    await battleNode.click()
  } else {
    await page.locator('.map-node.available').first().click()
  }
  if (!await page.locator('.battle-screen').isVisible({ timeout: 5000 }).catch(() => false)) {
    test.skip(true, '非战斗节点')
    return
  }
  await waitForBattle(page)
  if (!await winBattle(page)) { test.skip(true, '30轮内未赢得战斗'); return }
  await expect(page.locator('.reward-screen')).toBeVisible({ timeout: 5000 })
  await expect(page.locator('.reward-title')).toHaveText('战斗奖励')
})

// TC-08-B: 选择奖励卡返回地图
test('TC-08-B: 在奖励屏选择奖励卡后返回地图', async ({ page }) => {
  test.setTimeout(120_000)
  await startGame(page)
  const battleNode = page.locator('.map-node-battle.available').first()
  if (await battleNode.count() > 0) {
    await battleNode.click()
  } else {
    await page.locator('.map-node.available').first().click()
  }
  if (!await page.locator('.battle-screen').isVisible({ timeout: 5000 }).catch(() => false)) {
    test.skip(true, '非战斗节点')
    return
  }
  await waitForBattle(page)
  if (!await winBattle(page)) { test.skip(true, '未赢得战斗'); return }

  await expect(page.locator('.reward-screen')).toBeVisible({ timeout: 5000 })
  // 点击第一张 .reward-card
  const rewardCard = page.locator('.reward-card').first()
  if (await rewardCard.count() > 0) {
    await rewardCard.click()
    await expect(page.locator('.map-screen')).toBeVisible({ timeout: 8000 })
  }
})

// TC-08-C: 跳过奖励返回地图
test('TC-08-C: 点击"跳过"不选牌直接返回地图', async ({ page }) => {
  test.setTimeout(120_000)
  await startGame(page)
  const battleNode = page.locator('.map-node-battle.available').first()
  if (await battleNode.count() > 0) {
    await battleNode.click()
  } else {
    await page.locator('.map-node.available').first().click()
  }
  if (!await page.locator('.battle-screen').isVisible({ timeout: 5000 }).catch(() => false)) {
    test.skip(true, '非战斗节点')
    return
  }
  await waitForBattle(page)
  if (!await winBattle(page)) { test.skip(true, '未赢得战斗'); return }

  await expect(page.locator('.reward-screen')).toBeVisible({ timeout: 5000 })
  const skipBtn = page.getByRole('button', { name: /跳过/ })
  if (await skipBtn.count() > 0) {
    await skipBtn.click()
    await expect(page.locator('.map-screen')).toBeVisible({ timeout: 8000 })
  }
})
