import { test, expect } from '@playwright/test'
import { startGame, waitForBattle, waitForPlayerTurn, getBlock } from './helpers'

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

// TC-06-A: 出防御牌后格挡值增加
test('TC-06-A: 出"防御"卡后玩家格挡增加', async ({ page }) => {
  if (!await goToBattle(page)) return
  const defendCard = page.locator('.battle-card:not(.disabled)').filter({ hasText: /防御/ }).first()
  if (await defendCard.count() === 0) {
    test.skip(true, '手牌无防御牌')
    return
  }
  const blockBefore = await getBlock(page)
  await defendCard.click()
  await page.waitForTimeout(400)
  const blockAfter = await getBlock(page)
  expect(blockAfter).toBeGreaterThan(blockBefore)
})

// TC-06-B: 新回合开始时格挡归零
test('TC-06-B: 下一回合开始时格挡归零（无壁垒）', async ({ page }) => {
  if (!await goToBattle(page)) return
  const defendCard = page.locator('.battle-card:not(.disabled)').filter({ hasText: /防御/ }).first()
  if (await defendCard.count() === 0) {
    test.skip(true, '手牌无防御牌')
    return
  }
  await defendCard.click()
  await page.waitForTimeout(400)
  const blockMidTurn = await getBlock(page)
  if (blockMidTurn === 0) {
    test.skip(true, '出牌后格挡仍为 0，无法验证')
    return
  }
  await page.getByRole('button', { name: /结束回合/ }).click()
  await waitForPlayerTurn(page)
  expect(await getBlock(page)).toBe(0)
})
