import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('SauceDemo cart', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await expect(page).toHaveURL(/inventory\.html/);
    });

    test('TC-CART-001: badge shows the correct item count', async ({ page }) => {
        await page.click('#add-to-cart-sauce-labs-backpack');
        await page.click('#add-to-cart-sauce-labs-bike-light');

        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    });

    test('TC-CART-002: cart page lists the added items', async ({ page }) => {
        await page.click('#add-to-cart-sauce-labs-backpack');
        await page.click('#add-to-cart-sauce-labs-bike-light');
        await page.click('.shopping_cart_link');

        await expect(page).toHaveURL(/cart\.html/);
        await expect(page.locator('.cart_item')).toHaveCount(2);
        await expect(page.locator('.cart_quantity').first()).toHaveText('1');
    });

    test('TC-CART-003: removing an item from the cart page', async ({ page }) => {
        await page.click('#add-to-cart-sauce-labs-backpack');
        await page.click('#add-to-cart-sauce-labs-bike-light');
        await page.click('.shopping_cart_link');

        await page.click('#remove-sauce-labs-bike-light');

        await expect(page.locator('.cart_item')).toHaveCount(1);
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

    test('TC-CART-004: cart contents persist after refresh', async ({ page }) => {
        await page.click('#add-to-cart-sauce-labs-backpack');

        await page.reload();

        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        await page.click('.shopping_cart_link');
        await expect(page.locator('.cart_item')).toHaveCount(1);
        await expect(page.locator('.cart_item_label')).toContainText('Sauce Labs Backpack');
    });

    test('TC-CART-005: Continue Shopping returns to the Products page', async ({ page }) => {
        await page.click('#add-to-cart-sauce-labs-backpack');
        await page.click('.shopping_cart_link');

        await page.click('#continue-shopping');

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.locator('#remove-sauce-labs-backpack')).toHaveText('Remove');
    });
});