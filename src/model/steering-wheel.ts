import { Observable, of } from 'rxjs';

export interface SteeringWheel {
    tick?: number;
    buttons: boolean;
}

export namespace SteeringWheel {
    export function createSteeringWheel(steeringWheel: Partial<SteeringWheel> = {}): Observable<SteeringWheel> {
        return of({
            buttons: false,
            ...steeringWheel,
        });
    }
}
