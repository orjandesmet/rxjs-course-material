export class Logger {
    static logElement = document.getElementById('log');
    static log(...text: any[]) {
    const time = new Date();
    const ms = ('000' + time.getMilliseconds()).slice(-3);
    Logger.logElement.innerText = `${Logger.logElement.innerText}\n${time.toLocaleTimeString()}.${ms}: ${text.join(',')}`;
    }
}
