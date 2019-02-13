import { CarFactory } from './car-factory';
import { UIUpdater } from './utils/ui-updater';
const consoleLog = console.log;
const uiUpdater = new UIUpdater();
console.log = (target?: any, ...args: any[]) => { uiUpdater.update(target, ...args); consoleLog(target, ...args); };

const startButton = document.getElementById('btn-start');
const stopButton = document.getElementById('btn-stop');
const startBlueButton = document.getElementById('btn-start-blue') as HTMLButtonElement;
const carFactory = new CarFactory(startBlueButton);

startButton.onclick = () => carFactory.startFactory();
stopButton.onclick = () => carFactory.stopFactory();

startBlueButton.onclick = () => carFactory.createCarsInColor('blue');
