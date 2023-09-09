import { Browser, ElementHandle, Page, Target } from 'puppeteer';
import registerRequestIntercepter from '../trafficInterception.js';
import { Config } from '../../config.js';
import { scrapeEmails } from './scrapeEmails.js';
import { findContactLinks } from './findContactLinks.js';
import { click, mostCommonString } from '../helper.js';
import addLog from '../logger.js';
import { ProspectInfo } from '../types.js';

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

  return emails;
}

export default scrapeProspectContactPage;
