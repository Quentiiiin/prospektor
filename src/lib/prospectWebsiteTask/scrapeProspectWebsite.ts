import { Browser } from 'puppeteer';
import { Config } from '../../config.js';
import { mostCommonString } from '../helper.js';
import addLog from '../logger.js';
import registerRequestIntercepter from '../trafficInterception.js';
import { ProspectInfo } from '../types.js';
import { findContactLinks } from './findContactLinks.js';
import { scrapeEmails } from './scrapeEmails.js';
import scrapeProspectContactPage from './scrapeProspectContactPage.js';

async function scrapeProspectWebsite(
  browser: Browser,
  prospect: ProspectInfo,
  config: Config,
): Promise<ProspectInfo> {
  const url = prospect.website;

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

  const contactLinks = await findContactLinks(page);
  if (contactLinks) {
    for (let i = 0; i < contactLinks.length; i++) {
      const cMails = await scrapeProspectContactPage(
        browser,
        contactLinks[i],
        config,
      );
      emails = emails.concat(cMails);
    }
  }
  await page.close();

  // selecting the email that appears the most
  const email = mostCommonString(emails);
  return {
    name: prospect.name,
    address: prospect.address,
    phone: prospect.phone,
    website: prospect.website,
    email: email,
  };
}

export default scrapeProspectWebsite;
