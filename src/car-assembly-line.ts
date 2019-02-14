import { interval } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Car, CarColor } from './model/car';

export class CarAssemblyLine {

    private TIME_TO_CREATE_LINE = 6000;

    createCarOnLine(color: CarColor) {
        console.log('CarAssemblyLine', `START_CREATING_CAR`, color);
        return interval(this.TIME_TO_CREATE_LINE)
            .pipe(
                take(10),
                map(counter => ({ car: Car.build({ color }), counter })),
                tap(({car, counter}) => {
                    const chassisNumber = car.chassisNumber;
                    console.log('CarAssemblyLine', 'FINISHED_CREATING_CAR', car.color, chassisNumber, counter + 1);
                }));
    }
}
