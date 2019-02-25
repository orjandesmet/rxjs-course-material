import { Observable, timer, zip } from 'rxjs';
import { concatMap, delay, map, scan, tap } from 'rxjs/operators';
import { carAssemblyOperator, multiCarAssemblyOperator } from './car-assembly-operator';
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
            carAssemblyOperator<string>('Chassis', 750, Car.createChassisNumber),
        );
    }

    private createWheels(): Observable<Wheel[]> {
        return timer(0, 250).pipe(
            multiCarAssemblyOperator<Wheel>('Wheels', 225, Wheel.createWheel, 4),
        );
    }

    private createSteeringWheel(): Observable<SteeringWheel> {
        return timer(0, 1000).pipe(
            carAssemblyOperator<SteeringWheel>('SteeringWheel', 750, SteeringWheel.createSteeringWheel),
        );
    }

    private createSeats(): Observable<Seat[]> {
        return timer(0, 500).pipe(
            multiCarAssemblyOperator<Seat>('Seats', 450, Seat.createSeat, 2),
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
