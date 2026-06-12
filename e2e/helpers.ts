import { Page, expect } from '@playwright/test'

/** 开始一局游戏，返回地图界面 */
export async function startGame(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /开始新游戏/ }).click()
  // 地图界面：没有"开始新游戏"按钮
  await expect(page.getByRole('button', { name: /开始新游戏/ })).not.toBeVisible()
}

/** 进入第一个可用节点 */
export async function enterFirstNode(page: Page) {
  await page.locator('.map-node.available').first().click()
}

/** 等待战斗界面加载完成 */
export async function waitForBattle(page: Page) {
  await expect(page.getByRole('button', { name: /结束回合/ })).toBeVisible({ timeout: 10_000 })
}

/** 等待玩家回合（非敌人回合） */
export async function waitForPlayerTurn(page: Page) {
  await expect(page.locator('.enemy-turn-overlay')).not.toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole('button', { name: /结束回合/ })).toBeEnabled({ timeout: 5000 })
}

/** 读取顶部栏的 HP 文本，返回 {current, max} */
export async function getPlayerHP(page: Page): Promise<{ current: number; max: number }> {
  const text = await page.locator('.hp-bar-text').first().innerText()
  const [current, max] = text.split('/').map(Number)
  return { current, max }
}

/** 读取当前能量值 */
export async function getEnergy(page: Page): Promise<number> {
  const text = await page.locator('.energy-value').innerText()
  return parseInt(text.split('/')[0])
}

/** 读取当前格挡值 */
export async function getBlock(page: Page): Promise<number> {
  const text = await page.locator('.block-value').innerText().catch(() => '0')
  return parseInt(text) || 0
}
