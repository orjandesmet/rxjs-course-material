import { marbles } from 'rxjs-marbles';
import { Car, CarColor } from './model/car';
import { PaintShop } from './paint-shop';

describe('Paint Shop', () => {
    let paintShop: PaintShop;

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        paintShop = new PaintShop();
    });

    describe('paintCar', () => {
        it('should paint a car in 500ms', marbles(m => {
            // IN variables
            const car = Car.build();
            const color: CarColor = 'red';

            // OUT variables
            const paintedCar = {...car, color};

            // EXPECTED result
            const expected$ = m.cold('500ms (c|)', {c: paintedCar});

            // ACTUAL result
            const actual$ = paintShop.paintCar(car, color);

            // ASSERT
            m.equal(actual$, expected$);
        }));
    });
});