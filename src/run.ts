import puppeteer from "puppeteer";
import  { Config } from "./config.js";
import addLog from "./lib/logger.js";
import save from "./lib/saveToFile.js";
import runMapTask from "./mapsTask.js";
import runProspectWebsiteTask from "./prospectWebsiteTask.js";

export async function run(searchTerm: string, config: Config) {
  addLog("launching browser");

  const browser = await puppeteer.launch({
    headless: config.settings.headless,
  });

  const prospects = await runMapTask(browser, searchTerm, config);

  let prospectsFinal = prospects;

  if (config.settings.visitProspectWebsite) {
    prospectsFinal = await runProspectWebsiteTask(
      browser,
      prospects,
      config,
    );
  }

  save(prospectsFinal, searchTerm, config);

  await browser.close();
  addLog("exiting");
}
