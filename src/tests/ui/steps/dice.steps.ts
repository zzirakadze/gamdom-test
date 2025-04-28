import { Given, When, Then } from '@cucumber/cucumber';
import { DicePage } from '../../../pages/DicePage';
import { LoginPage } from '../../../pages/LoginPage';
import { expect } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../../../config/env';

let loginPage: LoginPage;
let dicePage: DicePage;
let initialBalance: number;
let finalBalance: number;
let placedBetAmount: number;
let diceResult: number;
let resultMessage: string;
let profitOnWin: number;

Given('I am logged in and navigated to Dice page', async function () {
  loginPage = new LoginPage(this.page);
  dicePage = new DicePage(this.page);

  await loginPage.navigate(BASE_URL);
  await loginPage.openLoginModal();
  await loginPage.login(USERNAME, PASSWORD);
  await loginPage.verifyLoginSuccess();
  await dicePage.navigateToDicePage();
  await dicePage.verifyElementsLoaded();
});

When('I record initial balance', async function () {
  await this.page.waitForTimeout(4000);
  initialBalance = await dicePage.getCurrentBalance();
  console.log(`Initial Balance: ${initialBalance}`);
});

When('I place a bet of {string}', async function (amount: string) {
  placedBetAmount = parseFloat(amount);
  await dicePage.placeBet(amount);
  await this.page.waitForTimeout(4000);
});

When('I record profit on win', async function () {
  profitOnWin = await dicePage.getProfitOnWin();
  console.log(`Profit on Win: ${profitOnWin}`);
});

When('I record result and final balance', async function () {
  diceResult = await dicePage.getDiceResult();
  resultMessage = await dicePage.getResultMessage();
  await this.page.waitForTimeout(3000);
  finalBalance = await dicePage.getCurrentBalance();

  console.log(`Dice Result: ${diceResult}`);
  console.log(`Result Message: ${resultMessage}`);
  console.log(`Final Balance: ${finalBalance}`);
});

Then('the balance should be correctly updated', async function () {
  let expectedBalance: number;

  if (resultMessage.includes('Congratulations!')) {
    expectedBalance = parseFloat((initialBalance + profitOnWin).toFixed(2));
    console.log(`Win, balance must increase by profit`);
  } else {
    expectedBalance = parseFloat((initialBalance - placedBetAmount).toFixed(2));
    console.log(`Loss, balance must decrease by bet`);
  }

  console.log(`Expected Balance: ${expectedBalance}`);
  console.log(`Actual Balance: ${finalBalance}`);

  expect(finalBalance).toBeCloseTo(expectedBalance, 2);
});


Then('I should see an error message {string}', async function (expectedErrorMessage: string) {
  const actualErrorMessage = await dicePage.getToastSubTitle();
  console.log(`Error Message: ${actualErrorMessage}`);
  expect(actualErrorMessage).toBe(expectedErrorMessage);
});

Then('The balance should remain unchanged', async function () {
  const currentBalance = await dicePage.getCurrentBalance();
  console.log(`Initial Balance: ${initialBalance}`);
  console.log(`Current Balance: ${currentBalance}`);
  expect(currentBalance).toBeCloseTo(initialBalance, 2);
});