import { Browser } from 'puppeteer';
import { Config } from '../../config.js';
import addLog from '../logger.js';
import registerRequestIntercepter from '../trafficInterception.js';
import { scrapeEmails } from './scrapeEmails.js';

async function scrapeProspectContactPage(
  browser: Browser,
  url: string,
  config: Config,
): Promise<string[]> {
  addLog(`scraping prospect site: ${url}`);

  const page = await browser.newPage();

  await registerRequestIntercepter(page, config);

  await page.setJavaScriptEnabled(false);

  try {
    await page.goto(url, {
      timeout: 10 * 1000,
    });
  } catch (error: any) {
    console.error(error);
    addLog('page could not be loaded: ' + url);
  }

  await page.setViewport({
    width: config.settings.viewport.width,
    height: config.settings.viewport.height,
  });

  let emails = await scrapeEmails(page);
  await page.close();
  return emails;
}

export default scrapeProspectContactPage;
