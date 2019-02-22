export interface Seat {
    tick?: number;
    sports: boolean;
    count: number;
}

export namespace Seat {
    export function createSeat(seat: Partial<Seat> = {}): Seat {
        return {
            sports: false,
            count: 1,
            ...seat,
        };
    }
}
