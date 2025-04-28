import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../../../pages/LoginPage';
import { USERNAME, PASSWORD, BASE_URL } from '../../../config/env';

let loginPage: LoginPage;

Given('I open the login page', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate(BASE_URL);
  await loginPage.openLoginModal();
});

Then('All login page elements should be loaded', async function () {
  await loginPage.verifyElementsLoaded();
});

When('I login with valid username and password', async function () {
  await loginPage.login(USERNAME, PASSWORD);
});

When(
  'I attempt to login with username {string} and password {string}',
  async function (username: string, password: string) {
    await loginPage.login(username, password);
  }
);

Then('I should see tooltip {string} on the {string}', async function (expectedTooltip: string, field: string) {
  if (field === 'both') {
    const expectedTooltips = expectedTooltip.split(',').map(t => t.trim());

    const usernameTooltip = await loginPage.hoverAndGetTooltip('username');
    const passwordTooltip = await loginPage.hoverAndGetTooltip('password');

    if (usernameTooltip !== expectedTooltips[0]) {
      throw new Error(`Username tooltip mismatch. Expected: "${expectedTooltips[0]}", Actual: "${usernameTooltip}"`);
    }

    if (passwordTooltip !== expectedTooltips[1]) {
      throw new Error(`Password tooltip mismatch. Expected: "${expectedTooltips[1]}", Actual: "${passwordTooltip}"`);
    }
  } else {
    const tooltip = await loginPage.hoverAndGetTooltip(field as 'username' | 'password');
    if (tooltip !== expectedTooltip) {
      throw new Error(`Tooltip mismatch. Expected: "${expectedTooltip}", Actual: "${tooltip}"`);
    }
  }
});



Then('I should see the welcome message', async function () {
  await loginPage.verifyLoginSuccess();
});
