import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('SauceDemo checkout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('#add-to-cart-sauce-labs-backpack');
        await page.click('.shopping_cart_link');
        await page.click('#checkout');
    });

    test('TC-CHK-001: checkout completes with all fields filled', async ({ page }) => {
        await page.fill('#first-name', 'Test');
        await page.fill('#last-name', 'User');
        await page.fill('#postal-code', '12345');
        await page.click('#continue');

        await expect(page).toHaveURL(/checkout-step-two\.html/);
        await expect(page.locator('.summary_info')).toBeVisible();
    });

    test('TC-CHK-002: missing first name shows an error', async ({ page }) => {
        await page.fill('#last-name', 'User');
        await page.fill('#postal-code', '12345');
        await page.click('#continue');

        await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
    });

    test('TC-CHK-003: missing last name shows an error', async ({ page }) => {
        await page.fill('#first-name', 'Test');
        await page.fill('#postal-code', '12345');
        await page.click('#continue');

        await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
    });

    test('TC-CHK-004: missing postal code shows an error', async ({ page }) => {
        await page.fill('#first-name', 'Test');
        await page.fill('#last-name', 'User');
        await page.click('#continue');

        await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
    });

    test('TC-CHK-005: overview totals are calculated correctly', async ({ page }) => {
        await page.fill('#first-name', 'Test');
        await page.fill('#last-name', 'User');
        await page.fill('#postal-code', '12345');
        await page.click('#continue');

        await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $29.99');
        await expect(page.locator('.summary_tax_label')).toHaveText('Tax: $2.40');
        await expect(page.locator('.summary_total_label')).toHaveText('Total: $32.39');
    });

    test('TC-CHK-006: finish completes the order', async ({ page }) => {
        await page.fill('#first-name', 'Test');
        await page.fill('#last-name', 'User');
        await page.fill('#postal-code', '12345');
        await page.click('#continue');
        await page.click('#finish');

        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
        await expect(page.locator('#back-to-products')).toBeVisible();
    });
});