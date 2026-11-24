# playwright-saucedemo
[![Playwright Tests](https://github.com/BrightWave-100/playwright-saucedemo/actions/workflows/playwright.yml/badge.svg)](https://github.com/BrightWave-100/playwright-saucedemo/actions/workflows/playwright.yml)

End-to-end tests for the SauceDemo practice site, written in TypeScript with Playwright. The suite covers login, inventory, cart, checkout, and the four built-in problem accounts.

## What this shows

Each test maps to a test case in a manual test plan, using the same IDs, so a reader can compare the automated checks against the written cases. The five known bugs from the manual testing are recorded as `test.fail()` assertions: they pass while the bug exists and will report a failure if a bug is fixed, so the suite stays green and still documents the problems.

## Tech stack

- TypeScript
- Playwright Test
- Node.js

## Prerequisites

- Node.js 18 or newer
- Google Chrome or the Playwright Chromium browser

## Quick start

```bash
git clone https://github.com/BrightWave-100/playwright-saucedemo.git
cd playwright-saucedemo
npm install
npx playwright install chromium
npx playwright test --project=chromium
```

## Test coverage

- **Login (8 tests):** valid login, locked-out user, wrong password, unknown username, empty username, empty password, both fields empty, case-sensitive password
- **Inventory (6 tests):** product list, price sort, name sort, add to cart, remove from cart, product detail page
- **Cart (5 tests):** badge count, cart contents, removing an item, persistence after refresh, Continue Shopping
- **Checkout (6 tests):** complete checkout, three missing-field errors, totals, finishing the order
- **Other accounts (7 tests):** problem_user login and add to cart, plus 5 known-bug checks for problem_user, visual_user, and error_user

## Project structure

- `tests/` holds one spec file per area: `login.spec.ts`, `inventory.spec.ts`, `cart.spec.ts`, `checkout.spec.ts`, and `other-accounts.spec.ts`.
- `playwright.config.ts` configures the browser projects and test settings.

---

Built by BrightWave-100 as a QA portfolio project.