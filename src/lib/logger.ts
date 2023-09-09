const logArray: string[] = [];

function addLog(text: string) {
    const currentTime = new Date();
    const currentLog = `[${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}] ${text}`;
    logArray.push(currentLog);
    console.log(currentLog);
}

export function getLog() {
    return logArray;
}

export default addLog;

 