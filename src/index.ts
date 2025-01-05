import inquirer from "inquirer";
import { run } from "./run.js";
import config from "./config.js";

const searchTerm = await inquirer.prompt({
    name: "searchTerm",
    type: "input",
    message: "What do you want to search for?",
    default: "restaurants in Berlin",
});

const saveLocation: any = await inquirer.prompt({
    name: "saveLocation",
    type: "input",
    message: "Where do you want to save the results?",
    default: "./prospects/",
});

const visitWebsite: any = await inquirer.prompt({
    name: "visitWebsite",
    type: "confirm",
    message: "Do you want to visit the website of each prospect?",
    default: false,
});

const userConfig = config;
userConfig.settings.saveFolder = saveLocation.saveLocation;
userConfig.settings.visitProspectWebsite = visitWebsite.visitWebsite;

await run(searchTerm.searchTerm, userConfig);