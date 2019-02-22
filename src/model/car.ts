import { Observable, of } from 'rxjs';
import { Seat } from './seat';
import { SteeringWheel } from './steering-wheel';
import { Wheel } from './wheel';

export type CarColor = 'blue' | 'red' | 'black' | 'white';

export interface Car {
    chassisNumber: string;
    color: CarColor;
    wheels: Wheel[];
    steeringWheel: SteeringWheel;
    seats: Seat[];
}

export namespace Car {
    export function build(car: Partial<Car> = {}): Car {
        return {
            chassisNumber: 'UNKNOWN',
            color: 'white',
            wheels: [],
            steeringWheel: null,
            seats: [],
            ...car,
        };
    }

    export function createChassisNumber({tick}: {tick: number}): Observable<string> {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 13; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return of(`${text}-${`0${tick + 1}`.substr(-2)}`);
    }
}
