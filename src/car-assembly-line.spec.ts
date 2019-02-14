import { marbles } from 'rxjs-marbles';
import { CarAssemblyLine } from './car-assembly-line';
import { Car } from './model/car';

describe('CarAssemblyLine', () => {

    let carAssemblyLine: CarAssemblyLine;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleLogSpy.mock.calls = [];
        carAssemblyLine = new CarAssemblyLine();
    });

    describe('createCarOnLine', () => {
        it('should return a promise which resolves after a time', marbles(m => {
            carAssemblyLine['TIME_TO_CREATE_LINE'] = 1;
            jest.spyOn(Car, 'build').mockImplementation(({color}) => ({chassisNumber: '123', color}));
            const returnValue$ = carAssemblyLine.createCarOnLine('blue');
            m.expect(returnValue$).toBeObservable('-012345678(9|)', {
                0: {car: {chassisNumber: '123', color: 'blue'}, counter: 0},
                1: {car: {chassisNumber: '123', color: 'blue'}, counter: 1},
                2: {car: {chassisNumber: '123', color: 'blue'}, counter: 2},
                3: {car: {chassisNumber: '123', color: 'blue'}, counter: 3},
                4: {car: {chassisNumber: '123', color: 'blue'}, counter: 4},
                5: {car: {chassisNumber: '123', color: 'blue'}, counter: 5},
                6: {car: {chassisNumber: '123', color: 'blue'}, counter: 6},
                7: {car: {chassisNumber: '123', color: 'blue'}, counter: 7},
                8: {car: {chassisNumber: '123', color: 'blue'}, counter: 8},
                9: {car: {chassisNumber: '123', color: 'blue'}, counter: 9},
            });
        }));
    });
});