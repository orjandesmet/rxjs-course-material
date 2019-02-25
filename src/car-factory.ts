import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CarAssemblyLine } from './car-assembly-line';
import { Car, CarColor } from './model/car';
import { PaintShop } from './paint-shop';

export class CarFactory {

    private subscription: Subscription;
    private stopAssemblySubject = new Subject<number>();
    private paintShop = new PaintShop();
    private carAssemblyLines = {
        1: new CarAssemblyLine(1),
        2: new CarAssemblyLine(2),
    };
    private createdCars = new Subject<{ car: Car, counter: number }>();

    constructor() { }

    startFactory() {
        if (this.isFactoryRunning()) {
            console.log('CarFactory', 'ALREADY_RUNNING');
            return;
        } else {
            console.log('CarFactory', 'STARTED');
            this.subscription = this.createdCars
                .subscribe(({ car }) => {
                    this.paintShop.addCarToWaitingLine(car);
                }, err => {
                    console.log('CarFactory', 'ERROR', err);
                }, () => {
                    console.log('CarFactory', 'STOPPED');
                });
            this.startCreatingCars(1);
            this.startCreatingCars(2);
        }
    }

    createCarsInColor(color: CarColor) {
        console.log('CarFactory', 'SWITCH_TO_COLOR', color);
        this.paintShop.switchToColor(color);
        console.log('CarFactory', 'SWITCHED_TO_COLOR', color);
    }

    stopFactory() {
        if (!this.isFactoryRunning()) {
            console.log('CarFactory', 'NOT_RUNNING');
            return;
        } else {
            this.stopCreatingCars(1);
            this.stopCreatingCars(2);
            this.stopPaintingCars();
            this.subscription.unsubscribe();
            console.log('CarFactory', 'STOPPED');
        }
    }

    startCreatingCars(assemblyLine: 1 | 2) {
        if (this.isFactoryRunning()) {
            console.log('CarFactory', 'ASSEMBLY_LINE_STARTED', assemblyLine);
            this.carAssemblyLines[assemblyLine].createCarOnLine().pipe(
                takeUntil(this.stopAssemblySubject.pipe(filter(value => value === assemblyLine)))
            ).subscribe({
                next: (value) => this.createdCars.next(value),
                error: (error) => this.createdCars.error(error),
            });
        } else {
            console.log('CarFactory', 'NOT_RUNNING');
        }
    }

    stopCreatingCars(assemblyLine: 1 | 2) {
        if (this.isFactoryRunning()) {
            console.log('CarFactory', 'ASSEMBLY_LINE_STOPPED', assemblyLine);
            this.stopAssemblySubject.next(assemblyLine);
        } else {
            console.log('CarFactory', 'NOT_RUNNING');
        }
    }

    startPaintingCars() {
        this.paintShop.start();
    }

    stopPaintingCars() {
        this.paintShop.stop();
    }

    private isFactoryRunning(): boolean {
        return this.subscription && !this.subscription.closed;
    }
}