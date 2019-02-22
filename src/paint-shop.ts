import { Observable, timer } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Car, CarColor } from './model/car';

export class PaintShop {
    paintCar(car: Car, color: CarColor): Observable<Car> {
        return timer(300).pipe(
            tap(() => console.log('PaintShop', 'STARTED', color)),
            delay(700),
            map(() => ({ ...car, color })),
            tap(paintedCar => console.log('PaintShop', 'FINISHED', paintedCar)),
        );
    }
}