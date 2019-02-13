import { Subscription } from 'rxjs';
import { CarAssemblyLine } from './car-assembly-line';

export class CarFactory {

    private carAssemblyLine = new CarAssemblyLine();
    private subscription: Subscription;

    constructor(private startBlueButton: HTMLButtonElement) { }

    startFactory() {
        if (this.isFactoryRunning()) {
            console.log('CarFactory', 'ALREADY_RUNNING');
            return;
        } else {
            console.log('CarFactory', 'STARTED');
        }
    }

    createCarsInColor(color: string) {
        if (this.isFactoryRunning()) {
            this.stopFactory();
        }
        this.startBlueButton.setAttribute('disabled', 'true');
        console.log('CarFactory', 'SWITCH_TO_COLOR', color);
        this.subscription = this.createCar(color).subscribe(() => {
            this.startBlueButton.removeAttribute('disabled');
        });
        console.log('CarFactory', 'SWITCHED_TO_COLOR', color);
    }

    stopFactory() {
        if (!this.isFactoryRunning()) {
            console.log('CarFactory', 'NOT_RUNNING');
            return;
        } else {
            this.subscription.unsubscribe();
            this.startBlueButton.removeAttribute('disabled');
            console.log('CarFactory', 'STOPPED');
        }
    }

    private isFactoryRunning(): boolean {
        return this.subscription && !this.subscription.closed;
    }

    private createCar(color: string) {
        return this.carAssemblyLine.createCarOnLine(color);
    }
}