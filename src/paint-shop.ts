import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscriber, timer } from 'rxjs';
import { delay, distinctUntilChanged, map, mergeMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Car, CarColor } from './model/car';

export class PaintShop {

    private isRunningSubject = new BehaviorSubject<boolean>(false);
    private waitingLine = new Subject<Car>();
    private colorSubject = new BehaviorSubject<CarColor>('black');
    startTime: number;
    endTime: number;
    constructor() {
        const DURATION = 500;
        this.startTime = DURATION * 0.3;
        this.endTime = DURATION * 0.7;

        this.waitingLine.pipe(
            this.replayWhen(this.isRunningSubject),
            withLatestFrom(this.colorSubject),
            mergeMap(([car, color]) => this.paintCar(car, color)),
        ).subscribe();
    }

    addCarToWaitingLine(car: Car) {
        this.waitingLine.next(car);
    }

    switchToColor(color: CarColor) {
        console.log('PaintShop', 'SWITCH', color);
        this.colorSubject.next(color);
    }

    start() {
        this.isRunningSubject.next(true);
    }

    stop() {
        this.isRunningSubject.next(false);
    }

    paintCar(car: Car, color: CarColor): Observable<Car> {
        return timer(this.startTime).pipe(
            tap(() => console.log('PaintShop', 'STARTED', color)),
            delay(this.endTime),
            map(() => ({ ...car, color })),
            tap(paintedCar => console.log('PaintShop', 'FINISHED', paintedCar)),
        );
    }

    private replayWhen = <T>(condition$: Observable<boolean>) => (source: Observable<T>) => source.lift<T>(replayWhenOperator(condition$));
}

function replayWhenOperator<T>(
    condition$: Observable<boolean>
) {
    return function replayWhenOperation(this: Subscriber<T>, source: Observable<T>) {
        let innerSubject: ReplaySubject<T>;
        let cancel = new Subject();

        source.subscribe({
            complete: () => this.complete()
        });
        condition$.pipe(
            distinctUntilChanged()
        ).subscribe(value => {
            // TODO this doesn't work yet. The point is that replay is only filled when condition is false
            if (value) {
                if (innerSubject) {
                    innerSubject.pipe(takeUntil(cancel))
                    .subscribe({
                        next: (value) => this.next(value),
                        error: (error) => this.error(error),
                    });
                } else {
                    source.pipe(takeUntil(cancel)).subscribe({
                        next: (value) => this.next(value),
                        error: (error) => this.error(error),
                    });
                }
            } else {
                cancel.next();
                innerSubject = new ReplaySubject<T>();
                source.pipe(takeUntil(cancel)).subscribe(innerSubject);
            }
        }, error => {
            this.error(error);
        }, () => {
            this.complete();
        });
    };
}
