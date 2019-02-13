import { timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Car, CarColor } from './model/car';

export class CarAssemblyLine {

    private TIME_TO_CREATE_LINE = 6000;

    createCarOnLine(color: CarColor) {
        console.log('CarAssemblyLine', `START_CREATING_CAR`, color);
        return timer(this.TIME_TO_CREATE_LINE)
            .pipe(
                tap(() => { // EX03: Change this into a map operator and return the built car
                    Car.build({ color });
                }),
                tap(timerCount => { // EX03: This tap operator will have the car as value instead of the timerCount
                    const chassisNumber = `${timerCount}`;
                    console.log('CarAssemblyLine', 'FINISHED_CREATING_CAR', color, chassisNumber);
                }));
    }
}