import { Observable, of } from 'rxjs';

export interface Seat {
    tick?: number;
    sports: boolean;
    count: number;
}

export namespace Seat {
    export function createSeat(seat: Partial<Seat> = {}): Observable<Seat> {
        return of({
            sports: false,
            count: 1,
            ...seat,
        });
    }
}
