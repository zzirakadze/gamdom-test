import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DicePage extends BasePage {
  readonly balanceContainer: Locator;
  readonly betInput: Locator;
  readonly rollDiceButton: Locator;
  readonly resultContainer: Locator;
  readonly resultMessage: Locator;
  readonly profitOnWinInput: Locator;

  readonly autobetTabButton: Locator;
  readonly autobetYourBetInput: Locator;
  readonly numberOfBetsInput: Locator;
  readonly stopOnProfitInput: Locator;
  readonly stopOnLossInput: Locator;
  readonly startAutobetButton: Locator;
  readonly onWinResetButton: Locator;
  readonly onLossResetButton: Locator;
  readonly onWinIncreaseInput: Locator;
  readonly onLossIncreaseInput: Locator;
  readonly toastSubTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.balanceContainer = page.locator('div[data-testid="headerUserBalance"]');
    this.betInput = page.locator('[data-testid="diceYourBetContainer"] input[data-testid="Input"]');
    this.rollDiceButton = page.locator('button[data-testid="rollDiceBtn"]');
    this.resultContainer = page.locator('div[data-testid="diceResult"]');
    this.resultMessage = page.locator('div[data-testid="diceGameAreaMessage"]');
    this.profitOnWinInput = page.locator('[data-testid="diceProfitOnWinContainer"] input');
    this.toastSubTitle = page.locator('[data-testid="toastSubTitle"]');

    this.autobetTabButton = page.locator('span:has-text("Autobet")');
    this.autobetYourBetInput = page.locator('label:has-text("Your bet")').locator('..').locator('input');
    this.numberOfBetsInput = page.locator('label:has-text("Number of Bets")').locator('..').locator('input');
    this.stopOnProfitInput = page.locator('label:has-text("Stop on Profit")').locator('..').locator('input');
    this.stopOnLossInput = page.locator('label:has-text("Stop on Loss")').locator('..').locator('input');
    this.startAutobetButton = page.locator('button:has-text("Start Autobet")');
    this.onWinResetButton = page.locator('label:has-text("On Win") >> .. >> button:has-text("Reset")');
    this.onLossResetButton = page.locator('label:has-text("On Loss") >> .. >> button:has-text("Reset")');
    this.onWinIncreaseInput = page.locator('label:has-text("On Win")').locator('..').locator('input');
    this.onLossIncreaseInput = page.locator('label:has-text("On Loss")').locator('..').locator('input');
  }

  async navigateToDicePage() {
    await this.page.goto(`${process.env.BASE_URL}/dice`, { waitUntil: 'load' });
  }

  async verifyElementsLoaded(): Promise<void> {
    await this.waitForVisible(this.balanceContainer, 10000);
    await this.waitForVisible(this.betInput, 10000);
    await this.waitForVisible(this.rollDiceButton, 10000);
  }

  async getToastSubTitle(): Promise<string> {
    const text = await this.getText(this.toastSubTitle);
    return text.trim();
  }

  async openAutobetTab() {
    await this.click(this.autobetTabButton);
    await this.page.waitForTimeout(1000);
  }

  async getCurrentBalance(): Promise<number> {
    const text = await this.getText(this.balanceContainer);
    return parseFloat(text.replace('$', '').replace(/,/g, '').trim());
  }

  async placeBet(amount: string) {
    await this.betInput.fill('');
    await this.type(this.betInput, amount);
    await this.click(this.rollDiceButton);
  }

  async getDiceResult(): Promise<number> {
  const resultElement = this.resultContainer.first();
  await resultElement.waitFor({ state: 'visible', timeout: 10000 });

  const resultText = await resultElement.textContent();
  if (!resultText) {
    console.error('getDiceResult failed: no text content!');
    return 0;
  }

  console.log(`Dice result: ${resultText.trim()}`);
  return parseFloat(resultText.trim());
}


  async getResultMessage(): Promise<string> {
    await this.waitForVisible(this.resultMessage, 10000);
    return await this.getText(this.resultMessage);
  }

  async getProfitOnWin(): Promise<number> {
    await this.waitForVisible(this.profitOnWinInput, 10000);
    const text = await this.getText(this.profitOnWinInput);
    return parseFloat(text.trim());
  }

  async setBetAmount(amount: string) {
    await this.autobetYourBetInput.fill('');
    await this.type(this.autobetYourBetInput, amount);
  }

  async setNumberOfBets(bets: string) {
    await this.numberOfBetsInput.fill('');
    await this.type(this.numberOfBetsInput, bets);
  }

  async setStopOnProfit(profit: string) {
    await this.stopOnProfitInput.fill('');
    await this.type(this.stopOnProfitInput, profit);
  }

  async setStopOnLoss(loss: string) {
    await this.stopOnLossInput.fill('');
    await this.type(this.stopOnLossInput, loss);
  }

  async setActionOnWin(action: string, value: string) {
    if (action.toLowerCase() === 'reset') {
      await this.onWinResetButton.click();
    } else if (action.toLowerCase() === 'increase by') {
      await this.onWinIncreaseInput.fill('');
      await this.type(this.onWinIncreaseInput, value);
    }
  }

  async setActionOnLoss(action: string, value: string) {
    if (action.toLowerCase() === 'reset') {
      await this.onLossResetButton.click();
    } else if (action.toLowerCase() === 'increase by') {
      await this.onLossIncreaseInput.fill('');
      await this.type(this.onLossIncreaseInput, value);
    }
  }

  async startAutobet() {
  console.log(`Clicking Start Autobet`);
  await this.startAutobetButton.click();

  console.log(`Waiting for dice result to update...`);
  const firstDiceResult = this.resultContainer.first();
  await firstDiceResult.waitFor({ state: 'visible', timeout: 10000 });

  await this.page.waitForTimeout(1000);

  console.log(`Autobet started successfully!`);
}

