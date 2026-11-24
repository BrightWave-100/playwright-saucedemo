import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('SauceDemo inventory', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await expect(page).toHaveURL(/inventory\.html/);
    });

    test('TC-INV-001: inventory lists all 6 products', async ({ page }) => {
        await expect(page.locator('.inventory_item')).toHaveCount(6);
        await expect(page.locator('.inventory_item_name').first()).toBeVisible();
        await expect(page.locator('.inventory_item_price').first()).toBeVisible();
        await expect(page.locator('.inventory_item button').first()).toHaveText('Add to cart');
    });

    test('TC-INV-002: sort by price low to high', async ({ page }) => {
        await page.selectOption('.product_sort_container', 'lohi');

        const prices = await page.locator('.inventory_item_price').allTextContents();
        const numbers = prices.map((p) => parseFloat(p.replace('$', '')));
        expect(numbers).toEqual([7.99, 9.99, 15.99, 15.99, 29.99, 49.99]);
    });

    test('TC-INV-003: sort by name Z to A', async ({ page }) => {
        await page.selectOption('.product_sort_container', 'za');

        const names = await page.locator('.inventory_item_name').allTextContents();
        expect(names[0]).toBe('Test.allTheThings() T-Shirt (Red)');
        expect(names[names.length - 1]).toBe('Sauce Labs Backpack');
    });

    test('TC-INV-004: adding an item updates the cart badge', async ({ page }) => {
        await page.click('#add-to-cart-sauce-labs-backpack');

        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        await expect(page.locator('#remove-sauce-labs-backpack')).toHaveText('Remove');
    });

    test('TC-INV-005: removing an item clears the badge', async ({ page }) => {
        await page.click('#add-to-cart-sauce-labs-backpack');
        await page.click('#remove-sauce-labs-backpack');

        await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
        await expect(page.locator('#add-to-cart-sauce-labs-backpack')).toHaveText('Add to cart');
    });

    test('TC-INV-006: product name opens its detail page', async ({ page }) => {
        await page.click('.inventory_item_name:has-text("Sauce Labs Backpack")');

        await expect(page).toHaveURL(/inventory-item\.html/);
        await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
        await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    });
});