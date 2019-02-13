import { CarAssemblyLine } from './car-assembly-line';

export class CarFactory {

    private carAssemblyLine = new CarAssemblyLine();
    private isRunning = false; // EX02: Keep a Subscription here


    constructor(private startBlueButton: HTMLButtonElement) { }

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
            // EX02: this.createCar(color) will return an Observable. The function then won't exist anymore
            this.createCar(color).then(() => {
                this.startBlueButton.removeAttribute('disabled');
            });
            // EX02: End
            console.log('CarFactory', 'SWITCHED_TO_COLOR', color);
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
        // EX02: this function should return true/false based on the Subscription
        return this.isRunning;
    }

    private createCar(color: string) {
        return this.carAssemblyLine.createCarOnLine(color);
    }
}