import { Given, When, Then } from '@cucumber/cucumber';
import { DicePage } from '../../../pages/DicePage';
import { LoginPage } from '../../../pages/LoginPage';
import { expect } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../../../config/env';

let loginPage: LoginPage;
let dicePage: DicePage;
let initialBalance: number;

Given('I am logged in and navigated to Dice page for Autobet', async function () {
  loginPage = new LoginPage(this.page);
  dicePage = new DicePage(this.page);

  await loginPage.navigate(BASE_URL);
  await loginPage.openLoginModal();
  await loginPage.login(USERNAME, PASSWORD);
  await loginPage.verifyLoginSuccess();
  await dicePage.navigateToDicePage();
  await dicePage.verifyElementsLoaded();
  await dicePage.openAutobetTab();
});

When('I record my initial balance', async function () {
  await this.page.waitForTimeout(4000);
  initialBalance = await dicePage.getCurrentBalance();
  console.log(`Initial Balance: ${initialBalance}`);
});

When('I configure Autobet with bet {string} number of bets {string}', async function (betAmount: string, numberOfBets: string) {
  await dicePage.setBetAmount(betAmount);
  await dicePage.setNumberOfBets(numberOfBets);
});

When('I set Stop on Profit {string} and Stop on Loss {string}', async function (profit: string, loss: string) {
  await dicePage.setStopOnProfit(profit);
  await dicePage.setStopOnLoss(loss);
});

When('I set action on win to {string} with value {string}', async function (action: string, value: string) {
  await dicePage.setActionOnWin(action, value);
});

When('I set action on loss to {string} with value {string}', async function (action: string, value: string) {
  await dicePage.setActionOnLoss(action, value);
});

When('I start Autobet', async function () {
  await dicePage.startAutobet();
});

Then('Autobet should complete {string} bets', async function (expectedBets: string) {
  await dicePage.verifyAutobetCompleted(expectedBets);
});

Then('Autobet should stop after reaching profit {string}', async function (expectedProfit: string) {
  await dicePage.verifyStopOnProfit(expectedProfit);
});

Then('Autobet should stop after reaching loss {string}', async function (expectedLoss: string) {
  await dicePage.verifyStopOnLoss(expectedLoss);
});
