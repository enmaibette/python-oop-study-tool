import { test, expect } from '@playwright/test';

// AC-04: Exercise Panel Content
// AC-05: Hint Accordion Works

test.describe('Exercise panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/1');
  });

  test('AC-04 - Exercise tab is active by default', async ({ page }) => {
    // The Exercise tab trigger should have data-state=active
    const descTrigger = page.getByRole('tab', { name: /exercise/i });
    await expect(descTrigger).toHaveAttribute('data-state', 'active');
  });

  test('AC-04 - challenge title is visible in exercise panel', async ({ page }) => {
    // Challenge 1 title
    await expect(page.getByText('Create a Class – Dog').first()).toBeVisible();
  });

  test('AC-04 - requirements section is visible', async ({ page }) => {
    await expect(page.getByText('Requirements')).toBeVisible();
  });

  test('AC-04 - example usage section is visible', async ({ page }) => {
    await expect(page.getByText('Example Usage')).toBeVisible();
  });

  test('AC-05 - clicking "Hint" tab shows accordion items', async ({ page }) => {
    await page.getByRole('tab', { name: /hint/i }).click();
    await expect(page.getByText('Hint 1')).toBeVisible();
    await expect(page.getByText('Hint 2')).toBeVisible();
  });

  test('AC-05 - accordion items are collapsed by default', async ({ page }) => {
    await page.getByRole('tab', { name: /hint/i }).click();
    const hint1Button = page.getByRole('button', { name: /Hint 1/ });
    await expect(hint1Button).toHaveAttribute('data-state', 'closed');
  });

  test('AC-05 - clicking accordion item expands it and shows hint text', async ({ page }) => {
    await page.getByRole('tab', { name: /hint/i }).click();
    const hint1Trigger = page.getByRole('button', { name: /Hint 1/ });
    await hint1Trigger.click();

    await expect(hint1Trigger).toHaveAttribute('data-state', 'open');
    await expect(
      page.getByText(/Use self\.name = name inside __init__/)
    ).toBeVisible();
  });

  test('AC-05 - clicking expanded accordion item again collapses it', async ({ page }) => {
    await page.getByRole('tab', { name: /hint/i }).click();
    const hint1Trigger = page.getByRole('button', { name: /Hint 1/ });

    // Expand
    await hint1Trigger.click();
    await expect(hint1Trigger).toHaveAttribute('data-state', 'open');

    // Collapse
    await hint1Trigger.click();
    await expect(hint1Trigger).toHaveAttribute('data-state', 'closed');
  });

  test('AC-04 - close button (X) is visible in the exercise panel', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /close exercise panel/i })
    ).toBeVisible();
  });
});
