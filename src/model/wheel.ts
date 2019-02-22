import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Wheel {
    tick?: number;
    size: number;
    count: number;
}

export namespace Wheel {
    export function createWheel(wheel: Partial<Wheel> = {}): Observable<Wheel> {
        return of({
            size: 16,
            count: 1,
            ...wheel,
        }).pipe(
            map(wheel => {
                if (Math.random() > 0.95) {
                    console.log('Wheels', 'SQUARE_WHEEL');
                    throw new Error('SQUARE_WHEEL');
                }
                return wheel;
            })
        );
    }
}
