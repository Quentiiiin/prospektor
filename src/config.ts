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
  };
  settings: {
    headless: boolean | 'new';
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

const config: Config = {
  text: {
    rejectCookiesButton: 'Alle ablehnen',
    resultPanelTitle: 'Ergebnisse für',
    resultPanelEndReached: 'Das Ende der Liste ist erreicht.',
    infoBoxTitle: 'Informationen zu',
    infoBoxAddress: 'Adresse:',
    infoBoxPhone: 'Telefon:',
    infoBoxWebsite: 'Website:',
    cookiePageTitle: 'Bevor Sie zu Google Maps',
  },
  settings: {
    headless: false,
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

export default config;
