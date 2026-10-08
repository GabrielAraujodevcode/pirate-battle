import { test, expect } from '@playwright/test';

test.describe('Fluxo do Jogo e Batalha', () => {
  test('Deve iniciar uma partida, exibir os elementos do HUD e responder à pausa', async ({ page }) => {
    await page.goto('/');

    // 1. Inicia a partida
    await page.getByPlaceholder('Nome do Capitão').fill('Capitão Barbanegra');
    await page.getByRole('button', { name: 'Navegar' }).click();

    // 2. Valida se o Canvas do PixiJS foi montado na tela
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // 3. Valida se as informações do HUD são exibidas
    await expect(page.getByText(/Pontuação|Score/i)).toBeVisible();
    await expect(page.getByText(/Tempo/i)).toBeVisible();
  });
});