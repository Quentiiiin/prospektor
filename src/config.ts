export type Config = {
  text: {
    rejectCookiesButton: string;
    resultPanelTitle: string;
    resultPanelEndReached: string;
    infoBoxTitle: string;
    infoBoxAddress: string;
    infoBoxPhone: string;
    infoBoxWebsite: string;
    cookiePageTitle: string;
    advertisingLabel: string;
    contactLinks: string[];
  };
  settings: {
    devmode: boolean;
    headless: boolean | 'shell';
    printLogsToTerminal: boolean;
    blockUnnecessaryTraffic: boolean;
    fileType: 'csv';
    saveFolder: string;
    visitProspectWebsite: boolean;
    timeoutBetweenInfoBoxScrape: number;
    viewport: {
      width: number;
      height: number;
    };
  };
};

const defaultConfig: Config = {
  text: {
    rejectCookiesButton: 'Reject all',
    resultPanelTitle: 'Results for',
    resultPanelEndReached: `You've reached the end of the list.`,	
    infoBoxTitle: 'About',
    infoBoxAddress: 'Address:',
    infoBoxPhone: 'Phone:',
    infoBoxWebsite: 'Website:',
    cookiePageTitle: 'Before you continue to Google Maps',
    advertisingLabel: 'Sponsored',
    contactLinks: ['impressum', 'kontakt', 'contact'],
  },
  settings: {
    devmode: false,
    headless: true,
    printLogsToTerminal: true,
    blockUnnecessaryTraffic: true,
    fileType: 'csv',
    saveFolder: './prospects/',
    visitProspectWebsite: true,
    timeoutBetweenInfoBoxScrape: 1000,
    viewport: {
      width: 1920,
      height: 900,
    },
  },
};

export default defaultConfig;