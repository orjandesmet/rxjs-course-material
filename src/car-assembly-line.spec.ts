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
            carAssemblyLine['TIME_TO_CREATE_LINE'] = 30;
            jest.spyOn(Car, 'build').mockImplementation(({color}) => ({chassisNumber: '123', color}));
            const returnValue$ = carAssemblyLine.createCarOnLine('blue');
            m.expect(returnValue$).toBeObservable('30ms (c|)', {c: {chassisNumber: '123', color: 'blue'}});
        }));
    });
});