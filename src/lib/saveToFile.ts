import { Config } from '../config.js';
import addLog from './logger.js';
import { ProspectInfo } from './types.js';
import { createObjectCsvWriter } from 'csv-writer';

/**
 * Saves the prospects to file under the specified file location in the config
 */
function save(prospects: ProspectInfo[], name: string, config: Config) {
  const filename = name.replace(' ', '_') + '.csv';
  addLog(`saving to file: ${filename} - running`);
  const path = config.settings.saveFolder + filename;
  const csvWriter = createObjectCsvWriter({
    path: path,
    header: [
      { id: 'name', title: 'NAME' },
      { id: 'phone', title: 'PHONE' },
      { id: 'website', title: 'WEBSITE' },
      { id: 'address', title: 'ADDRESS' },
      { id: 'email', title: 'EMAIL' },
    ],
  });
  csvWriter.writeRecords(prospects);
  addLog(`saving to file: ${filename} - done`);
}
export default save;
