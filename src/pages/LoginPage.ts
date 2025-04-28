import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly signInButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly startPlayingButton: Locator;
  readonly headerUserBalanceContainer: Locator;
  readonly clearInputButtons: Locator;
  readonly tooltipMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.signInButton = page.locator('button[data-testid="signin-nav"]');
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.startPlayingButton = page.locator('button[data-testid="start-playing-login"]');
    this.headerUserBalanceContainer = page.locator('div[data-testid="headerUserBalanceContainer"]');
    this.clearInputButtons = page.locator('button[data-testid="clearInputButton"]');
    this.tooltipMessages = page.locator('div.MuiTooltip-tooltip');
  }

  async openLoginModal() {
    await this.click(this.signInButton);
  }

  async login(username: string = process.env.USERNAME!, password: string = process.env.PASSWORD!) {
    await this.waitForVisible(this.usernameInput);
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.startPlayingButton);
  }

  async verifyLoginSuccess() {
    await this.waitForVisible(this.headerUserBalanceContainer);
  }

  async verifyElementsLoaded() {
    await this.waitForVisible(this.signInButton);
    await this.waitForVisible(this.usernameInput);
    await this.waitForVisible(this.passwordInput);
    await this.waitForVisible(this.startPlayingButton);
  }

  async hoverAndGetTooltip(field: 'username' | 'password' | 'both'): Promise<string | string[]> {
  if (field === 'both') {
    const tooltips: string[] = [];

    for (let i = 0; i < 2; i++) {
      const clearButton = this.clearInputButtons.nth(i);
      await this.hover(clearButton);
      await this.waitForVisible(this.tooltipMessages.nth(i));
      const tooltipText = await this.getText(this.tooltipMessages.nth(i));
      tooltips.push(tooltipText);
    }

    return tooltips;
  } else {
    const index = field === 'username' ? 0 : 1;
    const clearButton = this.clearInputButtons.nth(index);
    await this.hover(clearButton);
    await this.waitForVisible(this.tooltipMessages.nth(index));
    return await this.getText(this.tooltipMessages.nth(index));
  }
}

}
