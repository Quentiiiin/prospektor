const logArray: string[] = [];

function addLog(text: string) {
  const currentLog = `[${getCurrentTimeString()}] ${text}`;
  logArray.push(currentLog);
  console.log(currentLog);
}

export function getLog() {
  return logArray;
}

function getCurrentTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default addLog;
