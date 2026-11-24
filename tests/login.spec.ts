import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const GENERIC_ERROR = 'Epic sadface: Username and password do not match any user in this service';

test.describe('SauceDemo login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
    });

    test('TC-LOGIN-001: standard user logs in with valid credentials', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('TC-LOGIN-002: locked-out user is blocked', async ({ page }) => {
        await page.fill('#user-name', 'locked_out_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page.locator('[data-test="error"]')).toHaveText(
            'Epic sadface: Sorry, this user has been locked out.'
        );
    });

    test('TC-LOGIN-003: wrong password is rejected', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'wrong_pass');
        await page.click('#login-button');

        await expect(page.locator('[data-test="error"]')).toHaveText(GENERIC_ERROR);
    });

    test('TC-LOGIN-004: unknown username is rejected', async ({ page }) => {
        await page.fill('#user-name', 'unknown_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page.locator('[data-test="error"]')).toHaveText(GENERIC_ERROR);
    });

    test('TC-LOGIN-005: empty username shows required message', async ({ page }) => {
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page.locator('[data-test="error"]')).toHaveText(
            'Epic sadface: Username is required'
        );
    });

    test('TC-LOGIN-006: empty password shows required message', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.click('#login-button');

        await expect(page.locator('[data-test="error"]')).toHaveText(
            'Epic sadface: Password is required'
        );
    });

    test('TC-LOGIN-007: both fields empty shows required message', async ({ page }) => {
        await page.click('#login-button');

        await expect(page.locator('[data-test="error"]')).toHaveText(
            'Epic sadface: Username is required'
        );
    });

    test('TC-LOGIN-008: password is case-sensitive', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'Secret_Sauce');
        await page.click('#login-button');

        await expect(page.locator('[data-test="error"]')).toHaveText(GENERIC_ERROR);
    });
});