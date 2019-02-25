import { marbles } from 'rxjs-marbles';
import { PaintShop } from './paint-shop';

describe('Paint Shop', () => {
    let paintShop: PaintShop;

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        paintShop = new PaintShop();
    });

    describe('paintCar', () => {
        it('should paint a car in 500ms', marbles(m => {
            fail('IMPLEMENT EXERCISE 8 HERE');
        }));
    });
});