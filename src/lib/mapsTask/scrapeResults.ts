import { ElementHandle, Page } from 'puppeteer';
import { ProspectInfo } from '../types.js';
import { click, getPropValue } from '../helper.js';
import { Config } from '../../config.js';
import addLog from '../logger.js';

async function scrapeResults(
  page: Page,
  resultHandles: ElementHandle<Element>[],
  config: Config,
): Promise<ProspectInfo[]> {
  addLog(`scraping results - running`);
  const prospects: ProspectInfo[] = [];

  for (let f = 0; f < resultHandles.length; f++) {
    const a = await (await resultHandles[f].$('div')).$('a');
    await click(page, a);
    await page.waitForTimeout(config.settings.timeoutBetweenInfoBoxScrape);

    const infoBox = await page.$(
      `*[aria-label^="${config.text.infoBoxTitle}"]`,
    );

    // scrape the info
    const addressHandle = await page.$(
      `*[aria-label^="${config.text.infoBoxAddress}"]`,
    );
    const phoneHandle = await page.$(
      `*[aria-label^="${config.text.infoBoxPhone}"]`,
    );
    const websiteHandle = await page.$(
      `*[aria-label^="${config.text.infoBoxWebsite}"]`,
    );

    let address = '';
    let phone = '';
    let website = '';
    let name = '';

    if (addressHandle) {
      address = (await getPropValue(page, addressHandle, 'aria-label'))
        .replace(config.text.infoBoxAddress, '')
        .replace('„', '')
        .replace('“', '');
    }
    if (phoneHandle) {
      phone = (await getPropValue(page, phoneHandle, 'aria-label'))
        .replace(config.text.infoBoxPhone, '')
        .replace('„', '')
        .replace('“', '');
    }
    if (websiteHandle) {
      website = (await getPropValue(page, websiteHandle, 'href'))
        .replace(config.text.infoBoxWebsite, '')
        .replace('„', '')
        .replace('“', '');
      name = (await getPropValue(page, infoBox, 'aria-label'))
        .replace(config.text.infoBoxTitle, '')
        .replace('„', '')
        .replace('“', '');
    }

    const data: ProspectInfo = {
      name: name,
      address: address,
      phone: phone,
      website: website,
      email: '',
    };
    if (!prospects.includes(data)) {
      prospects.push(data);
    }
  }
  addLog(`scraping results - done`);
  return prospects;
}

export default scrapeResults;
