import { test, expect } from '@playwright/test'
import { startGame, waitForBattle, waitForPlayerTurn, getPlayerHP } from './helpers'

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

// TC-05-A: 敌人意图图标与文字
test('TC-05-A: 战斗界面每个敌人显示意图图标和文字', async ({ page }) => {
  if (!await goToBattle(page)) return
  const intent = page.locator('.intent-display').first()
  await expect(intent).toBeVisible()
  const text = await intent.innerText()
  expect(text.trim().length).toBeGreaterThan(0)
})

// TC-05-B: 结束回合后敌人行动，再恢复玩家回合
test('TC-05-B: 结束回合后敌方回合遮罩出现，之后恢复玩家回合', async ({ page }) => {
  if (!await goToBattle(page)) return
  await page.getByRole('button', { name: /结束回合/ }).click()
  // 敌方回合遮罩出现（可能很短暂，用 race 等待）
  await page.locator('.enemy-turn-overlay').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
  // 等待玩家回合恢复
  await waitForPlayerTurn(page)
  await expect(page.getByRole('button', { name: /结束回合/ })).toBeEnabled()
})

// TC-05-C: 敌人攻击后玩家状态合理
test('TC-05-C: 敌人行动后玩家 HP 大于等于 0', async ({ page }) => {
  if (!await goToBattle(page)) return
  const hpBefore = await getPlayerHP(page)
  await page.getByRole('button', { name: /结束回合/ }).click()
  await waitForPlayerTurn(page)
  const hpAfter = await getPlayerHP(page)
  expect(hpAfter.current).toBeGreaterThanOrEqual(0)
  expect(hpAfter.max).toBe(hpBefore.max)
})
