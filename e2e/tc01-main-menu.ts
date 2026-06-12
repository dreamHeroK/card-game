import { test, expect } from '@playwright/test'

// TC-01-A: 页面加载与元素显示
test('TC-01-A: 主菜单正常加载，显示开始新游戏按钮', async ({ page }) => {
  await page.goto('/')
  await expect(page).not.toHaveTitle(/error/i)
  const startBtn = page.getByRole('button', { name: /开始新游戏/ })
  await expect(startBtn).toBeVisible()
  await expect(startBtn).toBeEnabled()
})

// TC-01-B: 点击开始新游戏跳转地图
test('TC-01-B: 点击"开始新游戏"进入地图界面', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /开始新游戏/ }).click()
  await expect(page.getByRole('button', { name: /开始新游戏/ })).not.toBeVisible({ timeout: 5000 })
  // 地图界面有地图容器
  const mapContainer = page.locator('.map-screen, .map-container, [class*="map"]')
  await expect(mapContainer.first()).toBeVisible({ timeout: 8000 })
})
