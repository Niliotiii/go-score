import { test, expect } from '@playwright/test'

async function dismissInstallPromptIfVisible(page) {
  const banner = page.locator('[data-od-id="install-prompt-banner"]')
  if (await banner.isVisible().catch(() => false)) {
    await banner.locator('button[aria-label="Fechar aviso"]').click()
  }
}

async function goToScoreboard(page) {
  await page.goto('/')
  await dismissInstallPromptIfVisible(page)
  await page.click('[data-od-id="new-match-btn"]')
  await page.waitForSelector('[data-od-id="scoreboard-header"]')
}

test.describe('Scoreboard menu', () => {
  test('hamburger menu opens and contains all options', async ({ page }) => {
    await goToScoreboard(page)
    await page.click('[data-od-id="scoreboard-header"] button[aria-label="Abrir menu de opcoes"]')
    const menu = page.locator('[data-od-id="scoreboard-menu"]')
    await expect(menu).toBeVisible()
    await expect(menu.locator('text=Swipe +3')).toBeVisible()
    await expect(menu.locator('text=Inverter lados')).toBeVisible()
    await expect(menu.locator('text=Zerar placar')).toBeVisible()
    await expect(menu.locator('text=Sair da partida')).toBeVisible()
  })

  test('toggle Swipe +3 inside menu', async ({ page }) => {
    await goToScoreboard(page)
    await page.click('[data-od-id="scoreboard-header"] button[aria-label="Abrir menu de opcoes"]')
    await page.click('text=Swipe +3')
    await page.click('[data-od-id="scoreboard-header"] button[aria-label="Abrir menu de opcoes"]')
    await expect(page.locator('[data-od-id="scoreboard-menu"] [role="switch"][aria-checked="false"]')).toBeVisible()
  })

  test('screenshot of scoreboard header', async ({ page }) => {
    await goToScoreboard(page)
    const header = page.locator('[data-od-id="scoreboard-header"]')
    const path = `e2e/screenshots/header-${test.info().project.name}.png`
    await header.screenshot({ path })
    console.log(`Screenshot saved: ${path}`)
  })
})
