import { BehaviorSubject, EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { CarAssemblyLine } from './car-assembly-line';
import { CarColor } from './model/car';

export class CarFactory {

    private carAssemblyLine = new CarAssemblyLine();
    private subscription: Subscription;
    private colorSubject = new BehaviorSubject<CarColor>('black');
    private stopAssemblySubject = new Subject<void>();

    constructor() { }

    startFactory(assembly: Observable<any> = EMPTY) {
        if (this.isFactoryRunning()) {
            console.log('CarFactory', 'ALREADY_RUNNING');
            return;
        } else {
            console.log('CarFactory', 'STARTED');
            this.subscription = this.createCars()
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
            console.log('CarFactory', 'SWITCH_TO_COLOR', color);
            this.colorSubject.next(color);
            console.log('CarFactory', 'SWITCHED_TO_COLOR', color);
        }
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
            this.stopAssemblySubject.next(null);
        } else {
            console.log('CarFactory', 'NOT_RUNNING');
        }
    }

    private isFactoryRunning(): boolean {
        return this.subscription && !this.subscription.closed;
    }

    private createCars() {
        return this.colorSubject.pipe(
            switchMap(color => this.carAssemblyLine.createCarOnLine(color).pipe(
                takeUntil(this.stopAssemblySubject)
            ))
        );
    }
}