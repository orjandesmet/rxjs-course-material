export interface SteeringWheel {
    tick?: number;
    buttons: boolean;
}

export namespace SteeringWheel {
    export function createSteeringWheel(steeringWheel: Partial<SteeringWheel> = {}): SteeringWheel {
        return {
            buttons: false,
            ...steeringWheel,
        };
    }
}
