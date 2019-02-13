import { CarAssemblyLine } from './car-assembly-line';

export class CarFactory {

    private carAssemblyLine = new CarAssemblyLine();
    private isRunning = false;

    constructor(private startBlueButton: HTMLButtonElement) {}

    startFactory() {
        if (this.isFactoryRunning()) {
            console.log('CarFactory', 'ALREADY_RUNNING');
            return;
        } else {
            this.isRunning = true;
            console.log('CarFactory', 'STARTED');
        }
    }

    createCarsInColor(color: string) {
        if (!this.isFactoryRunning()) {
            console.log('CarFactory', 'NOT_RUNNING');
            return;
        } else {
            this.startBlueButton.setAttribute('disabled', 'true');
            console.log('CarFactory', 'SWITCH_TO_COLOR', color);
            this.createCar(color);
            // EX01: this.createCar(color) should return a Promise, make sure the following lines only get executed when the promise completes
            console.log('CarFactory', 'SWITCHED_TO_COLOR', color);
            this.startBlueButton.removeAttribute('disabled');
            // EX01: End
        }
    }

    stopFactory() {
        if (!this.isFactoryRunning()) {
            console.log('CarFactory', 'NOT_RUNNING');
            return;
        } else {
            this.isRunning = false;
            console.log('CarFactory', 'STOPPED');
        }
    }

    private isFactoryRunning(): boolean {
        return this.isRunning;
    }

    private createCar(color: string) {
        this.carAssemblyLine.createCarOnLine(color);
    }
}