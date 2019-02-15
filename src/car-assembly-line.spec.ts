import { of, throwError } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { take } from 'rxjs/operators';
import { CarAssemblyLine } from './car-assembly-line';
import { Car } from './model/car';
import { Seat } from './model/seat';
import { SteeringWheel } from './model/steering-wheel';
import { Wheel } from './model/wheel';

describe('CarAssemblyLine', () => {

    let carAssemblyLine: CarAssemblyLine;
    let consoleLogSpy: jest.SpyInstance;
    let paintShopMock;

    beforeEach(() => {
        paintShopMock = {
            paintCar: jest.fn().mockImplementation((car, color) => of({...car, color})),
        };
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleLogSpy.mock.calls = [];
        carAssemblyLine = new CarAssemblyLine(paintShopMock);
    });

    describe('createCarOnLine', () => {
        it('should return a stream of assembled and painted cars', marbles(m => {
            jest.spyOn(Car, 'createChassisNumber').mockImplementation((tick: number) => `${tick}`);
            jest.spyOn(Wheel, 'createWheel').mockImplementation(({tick}: {tick: number}) => `${tick}` as any);
            jest.spyOn(SteeringWheel, 'createSteeringWheel').mockImplementation(({tick}: {tick: number}) => `${tick}` as any);
            jest.spyOn(Seat, 'createSeat').mockImplementation(({tick}: {tick: number}) => `${tick}` as any);

            const returnValue$ = carAssemblyLine.createCarOnLine('blue').pipe(take(5));
            m.expect(returnValue$).toBeObservable('2s 0 999ms 1 999ms 2 999ms 3 999ms (4|)', {
                0: {car: {chassisNumber: '0', color: 'blue', wheels: ['0', '0', '0', '0'], steeringWheel: '0', seats: ['0', '0']}, counter: 1},
                1: {car: {chassisNumber: '1', color: 'blue', wheels: ['1', '1', '1', '1'], steeringWheel: '1', seats: ['1', '1']}, counter: 2},
                2: {car: {chassisNumber: '2', color: 'blue', wheels: ['2', '2', '2', '2'], steeringWheel: '2', seats: ['2', '2']}, counter: 3},
                3: {car: {chassisNumber: '3', color: 'blue', wheels: ['3', '3', '3', '3'], steeringWheel: '3', seats: ['3', '3']}, counter: 4},
                4: {car: {chassisNumber: '4', color: 'blue', wheels: ['4', '4', '4', '4'], steeringWheel: '4', seats: ['4', '4']}, counter: 5},
            });
        }));
    });

    describe('createChassis', () => {
        it('should return a non-stopping stream of chassis', marbles(m => {
            jest.spyOn(Car, 'createChassisNumber').mockImplementation((tick: number) => `${tick}`);
            const result$ = carAssemblyLine['createChassis']().pipe(take(5));
            const expected$ = m.cold('1s 0 999ms 1 999ms 2 999ms 3 999ms (4|)');
            m.expect(result$).toBeObservable(expected$);
        }));
    });

    describe('createWheels', () => {
        it('should return a non-stopping stream of wheels', marbles(m => {
            jest.spyOn(Wheel, 'createWheel').mockImplementation(({tick}: {tick: number}) => `${tick}` as any);
            const returnValues = {
                '0': ['0', '0', '0', '0'],
                '1': ['1', '1', '1', '1'],
                '2': ['2', '2', '2', '2'],
                '3': ['3', '3', '3', '3'],
                '4': ['4', '4', '4', '4'],
            };
            const result$ = carAssemblyLine['createWheels']().pipe(take(5));
            const expected$ = m.cold('1s 0 999ms 1 999ms 2 999ms 3 999ms (4|)', returnValues) as any;
            m.expect(result$).toBeObservable(expected$);
        }));
    });

    describe('createSteeringWheel', () => {
        it('should return a non-stopping stream of chassis', marbles(m => {
            jest.spyOn(SteeringWheel, 'createSteeringWheel').mockImplementation(({tick}: {tick: number}) => `${tick}` as any);
            const result$ = carAssemblyLine['createSteeringWheel']().pipe(take(5));
            const expected$ = m.cold('1s 0 999ms 1 999ms 2 999ms 3 999ms (4|)');
            m.expect(result$).toBeObservable(expected$);
        }));
    });

    describe('createSeats', () => {
        it('should return a non-stopping stream of seats', marbles(m => {
            jest.spyOn(Seat, 'createSeat').mockImplementation(({tick}: {tick: number}) => `${tick}` as any);
            const returnValues = {
                '0': ['0', '0'],
                '1': ['1', '1'],
                '2': ['2', '2'],
                '3': ['3', '3'],
                '4': ['4', '4'],
            };
            const result$ = carAssemblyLine['createSeats']().pipe(take(5));
            const expected$ = m.cold('1s 0 999ms 1 999ms 2 999ms 3 999ms (4|)', returnValues) as any;
            m.expect(result$).toBeObservable(expected$);
        }));
    });
});