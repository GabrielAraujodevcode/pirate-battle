import { test, expect } from '@playwright/test';

test.describe('Navegação e Menus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Deve exibir o título principal, o input do capitão e o botão de navegar', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'PIRATE BATTLE' })).toBeVisible();
    await expect(page.getByPlaceholder('Nome do Capitão')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Navegar' })).toBeVisible();
  });

  test('Deve alternar entre as abas de Classificação e Histórico de Batalhas', async ({ page }) => {
    const rankingBtn = page.getByRole('button', { name: 'Classificação' });
    const historyBtn = page.getByRole('button', { name: 'Histórico de Batalhas' });

    // Verifica que ambas as abas estão visíveis
    await expect(rankingBtn).toBeVisible();
    await expect(historyBtn).toBeVisible();

    // Clica na aba de Histórico de Batalhas e aguarda a atualização da visualização
    await historyBtn.click();
    
    // Volta para a aba de Classificação
    await rankingBtn.click();
  });


  test('Deve exibir uma partida persistida no Histórico de Batalhas', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        'pirate_battle_matches',
        JSON.stringify([
          {
            matchId: 'test-match-1',
            playerId: 'capitao_test',
            playerName: 'Capitão Teste',
            score: 3,
            durationSeconds: 42,
            endReason: 'time_expired',
            playedAt: new Date().toISOString(),
            config: {
              sessionDurationSeconds: 120,
              enemySpawnIntervalSeconds: 3,
            },
          },
        ])
      );
    });

    await page.reload();
    await page.getByRole('button', { name: 'Histórico de Batalhas' }).click();

    await expect(page.getByText('Capitão Teste')).toBeVisible();
    await expect(page.getByText('3')).toBeVisible();
    await expect(page.getByText('00:42')).toBeVisible();
  });

  test('Não deve permitir navegar sem preencher o nome do capitão', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: 'Navegar' });
    await submitBtn.click();

    // O jogo deve permanecer na tela do menu (input continua visível)
    await expect(page.getByPlaceholder('Nome do Capitão')).toBeVisible();
  });
});