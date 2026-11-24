import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

async function login(page: Page, username: string) {
    await page.goto(BASE_URL);
    await page.fill('#user-name', username);
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
}

test.describe('problem_user', () => {
    test('TC-OTH-001: problem_user can log in', async ({ page }) => {
        await login(page, 'problem_user');
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('TC-OTH-002: product images match the products (known bug BUG-001)', async ({ page }) => {
        test.fail();
        await login(page, 'problem_user');

        const sources = await page
            .locator('.inventory_item_img img')
            .evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src')));
        expect(new Set(sources).size).toBe(6);
    });

    test('TC-OTH-003: problem_user add to cart works', async ({ page }) => {
        await login(page, 'problem_user');
        await page.click('#add-to-cart-sauce-labs-backpack');

        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        await expect(page.locator('#remove-sauce-labs-backpack')).toHaveText('Remove');
    });
});

test.describe('visual_user', () => {
    test('TC-OTH-004: Backpack price matches standard_user (known bug BUG-005)', async ({ page }) => {
        test.fail();
        await login(page, 'visual_user');

        const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
        await expect(backpack.locator('.inventory_item_price')).toHaveText('$29.99');
    });
});

test.describe('error_user', () => {
    test('TC-OTH-006: remove clears the cart badge (known bug BUG-002)', async ({ page }) => {
        test.fail();
        await login(page, 'error_user');
        await page.click('#add-to-cart-sauce-labs-backpack');
        await page.click('#remove-sauce-labs-backpack');

        await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    });

    test('TC-OTH-007: sort by price works (known bug BUG-003)', async ({ page }) => {
        test.fail();
        page.on('dialog', (dialog) => dialog.accept());
        await login(page, 'error_user');
        await page.selectOption('.product_sort_container', 'lohi');

        const prices = await page.locator('.inventory_item_price').allTextContents();
        const numbers = prices.map((p) => parseFloat(p.replace('$', '')));
        expect(numbers).toEqual([7.99, 9.99, 15.99, 15.99, 29.99, 49.99]);
    });

    test('TC-OTH-008: cart shows the product image (known bug BUG-004)', async ({ page }) => {
        test.fail();
        await login(page, 'error_user');
        await page.click('#add-to-cart-sauce-labs-backpack');
        await page.click('.shopping_cart_link');

        await expect(page.locator('.cart_item img').first()).toBeVisible();
    });
});