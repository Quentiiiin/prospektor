import config from "../config.js";

const logArray: string[] = [];

function addLog(text: string) {
    const currentTime = new Date();
    const currentLog = `[${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}] ${text}`;
    logArray.push(currentLog);
    if(config.settings.printLogsToTerminal){
        console.log(currentLog);
    }
}

export default addLog;

 