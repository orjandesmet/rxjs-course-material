import { timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Car, CarColor } from './model/car';

export class CarAssemblyLine {

    private TIME_TO_CREATE_LINE = 6000;

    createCarOnLine(color: CarColor) {
        console.log('CarAssemblyLine', `START_CREATING_CAR`, color);
        return timer(this.TIME_TO_CREATE_LINE)
            .pipe(
                map(() => Car.build({ color })),
                tap(car => {
                    const chassisNumber = car.chassisNumber;
                    console.log('CarAssemblyLine', 'FINISHED_CREATING_CAR', car.color, chassisNumber);
                }));
    }
}
