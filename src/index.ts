import puppeteer from 'puppeteer';
import config from './config.js';
import addLog from './lib/logger.js';
import runMapTask from './mapsTask.js';
import {Stat, getStat} from './lib/stats.js';
import save from './lib/saveToFile.js';
import runProspectWebsiteTask from './prospectWebsiteTask.js';
import scrapeProspectWebsite from './lib/prospectWebsiteTask/scrapeProspectWebsite.js';

addLog("launching browser");

const browser = await puppeteer.launch({headless: config.settings.headless});


const searchTerm = "dachdecker in münchen";
const prospects = await runMapTask(browser, searchTerm);



const prospectsFinal = await runProspectWebsiteTask(browser, prospects);

save(prospectsFinal, searchTerm);

await browser.close();
addLog(`Prospects: ${
    getStat(Stat.PROSPECTS)
}`);
addLog(`Blocked Requests: ${
    getStat(Stat.BLOCKED_REQUESTS)
}`);
addLog(`Requests: ${
    getStat(Stat.REQUESTS)
}`);

addLog("exiting");
