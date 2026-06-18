import { test, expect } from '@playwright/test'
import { CARD_DATA } from '../src/data/cards.js'

test('TC-11: 卡牌画廊 — 所有卡牌可正常展示', async ({ page }) => {
  await page.goto('/?gallery=1')

  // 等待标题出现
  await expect(page.locator('h1')).toContainText('卡牌全览', { timeout: 8000 })

  // 等待网络空闲（图片加载完毕）
  await page.waitForLoadState('networkidle')

  // 获取所有卡牌总数
  const totalCards = Object.keys(CARD_DATA).length
  const sections = page.locator('section')
  await expect(sections.first()).toBeVisible()

  // 每个分组标题都应可见
  for (const label of ['基础', '状态', '普通', '稀有', '传说']) {
    await expect(page.locator(`h2:has-text("${label}")`)).toBeVisible()
  }

  // 截取全页
  await page.screenshot({
    path: 'playwright-report/tc11-all-cards.png',
    fullPage: true,
  })

  // 验证卡牌数量文本
  const countText = await page.locator('p').first().innerText()
  const match = countText.match(/共 (\d+) 张/)
  expect(match).not.toBeNull()
  const renderedCount = parseInt(match![1])
  expect(renderedCount).toBe(totalCards)

  console.log(`✓ 共渲染 ${renderedCount} 张卡牌`)
})

test('TC-11-B: 每张卡牌名称、费用、描述字段不为空', async ({ page }) => {
  await page.goto('/?gallery=1')
  await expect(page.locator('h1')).toBeVisible({ timeout: 8000 })

  // 检查卡牌数据完整性（在 Node 端直接验证）
  const cards = Object.values(CARD_DATA as Record<string, any>)
  const issues: string[] = []

  for (const card of cards) {
    if (!card.name)        issues.push(`${card.id}: 缺少 name`)
    if (card.cost == null) issues.push(`${card.id}: 缺少 cost`)
    if (!card.description) issues.push(`${card.id}: 缺少 description`)
    if (!card.type)        issues.push(`${card.id}: 缺少 type`)
    if (!card.rarity)      issues.push(`${card.id}: 缺少 rarity`)
    if (!card.image)       issues.push(`${card.id}: 缺少 image`)
  }

  if (issues.length > 0) {
    console.error('卡牌数据问题:\n' + issues.join('\n'))
  }
  expect(issues, '所有卡牌数据应完整').toHaveLength(0)
})
