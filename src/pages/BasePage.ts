import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string) {
    logger.info({ action: 'navigate', url: url }, 'Navigating to URL');
    try {
      await this.page.goto(url, { waitUntil: 'load' });
    } catch (error) {
      logger.error({ action: 'navigate', url: url, error: (error as Error).message }, 'Navigation failed');
      throw new Error(`Navigation to ${url} failed`);
    }
  }

  async click(locator: Locator) {
    logger.info({ action: 'click', locator: await locator.toString() }, 'Clicking element');
    try {
      await locator.click({ timeout: 10000 });
    } catch (error) {
      logger.error({ action: 'click', locator: await locator.toString(), error: (error as Error).message }, 'Click failed');
      throw new Error('Click failed');
    }
  }

  async type(locator: Locator, text: string) {
    logger.info({ action: 'type', text }, 'Typing text into element');
    try {
      await locator.fill(text, { timeout: 10000 });
    } catch (error) {
      logger.error({ action: 'type', text, error: (error as Error).message }, 'Typing failed');
      throw new Error(`Type failed for text: ${text}`);
    }
  }

  async isVisible(locator: Locator): Promise<boolean> {
    logger.info({ action: 'check_visibility', locator: await locator.toString() }, 'Checking if element is visible');
    try {
      return await locator.isVisible();
    } catch (error) {
      logger.error({ action: 'check_visibility', locator: await locator.toString(), error: (error as Error).message }, 'Visibility check failed');
      throw new Error('Visibility check failed');
    }
  }

  async waitForVisible(locator: Locator, timeoutMs = 15000) {
  logger.info({ action: 'wait_for_visible', locator: await locator.toString() }, 'Waiting for element to be visible');
  try {
    await expect(locator).toBeVisible({ timeout: timeoutMs });
  } catch (error) {
    logger.error({ action: 'wait_for_visible', locator: await locator.toString(), error: (error as Error).message }, 'Wait for visibility failed');
    throw new Error('Wait for visibility failed');
  }
}


  async getText(locator: Locator): Promise<string> {
  logger.info({ action: 'get_text', locator: await locator.toString() }, 'Getting text or input value from element');
  try {
    const tagName = await locator.evaluate((el) => el.tagName.toLowerCase());

    if (tagName === 'input' || tagName === 'textarea') {
      const value = await locator.inputValue();
      if (!value) throw new Error('Input value is empty');
      return value.trim();
    } else {
      const text = await locator.textContent();
      if (!text) throw new Error('Text content is empty');
      return text.trim();
    }
  } catch (error) {
    logger.error({ action: 'get_text', locator: await locator.toString(), error: (error as Error).message }, 'Getting text/input value failed');
    throw new Error('Get text/input value failed');
  }
}


  async hover(locator: Locator) {
    logger.info({ action: 'hover', locator: await locator.toString() }, 'Hovering over element');
    try {
      await locator.hover({ timeout: 10000 });
    } catch (error) {
      logger.error({ action: 'hover', locator: await locator.toString(), error: (error as Error).message }, 'Hover failed');
      throw new Error('Hover failed');
    }
  }

  abstract verifyElementsLoaded(): Promise<void>;
}