export interface Wheel {
    tick?: number;
    size: number;
}

export namespace Wheel {
    export function createWheel(wheel: Partial<Wheel> = {}): Wheel {
        return {
            size: 16,
            ...wheel,
        };
    }
}
