import { test, expect } from '@playwright/test'
import { startGame, enterFirstNode } from './helpers'

// TC-02-A: 地图节点渲染
test('TC-02-A: 地图界面至少有一个可点击的 available 节点', async ({ page }) => {
  await startGame(page)
  await expect(page.locator('.map-node.available').first()).toBeVisible({ timeout: 8000 })
})

// TC-02-B: 选择节点进入对应界面
test('TC-02-B: 点击 available 节点后进入对应游戏界面', async ({ page }) => {
  await startGame(page)
  await enterFirstNode(page)
  await expect(
    page.locator('.battle-screen, .shop-screen, .rest-screen, .event-screen')
  ).toBeVisible({ timeout: 8000 })
})
