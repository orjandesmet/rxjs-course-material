export interface Seat {
    tick?: number;
    sports: boolean;
}

export namespace Seat {
    export function createSeat(seat: Partial<Seat> = {}): Seat {
        return {
            sports: false,
            ...seat,
        };
    }
}
