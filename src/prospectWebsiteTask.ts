import {Browser} from "puppeteer";
import {ProspectInfo} from "./lib/types.js";
import scrapeProspectWebsite from "./lib/prospectWebsiteTask/scrapeProspectWebsite.js";
import  { Config } from "./config.js";

async function runProspectWebsiteTask(browser : Browser, prospects : ProspectInfo[], config: Config): Promise < ProspectInfo[] > {

    let prospectsUpdated: ProspectInfo[] = [];

    //  | all prospect websites are scraped simultaneosly
    // \/  makes things alot more complicated, might switch back to it later
    /*const tasks = [];

    for (let i = 0; i < prospects.length; i++) {
        if (prospects[i].website && prospects[i].website != "") {
            const prospect = prospects[i];
            tasks.push(scrapeProspectWebsite(browser, prospect));
        }
    }
    await Promise.all(tasks).then((values) =>{
        prospectsUpdated = values;
    });
    */

    // synchronous aproach: every website after another, slower but safer
    for (let i = 0; i < prospects.length; i++) {
        if (prospects[i].website && prospects[i].website != "") {
            const prospect = prospects[i];
            prospectsUpdated.push(await scrapeProspectWebsite(browser, prospect, config));
        }
    }



    return prospectsUpdated;
}

export default runProspectWebsiteTask;
