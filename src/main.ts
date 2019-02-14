import { CarFactory } from './car-factory';
import { UIUpdater } from './utils/ui-updater';
const consoleLog = console.log;
const uiUpdater = new UIUpdater();
console.log = (target?: any, ...args: any[]) => { uiUpdater.update(target, ...args); consoleLog(target, ...args); };

const startButton = document.getElementById('btn-start');
const stopAssemblyLine = document.getElementById('btn-stop-assembly-line');
const stopButton = document.getElementById('btn-stop');
const startBlueButton = document.getElementById('btn-start-blue');
const startRedButton = document.getElementById('btn-start-red');
const startBlackButton = document.getElementById('btn-start-black');
const startWhiteButton = document.getElementById('btn-start-white');
const carFactory = new CarFactory();

startButton.onclick = () => carFactory.startFactory();
stopButton.onclick = () => carFactory.stopFactory();
stopAssemblyLine.onclick = () => carFactory.stopCreatingCars();

startBlueButton.onclick = () => carFactory.createCarsInColor('blue');
startRedButton.onclick = () => carFactory.createCarsInColor('red');
startBlackButton.onclick = () => carFactory.createCarsInColor('black');
startWhiteButton.onclick = () => carFactory.createCarsInColor('white');
