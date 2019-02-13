export type CarColor = 'blue' | 'red' | 'black' | 'white';

export interface Car {
    chassisNumber: string;
    color: CarColor;
}

export namespace Car {
    export function build(car: Partial<Car> = {}): Car {
        return {
            chassisNumber: createChassisNumber(),
            color: 'white',
            ...car,
        };
    }

    function createChassisNumber() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 16; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}
