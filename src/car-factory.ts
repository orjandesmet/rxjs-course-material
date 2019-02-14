import { EMPTY, Observable, Subscription } from 'rxjs';
import { CarAssemblyLine } from './car-assembly-line';
import { CarColor } from './model/car';

export class CarFactory {

    private carAssemblyLine = new CarAssemblyLine();
    private subscription: Subscription;
    // EX04: Create the colorSubject here

    constructor() { }

    startFactory(assembly: Observable<any> = EMPTY) {
        if (this.isFactoryRunning()) {
            console.log('CarFactory', 'ALREADY_RUNNING');
            return;
        } else {
            console.log('CarFactory', 'STARTED');
            this.subscription = assembly // EX04: Replace assembly with this.createCar
                .subscribe({
                    error: err => {
                        console.log('CarFactory', 'ERROR', err);
                        console.log('CarFactory', 'STOPPED');
                    },
                    complete: () => {
                        console.log('CarFactory', 'STOPPED');
                    }
                });
        }
    }

    createCarsInColor(color: CarColor) {
        if (this.isFactoryRunning()) {
            this.stopFactory(); // EX04: Don't stop the factory when its running, instead switch to a different color by setting the color on colorSubject
        }
        console.log('CarFactory', 'SWITCH_TO_COLOR', color);
        this.startFactory(this.createCars(color)); // EX04: Put the color on the colorSubject using its next function
        console.log('CarFactory', 'SWITCHED_TO_COLOR', color);
    }

    stopFactory() {
        if (!this.isFactoryRunning()) {
            console.log('CarFactory', 'NOT_RUNNING');
            return;
        } else {
            this.subscription.unsubscribe();
            console.log('CarFactory', 'STOPPED');
        }
    }

    stopCreatingCars() {
        if (this.isFactoryRunning()) {
            console.log('CarFactory', 'ASSEMBLY_LINE_STOPPED');
            this.stopFactory();
        } else {
            console.log('CarFactory', 'NOT_RUNNING');
        }
    }

    private isFactoryRunning(): boolean {
        return this.subscription && !this.subscription.closed;
    }

    private createCars(color: CarColor) { // EX04: we wouldn't need to pass the color as a parameter, because it will be inside the colorSubject
        // EX04: This function will be called only once, so use the correct operator to switch colors from the colorSubject
        return this.carAssemblyLine.createCarOnLine(color);
    }
}