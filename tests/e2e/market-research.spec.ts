import { test, expect } from '@playwright/test'

test.describe('Market Research', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to market research page
    await page.goto('/market-research')
  })

  test('should display market research form', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: 'Market Research' })).toBeVisible()
    
    // Check form elements
    await expect(page.getByText('Market Research Brief')).toBeVisible()
    await expect(page.getByLabel('Research Topic')).toBeVisible()
    await expect(page.getByText('Target Regions')).toBeVisible()
    await expect(page.getByText('Target Languages')).toBeVisible()
    await expect(page.getByText('Timeframe')).toBeVisible()
  })

  test('should show info cards', async ({ page }) => {
    await expect(page.getByText('Smart Analysis')).toBeVisible()
    await expect(page.getByText('Regional Focus')).toBeVisible()
    await expect(page.getByText('Vernacular Insights')).toBeVisible()
  })

  test('should allow region selection', async ({ page }) => {
    // Select a region
    await page.getByLabel('Maharashtra').check()
    
    // Verify selection
    await expect(page.getByText('Maharashtra')).toBeVisible()
  })

  test('should allow language selection', async ({ page }) => {
    // Select a language
    await page.getByLabel('Hindi').check()
    
    // Verify selection
    await expect(page.getByText('Hindi')).toBeVisible()
  })

  test('should validate form submission', async ({ page }) => {
    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Start Market Research' }).click()
    
    // Should show validation errors
    await expect(page.getByText('Please fill in all required fields')).toBeVisible()
  })

  test('should navigate back to home', async ({ page }) => {
    await page.getByRole('button', { name: 'Back' }).click()
    
    // Should be on home page
    await expect(page).toHaveURL('/')
  })
})
