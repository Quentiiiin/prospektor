import {Browser, ElementHandle, Page, Target} from "puppeteer";
import registerRequestIntercepter from "../trafficInterception.js";
import config from "../../config.js";
import {scrapeEmails} from "./scrapeEmails.js";
import {findContactLinks} from "./findContactLinks.js";
import {click, mostCommonString} from "../helper.js";
import addLog from "../logger.js";
import {ProspectInfo} from "../types.js";


async function scrapeProspectContactPage(browser: Browser, parentPage: Page, link: ElementHandle<Element>): Promise<string[]> {

    const newTabPromise = new Promise<Target>((resolve) => browser.once('targetcreated', resolve));


    const href: string = await parentPage.evaluate((link : any) => {
        return link.getAttribute('href');
    }, link);

    if(href.includes('mailto:') || href.includes('mailot:')){
        return [];
    }

    await parentPage.evaluate((link : any) => {
        link.target = '_blank';
        link.click();
    }, link);

    const newTabTarget: Target = await newTabPromise;
    const newTabPage: Page |null = await newTabTarget.page();


    if (newTabPage) {

        await newTabPage.setViewport({width: config.settings.viewport.width, height: config.settings.viewport.height});

        await newTabPage.waitForSelector('body');
        let emails = await scrapeEmails(newTabPage);
        await newTabPage.close();
        return emails;

    }
}

export default scrapeProspectContactPage;
