import { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, Page } from '@playwright/test';
import { BROWSER } from '../../../config/env';

let browser: Browser;
let page: Page;

const isDocker = process.env.IS_DOCKER === 'true';

BeforeAll(async function () {
  console.log(`Launching browser: ${BROWSER} (Docker mode: ${isDocker})`);

  const launchOptions = {
    headless: isDocker ? true : false,
    args: isDocker
      ? ['--no-sandbox', '--disable-setuid-sandbox']
      : ['--start-maximized'],
  };

  switch (BROWSER) {
    case 'chromium':
      browser = await chromium.launch(launchOptions);
      break;
    case 'firefox':
      browser = await firefox.launch(launchOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(launchOptions);
      break;
    default:
      throw new Error(`Unsupported browser specified: ${BROWSER}`);
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
    console.log('Browser closed after all tests.');
  }
});

Before(async function () {
  const context = await browser.newContext({
    viewport: null,
  });
  page = await context.newPage();
  this.page = page;
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    console.log(`Scenario failed, taking screenshot: ${scenario.pickle.name}`);
    const screenshot = await this.page.screenshot({
      path: `allure-results/${scenario.pickle.name.replace(/\s+/g, '_')}.png`,
      type: 'png',
    });
    this.attach(screenshot, 'image/png');
  }
  await this.page.close();
});