async collectAllDiceResultsDuringAutobet(expectedBets: number): Promise<number[]> {
  console.log(`Collecting all dice results for ${expectedBets} expected bets...`);

  const diceResultLocator = this.page.locator('[data-testid="diceResult"]');
  const collectedResults: string[] = [];
  let attempts = 0;

  while (collectedResults.length < expectedBets && attempts < expectedBets * 20) { // allow retries
    const results = await diceResultLocator.allTextContents();

    for (const result of results) {
      const cleanedResult = result.trim();
      if (cleanedResult && !collectedResults.includes(cleanedResult)) {
        collectedResults.push(cleanedResult);
        console.log(`New dice result captured: ${cleanedResult} (Total: ${collectedResults.length})`);
      }
    }

    if (collectedResults.length >= expectedBets) {
      console.log(`Collected expected number of bets: ${collectedResults.length}`);
      break;
    }

    await this.page.waitForTimeout(300); // wait between checks
    attempts++;
  }

  if (collectedResults.length < expectedBets) {
    console.warn(`Collected only ${collectedResults.length} results, expected ${expectedBets}`);
  }

  return collectedResults.map(r => parseFloat(r));
}

async verifyAutobetCompleted(expectedBets: string) {
  const expected = parseInt(expectedBets, 10);

  const results = await this.collectAllDiceResultsDuringAutobet(expected);

  expect(results.length).toBe(expected);
  console.log(`Successfully verified ${results.length} bets completed!`);
}



  async verifyStopOnProfit(expectedProfit: string) {
  const startingBalance = await this.getCurrentBalance();
  const expectedBalance = startingBalance + parseFloat(expectedProfit);

  const timeoutMs = 120000;
  const startTime = Date.now();

  console.log(`Waiting for profit to reach ${expectedProfit}...`);

  while (Date.now() - startTime < timeoutMs) {
    const currentBalance = await this.getCurrentBalance();
    if (currentBalance >= expectedBalance) {
      console.log(`Profit goal reached: Current balance ${currentBalance}`);
      return;
    }
    await this.page.waitForTimeout(500); // Shorter wait
  }

  throw new Error(`Profit goal ${expectedProfit} not reached within ${timeoutMs / 1000} seconds`);
}

async verifyStopOnLoss(expectedLoss: string) {
  const startingBalance = await this.getCurrentBalance();
  const expectedBalance = startingBalance - parseFloat(expectedLoss);

  const timeoutMs = 120000;
  const startTime = Date.now();

  console.log(`Waiting for loss to reach ${expectedLoss}...`);

  while (Date.now() - startTime < timeoutMs) {
    const currentBalance = await this.getCurrentBalance();
    if (currentBalance <= expectedBalance) {
      console.log(`Loss goal reached: Current balance ${currentBalance}`);
      return;
    }
    await this.page.waitForTimeout(500);
  }

  throw new Error(`Loss goal ${expectedLoss} not reached within ${timeoutMs / 1000} seconds`);
}

}
