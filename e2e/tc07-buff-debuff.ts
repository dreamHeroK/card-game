import { test, expect } from '@playwright/test'
import { startGame, waitForBattle, waitForPlayerTurn } from './helpers'

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

const hasBashInHand = (page: any) =>
  page.locator('.battle-card:not(.disabled)').filter({ hasText: /猛击/ }).first()

// TC-07-A: 猛击施加易伤徽章
test('TC-07-A: 打出猛击(BASH)后敌人效果区出现易伤徽章', async ({ page }) => {
  if (!await goToBattle(page)) return
  const bash = hasBashInHand(page)
  if (await bash.count() === 0) { test.skip(true, '手牌无猛击'); return }

  await bash.click()
  await page.locator('.enemy-card:not(.dead)').first().click()
  await page.waitForTimeout(400)

  const vuln = page.locator('.enemy-card').locator('.status-badge').filter({ hasText: /易伤/ })
  await expect(vuln.first()).toBeVisible({ timeout: 3000 })
})

// TC-07-B: Debuff 叠加取最大值
test('TC-07-B: 已有易伤(2)时再施加易伤，值不超过 2', async ({ page }) => {
  if (!await goToBattle(page)) return
  const bash = hasBashInHand(page)
  if (await bash.count() === 0) { test.skip(true, '手牌无猛击'); return }

  await bash.click()
  await page.locator('.enemy-card:not(.dead)').first().click()
  await page.waitForTimeout(400)

  // 读取层数
  const getStacks = async () => {
    const badge = page.locator('.enemy-card .status-badge').filter({ hasText: /易伤/ })
    if (await badge.count() === 0) return 0
    const m = (await badge.first().innerText()).match(/\d+/)
    return m ? parseInt(m[0]) : 1
  }

  const first = await getStacks()
  expect(first).toBeGreaterThan(0)

  // 下一回合再出猛击
  await page.getByRole('button', { name: /结束回合/ }).click()
  await waitForPlayerTurn(page)

  const bash2 = hasBashInHand(page)
  if (await bash2.count() === 0) { test.skip(true, '第二回合无猛击'); return }

  await bash2.click()
  await page.locator('.enemy-card:not(.dead)').first().click()
  await page.waitForTimeout(400)

  const second = await getStacks()
  // 叠加规则：取 max，不应该超过 first + 1（递减后再施加相同量）
  // 实际上：first 在这轮开始时已递减为 first-1，新施加 2，结果应为 max(first-1, 2) = 2（如果 first 是 2）
  expect(second).toBeLessThanOrEqual(Math.max(first, 2))
  // 绝对不应该是 first + 2（累加逻辑的错误结果）
  expect(second).toBeLessThan(first + 2)
})

// TC-07-C: Buff 累加（炽焰力量）
test('TC-07-C: 打出炽焰(INFLAME)后玩家效果区显示力量徽章', async ({ page }) => {
  if (!await goToBattle(page)) return
  const inflame = page.locator('.battle-card:not(.disabled)').filter({ hasText: /炽焰/ }).first()
  if (await inflame.count() === 0) { test.skip(true, '手牌无炽焰'); return }

  await inflame.click()
  await page.waitForTimeout(400)

  const strength = page.locator('.player-area .status-badge').filter({ hasText: /力量/ })
  await expect(strength.first()).toBeVisible({ timeout: 3000 })
})

// TC-07-D: 易伤在足够回合后消失
test('TC-07-D: 易伤经过 3 回合后从效果区消失', async ({ page }) => {
  if (!await goToBattle(page)) return
  const bash = hasBashInHand(page)
  if (await bash.count() === 0) { test.skip(true, '手牌无猛击'); return }

  await bash.click()
  await page.locator('.enemy-card:not(.dead)').first().click()
  await page.waitForTimeout(400)

  for (let i = 0; i < 3; i++) {
    if (await page.locator('.enemy-card:not(.dead)').count() === 0) break
    await page.getByRole('button', { name: /结束回合/ }).click()
    await waitForPlayerTurn(page)
    await page.waitForTimeout(200)
  }

  const vuln = page.locator('.enemy-card .status-badge').filter({ hasText: /易伤/ })
  expect(await vuln.count()).toBe(0)
})

// TC-07-E: debuff 徽章有 .debuff 样式类
test('TC-07-E: 易伤徽章带有 .debuff 样式类（用于红色边框）', async ({ page }) => {
  if (!await goToBattle(page)) return
  const bash = hasBashInHand(page)
  if (await bash.count() === 0) { test.skip(true, '手牌无猛击'); return }

  await bash.click()
  await page.locator('.enemy-card:not(.dead)').first().click()
  await page.waitForTimeout(400)

  const debuffBadge = page.locator('.status-badge.debuff')
  await expect(debuffBadge.first()).toBeVisible({ timeout: 3000 })
})
