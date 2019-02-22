import { EMPTY, Observable, timer, zip } from 'rxjs';
import { bufferCount, catchError, concatMap, delay, map, mergeMap, scan, tap } from 'rxjs/operators';
import { Car, CarColor } from './model/car';
import { Seat } from './model/seat';
import { SteeringWheel } from './model/steering-wheel';
import { Wheel } from './model/wheel';
import { PaintShop } from './paint-shop';

export class CarAssemblyLine {

    constructor(private paintShop: PaintShop) { }

    createCarOnLine(color: CarColor) {
        console.log('CarAssemblyLine', `START_CREATING_CAR`, color);
        return zip(this.createChassis(), this.createWheels(), this.createSteeringWheel(), this.createSeats())
            .pipe(
                concatMap(([chassisNr, wheels, steeringWheel, seats]) => this.assembleCar(chassisNr, wheels, steeringWheel, seats)),
                concatMap(car => this.paintShop.paintCar(car, color)),
                map(car => ({ car, counter: 1 })),
                scan((acc, next) => ({ car: next.car, counter: acc.counter + 1 }), { car: null, counter: 0 }),
                tap(({ car, counter }) => {
                    console.log('CarAssemblyLine', 'FINISHED_CREATING_CAR', car, counter);
                }));
    }

    private createChassis(): Observable<string> {
        return timer(0, 1000).pipe(
            delay(250),
            tap(() => console.log('Chassis', 'STARTED')),
            delay(500),
            mergeMap(tick => Car.createChassisNumber({tick}).pipe(
                catchError(err => {
                    console.log('Chassis', 'RESOLVED_ERROR', err);
                    return EMPTY;
                }))
            ),
            tap(chassisNumber => console.log('Chassis', 'FINISHED', chassisNumber)),
        );
    }

    private createWheels(): Observable<Wheel[]> {
        return timer(0, 250).pipe(
            delay(75),
            tap(() => console.log('Wheels', 'STARTED')),
            delay(150),
            mergeMap(tick => Wheel.createWheel({tick}).pipe(
                catchError(err => {
                    console.log('Wheels', 'RESOLVED_ERROR', err);
                    return EMPTY;
                }))
            ),
            scan((acc, current) => ({...current, count: (acc.count % 4) + 1})),
            tap(wheel => console.log('Wheels', 'FINISHED', wheel)),
            bufferCount(4),
        );
    }

    private createSteeringWheel(): Observable<SteeringWheel> {
        return timer(0, 1000).pipe(
            delay(250),
            tap(() => console.log('SteeringWheel', 'STARTED')),
            delay(500),
            mergeMap(tick => SteeringWheel.createSteeringWheel({tick}).pipe(
                catchError(err => {
                    console.log('SteeringWheel', 'RESOLVED_ERROR', err);
                    return EMPTY;
                }))
            ),
            tap(steeringWheel => console.log('SteeringWheel', 'FINISHED', steeringWheel)),
        );
    }

    private createSeats(): Observable<Seat[]> {
        return timer(0, 500).pipe(
            delay(150),
            tap(() => console.log('Seats', 'STARTED')),
            delay(300),
            mergeMap(tick => Seat.createSeat({tick}).pipe(
                catchError(err => {
                    console.log('Seats', 'RESOLVED_ERROR', err);
                    return EMPTY;
                }))
            ),
            scan((acc, current) => ({...current, count: (acc.count % 2) + 1})),
            tap(seats => console.log('Seats', 'FINISHED', seats)),
            bufferCount(2),
        );
    }

    private assembleCar(chassisNumber: string, wheels: Wheel[], steeringWheel: SteeringWheel, seats: Seat[]): Observable<Car> {
        return timer(300).pipe(
            tap(() => console.log('CarAssemblyLine', 'START_ASSEMBLING')),
            delay(700),
            map(() => Car.build({ chassisNumber, wheels, steeringWheel, seats })),
            tap(() => console.log('CarAssemblyLine', 'FINISHED_ASSEMBLING')),
        );
    }
}
