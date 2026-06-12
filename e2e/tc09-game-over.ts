import { test, expect } from '@playwright/test'
import { startGame, waitForBattle, waitForPlayerTurn } from './helpers'

// TC-09-A: HP 归零触发 Game Over
test('TC-09-A: 玩家 HP 归零后显示"你已倒下"游戏结束界面', async ({ page }) => {
  page.setDefaultTimeout(180_000)
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

  // 不出牌，一直结束回合直到 HP 归零
  for (let i = 0; i < 50; i++) {
    if (await page.locator('.screen-game-over').isVisible().catch(() => false)) break
    if (!await page.locator('.battle-screen').isVisible().catch(() => false)) break
    const endBtn = page.getByRole('button', { name: /结束回合/ })
    if (await endBtn.isEnabled().catch(() => false)) {
      await endBtn.click()
      await waitForPlayerTurn(page).catch(() => {})
    }
    await page.waitForTimeout(300)
  }

  await expect(page.locator('.screen-game-over')).toBeVisible({ timeout: 10_000 })
  // 显示"你已倒下"文字
  await expect(page.locator('.overlay-title-gameover')).toHaveText('你已倒下')
  // 有重新开始按钮
  await expect(page.getByRole('button', { name: /重新开始/ })).toBeVisible()
})
