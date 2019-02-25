import { CarFactory } from './car-factory';
import { UIUpdater } from './utils/ui-updater';
const consoleLog = console.log;
const uiUpdater = new UIUpdater();
console.log = (target?: any, ...args: any[]) => { uiUpdater.update(target, ...args); consoleLog(target, ...args); };

const startButton = document.getElementById('btn-start');
const startAssemblyLine1 = document.getElementById('btn-start-assembly-line-1');
const startAssemblyLine2 = document.getElementById('btn-start-assembly-line-2');
const stopAssemblyLine1 = document.getElementById('btn-stop-assembly-line-1');
const stopAssemblyLine2 = document.getElementById('btn-stop-assembly-line-2');
const stopButton = document.getElementById('btn-stop');
const startBlueButton = document.getElementById('btn-start-blue');
const startRedButton = document.getElementById('btn-start-red');
const startBlackButton = document.getElementById('btn-start-black');
const startWhiteButton = document.getElementById('btn-start-white');
const startPaintShopButton = document.getElementById('btn-start-paint-shop');
const stopPaintShopButton = document.getElementById('btn-stop-paint-shop');
const carFactory = new CarFactory();

startButton.onclick = () => carFactory.startFactory();
stopButton.onclick = () => carFactory.stopFactory();
stopAssemblyLine1.onclick = () => carFactory.stopCreatingCars(1);
stopAssemblyLine2.onclick = () => carFactory.stopCreatingCars(2);
startAssemblyLine1.onclick = () => carFactory.startCreatingCars(1);
startAssemblyLine2.onclick = () => carFactory.startCreatingCars(2);

startBlueButton.onclick = () => carFactory.createCarsInColor('blue');
startRedButton.onclick = () => carFactory.createCarsInColor('red');
startBlackButton.onclick = () => carFactory.createCarsInColor('black');
startWhiteButton.onclick = () => carFactory.createCarsInColor('white');
startPaintShopButton.onclick = () => carFactory.startPaintingCars();
stopPaintShopButton.onclick = () => carFactory.stopPaintingCars();
