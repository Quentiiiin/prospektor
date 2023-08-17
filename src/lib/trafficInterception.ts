import {Page} from "puppeteer";
import config from "../config.js";
import { Stat, addStat } from "./stats.js";

async function registerRequestIntercepter(page: Page) {
    await page.setRequestInterception(true);
    page.on('request', req => {
        // exiting when request is already handled
        if (req.isInterceptResolutionHandled()) {
            return;
        }
        if (!config.settings.blockUnnecessaryTraffic) {
            req.continue();
            return;
        }
        const url = req.url();
        if (
            // blocking images and logs to improve performance
            url.endsWith('.png') ||
            url.endsWith('.jpg') || 
            url.includes('googleusercontent.com') || 
            url.includes('google.com/maps/preview/log204') ||
            url.includes('streetviewpixels-pa.googleapis.com') ||
            url.includes('play.google.com')
        ) {
            addStat(Stat.BLOCKED_REQUESTS);
            req.abort();
        } else {
            addStat(Stat.REQUESTS);
            req.continue();
        }
    });
}

export default registerRequestIntercepter;