#!/usr/bin/env/ node
import puppeteer from 'puppeteer';
import * as inquirer from '@inquirer/prompts';
import * as urlLib from 'url';
import { createObjectCsvWriter } from 'csv-writer';


let startTime;
let requestCount = 0;

const prospects = [];

const csvWriter = createObjectCsvWriter({
  path: 'prospects.csv',
  header: [
      {id: 'name', title: 'NAME'},
      {id: 'phone', title: 'PHONE'},
      {id: 'website', title: 'WEBSITE'},
      {id: 'address', title: 'ADDRESS'},
  ]
});

const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

const browser = await puppeteer.launch({headless: false});


// Strings that are used for navigating the site
  const REJECT_COOKIES = "Alle ablehnen";
  const RESULTS_FOR = "Ergebnisse für"
  const END_REACHED = "Das Ende der Liste ist erreicht.";
  const INFORMATION_FOR = "Informationen zu";
  const ADDRESS = "Adresse:";
  const PHONE = "Telefon:";
  const WEBSITE = "Website:";
  const COOKIE_TITLE = "Bevor Sie zu Google Maps"


  //searchTerm = await inquirer.input({ message: 'Enter the search prompt'});

  timerStart();



  const task1  = await run("dachdecker in münchen");
  /*const task2  = await run("dachdecker in berlin");
  const task3  = await run("dachdecker in köln");
  const task4  = await run("dachdecker in hamburg");
  const task5  = await run("dachdecker in frankfurt");*/


  const timeNeeded = timerStop();
  console.log(`Found ${prospects.length} prospects in ${timeNeeded} seconds with ${requestCount} requests`);

  csvWriter.writeRecords(prospects)
  .then(() => {
      console.log('CSV file has been written successfully');
  })
  .catch(error => {
      console.error('Error writing CSV file:', error);
  });




async function run(searchTerm) {

  // init
  const page = await browser.newPage();

  //request interception to remove unnecessary traffic
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (interceptedRequest.isInterceptResolutionHandled()) return;
    if (
      interceptedRequest.url().endsWith('.png') ||
      interceptedRequest.url().endsWith('.jpg') ||
      interceptedRequest.url().includes('googleusercontent.com') ||
      interceptedRequest.url().includes('google.com/maps/preview/log204') ||
      interceptedRequest.url().includes('streetviewpixels-pa.googleapis.com') ||
      interceptedRequest.url().includes('play.google.com')
    )
      interceptedRequest.abort();
    else{ 
      requestCount++;
      interceptedRequest.continue();
    }
  });

  await page.goto(createUrl(searchTerm));

  await page.setViewport({width: 1920, height: 900});


  

  // reject cookies
  if( (await page.title()).includes(COOKIE_TITLE)){
  const rejectButton = await page.$(`[aria-label="${REJECT_COOKIES}"]`);

  await rejectButton.click();
  }
  const resultListSelector = `[aria-label="${RESULTS_FOR} ${searchTerm}"]`;
  const resultList = await page.waitForSelector(resultListSelector);

  // scroll down the result list
  let hasReachedEnd = false; // IMPORTANT: Change back to false when debug is finished

  while(!hasReachedEnd){
    scrollDown(page, resultList, 2000);
    if(await queryByText(page, resultList, END_REACHED)){
      hasReachedEnd = true;
    }
  }

  //remove junk from entry list
  const allChildElements = await resultList.$$(resultListSelector + ' > *');
  let i = 0;
  const realResults = [];
  allChildElements.forEach(async (el) => {
    if(!(i < 2 || !isEven(i) || i == allChildElements.length -1)){
      realResults.push(el);
    }
    i++;
  });


  // click every entry

  for(let f = 0;f < realResults.length; f++){
    const a = await (await realResults[f].$('div')).$('a');
    await click(page, a);
    await page.waitForTimeout(1000);

    const infoBox = await page.$(`*[aria-label^="${INFORMATION_FOR}"]`);

    // scrape the info
    const addressHandle = await page.$(`*[aria-label^="${ADDRESS}"]`);
    const phoneHandle = await page.$(`*[aria-label^="${PHONE}"]`);
    const websiteHandle = await page.$(`*[aria-label^="${WEBSITE}"]`);

    let address = "";
    let phone = "";
    let website = "";
    let name = "";

    if(addressHandle)
      address = (await getPropValue(page, addressHandle, "aria-label")).replace(ADDRESS, "").replace('„','').replace('“', '');;
    if(phoneHandle)
      phone = (await getPropValue(page, phoneHandle, "aria-label")).replace(PHONE, "").replace('„','').replace('“', '');;
    if(websiteHandle){
      website = (await getPropValue(page, websiteHandle, "href")).replace(WEBSITE, "").replace('„','').replace('“', '');
    name = (await getPropValue(page, infoBox, "aria-label")).replace(INFORMATION_FOR, "").replace('„','').replace('“', '');


    const data = {
      "name":name,
      "address":address,
      "phone":phone,
      "website":website,
    };
    if(!prospects.includes(data)){
      prospects.push(data);
    }else{
    }
  }
};
}
function createUrl(term){
    return `https://www.google.com/maps/search/${term.replace(' ','+')}`;
}

async function scrollDown(page, element, amount){
  await page.evaluate((element, amount) => {
    element.scrollBy(0, amount);
  }, element, amount);
}

async function queryByText(page, parent, text){
  for (const element of await parent.$$('*')) {
    if ((await getTextContent(page, element)).includes(text)) {
      return element;
    }
  }
}

async function getTextContent(page, element){
  return await page.evaluate((element) => {
    return element.textContent;
  }, element);
}

function timerStart(){
  startTime = new Date();
}

function timerStop(){
  if(startTime){
    return (new Date().getTime() - startTime.getTime()) / 1000;
  }
  else return 0;
}

function isEven(number) {
  return number % 2 === 0;
}

async function click(page, handle){
  await page.evaluate(el => el.click(),handle);
}

async function getPropValue(page, handle, name){
  if(handle){
    return await page.evaluate((el, name) => el.getAttribute(name), handle, name);
  }else return "";
}

/*
async function scrapeProspectWebsite(url){
  //init
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({width: 1920, height: 900});

  const emails = await getEmails(page);

  const links = await page.$$('a');

  let targetLinkHandle = null;

  for (const link of links) {
    const linkText = await link.evaluate(node => node.textContent);

    if (linkText.includes('Impressum')) {
      targetLinkHandle = link;
      break;
    }
  }

  if (targetLinkHandle) {
    const linkHref = await targetLinkHandle.evaluate(node => node.getAttribute('href'));
    const absoluteLinkHref = urlLib.resolve(page.url(), linkHref);

    const newPage = await browser.newPage();
    await newPage.goto(absoluteLinkHref);

    emails.push((await getEmails(newPage)).forEach((e) => {emails.push(e)}));
    newPage.close();
  }
  page.close();
  return emails[0];
}


async function getEmails(page){
  const mainContent = await page.content();
  const emails = [];

  const mainMails = mainContent.match(emailPattern);
  if(mainMails)
  mainMails.forEach((e) => {emails.push(e)});

  const iframes = await page.$$('iframe');

  for (const iframe of iframes) {
    const frame = await iframe.contentFrame();
    if (frame) {
      const iframeContent = await frame.content();
      const iMails = iframeContent.match(emailPattern);
      if(iMails)
      iMails.forEach((e) => {emails.push(e)});
    }
  }
  return emails;
}
*/