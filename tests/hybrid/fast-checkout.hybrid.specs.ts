import { test, expect } from '@playwright/test';
import { AuthApi } from '../../src/api/AuthApi';

test.describe('Hybrid API + UI Flows', () => {
  test('Should bypass UI login via API token injection and access My Account', async ({ page, request }) => {
    const authApi = new AuthApi(request);
    const email = process.env.TEST_USER_EMAIL!;
    const password = process.env.TEST_USER_PASSWORD!;

    // 1. API Step: Authenticate via backend API in milliseconds
    const token = await authApi.getAuthToken(email, password);

    // 2. Hybrid Step: Inject JWT token into browser localStorage before page loads
    await page.addInitScript((value) => {
      window.localStorage.setItem('auth-token', value);
    }, token);

    // 3. UI Step: Navigate directly to protected route without touching the login page
    await page.goto('/account');
    await expect(page.getByTestId('page-title')).toContainText('My account');
  });
});