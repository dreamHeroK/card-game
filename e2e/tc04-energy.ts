import { test, expect } from '@playwright/test'
import { startGame, waitForBattle, waitForPlayerTurn, getEnergy } from './helpers'

async function goToBattle(page: any) {
  await startGame(page)
  const battleNode = page.locator('.map-node-battle.available').first()
  if (await battleNode.count() > 0) {
    await battleNode.click()
  } else {
    await page.locator('.map-node.available').first().click()
  }
  const ok = await page.locator('.battle-screen').isVisible({ timeout: 5000 }).catch(() => false)
  if (!ok) { test.skip(true, '非战斗节点'); return false }
  await waitForBattle(page)
  return true
}

// TC-04-A: 能量耗尽后手牌全部禁用
test('TC-04-A: 能量耗尽后所有卡牌显示为禁用', async ({ page }) => {
  if (!await goToBattle(page)) return
  // 连续出牌耗尽能量
  for (let i = 0; i < 5; i++) {
    if (await getEnergy(page) === 0) break
    const card = page.locator('.battle-card:not(.disabled)').first()
    if (await card.count() === 0) break
    await card.click()
    const hint = page.locator('.targeting-hint')
    if (await hint.isVisible({ timeout: 800 }).catch(() => false)) {
      await page.locator('.enemy-card:not(.dead)').first().click()
    }
    await page.waitForTimeout(200)
  }
  if (await getEnergy(page) === 0) {
    const enabledCards = page.locator('.battle-card:not(.disabled)')
    expect(await enabledCards.count()).toBe(0)
  }
})

// TC-04-B: 结束回合后能量恢复为 3
test('TC-04-B: 结束回合进入新回合后能量恢复为最大值', async ({ page }) => {
  if (!await goToBattle(page)) return
  // 出一张牌减少能量
  const card = page.locator('.battle-card:not(.disabled)').first()
  if (await card.count() > 0) {
    await card.click()
    const hint = page.locator('.targeting-hint')
    if (await hint.isVisible({ timeout: 800 }).catch(() => false)) {
      await page.locator('.enemy-card:not(.dead)').first().click()
    }
    await page.waitForTimeout(200)
  }
  await page.getByRole('button', { name: /结束回合/ }).click()
  await waitForPlayerTurn(page)
  expect(await getEnergy(page)).toBe(3)
})
