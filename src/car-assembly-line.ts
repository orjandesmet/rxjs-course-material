import { Observable, timer } from 'rxjs';
import { concatMap, delay, map, scan, take, tap } from 'rxjs/operators';
import { Car, CarColor } from './model/car';
import { Seat } from './model/seat';
import { SteeringWheel } from './model/steering-wheel';
import { Wheel } from './model/wheel';
import { PaintShop } from './paint-shop';

export class CarAssemblyLine {

    constructor(private paintShop: PaintShop) { }

    createCarOnLine(color: CarColor) {
        return timer(0, 7000)
            .pipe(
                tap(() => console.log('CarAssemblyLine', `START_CREATING_CAR`, color)),
                concatMap(() => this.createChassis().pipe(
                    concatMap(chassisNr => this.createWheels()
                        .pipe(concatMap(wheels => this.createSteeringWheel()
                            .pipe(concatMap(steeringWheel => this.createSeats()
                                .pipe(concatMap(seats => this.assembleCar(chassisNr, wheels, steeringWheel, seats)))
                            ))
                        ))
                    )),
                ),
                concatMap(car => this.paintShop.paintCar(car, color)),
                map(car => ({ car, counter: 1 })),
                scan((acc, next) => ({ car: next.car, counter: acc.counter + 1 }), { car: null, counter: 0 }),
                tap(({ car, counter }) => {
                    const chassisNumber = car.chassisNumber;
                    console.log('CarAssemblyLine', 'FINISHED_CREATING_CAR', car.color, chassisNumber, counter);
                }));
    }

    private createChassis(): Observable<string> {
        return timer(0, 1000).pipe(
            take(1),
            delay(300),
            tap(() => console.log('Chassis', 'STARTED')),
            delay(700),
            map(tick => Car.createChassisNumber(tick)),
            tap(() => console.log('Chassis', 'FINISHED')),
        );
    }

    private createWheels(): Observable<Wheel[]> {
        return timer(0, 1000).pipe(
            take(1),
            delay(300),
            tap(() => console.log('Wheels', 'STARTED')),
            delay(700),
            map(tick => [Wheel.createWheel({tick}), Wheel.createWheel({tick}), Wheel.createWheel({tick}), Wheel.createWheel({tick})]),
            tap(() => console.log('Wheels', 'FINISHED')),
        );
    }

    private createSteeringWheel(): Observable<SteeringWheel> {
        return timer(0, 1000).pipe(
            take(1),
            delay(300),
            tap(() => console.log('SteeringWheel', 'STARTED')),
            delay(700),
            map(tick => SteeringWheel.createSteeringWheel({tick})),
            tap(() => console.log('SteeringWheel', 'FINISHED')),
        );
    }

    private createSeats(): Observable<Seat[]> {
        return timer(0, 1000).pipe(
            take(1),
            delay(300),
            tap(() => console.log('Seats', 'STARTED')),
            delay(700),
            map(tick => [Seat.createSeat({tick}), Seat.createSeat({tick})]),
            tap(() => console.log('Seats', 'FINISHED')),
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
