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
    let paintShopMock: any;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        paintShopMock = {
            paintCar: jest.fn().mockImplementation((car, color) => of({ ...car, color })),
        };
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleLogSpy.mock.calls = [];
        carAssemblyLine = new CarAssemblyLine(paintShopMock);
    });

    describe('createCarOnLine', () => {
        it('should return a stream of assembled and painted cars', marbles(m => {
            jest.spyOn(Car, 'createChassisNumber').mockImplementation(({ tick }: { tick: number }) => of(`${tick}`));
            jest.spyOn(Wheel, 'createWheel').mockImplementation(({ tick }: { tick: number }) => of({ tick, count: 1, size: 16 }));
            jest.spyOn(SteeringWheel, 'createSteeringWheel').mockImplementation(({ tick }: { tick: number }) => of(`${tick}`) as any);
            jest.spyOn(Seat, 'createSeat').mockImplementation(({ tick }: { tick: number }) => of({ tick, count: 1, sports: false }));

            const returnValue$ = carAssemblyLine.createCarOnLine('blue').pipe(take(3));
            m.expect(returnValue$).toBeObservable('1975ms 0 999ms 1 999ms (2|)', {
                0: {
                    car: {
                        chassisNumber: '0',
                        color: 'blue',
                        wheels: [
                            { tick: 0, count: 1, size: 16 },
                            { tick: 1, count: 2, size: 16 },
                            { tick: 2, count: 3, size: 16 },
                            { tick: 3, count: 4, size: 16 }
                        ],
                        steeringWheel: '0',
                        seats: [
                            { tick: 0, count: 1, sports: false },
                            { tick: 1, count: 2, sports: false },
                        ]
                    },
                    counter: 1
                },
                1: {
                    car: {
                        chassisNumber: '1',
                        color: 'blue',
                        wheels: [
                            { tick: 4, count: 1, size: 16 },
                            { tick: 5, count: 2, size: 16 },
                            { tick: 6, count: 3, size: 16 },
                            { tick: 7, count: 4, size: 16 }
                        ],
                        steeringWheel: '1',
                        seats: [
                            { tick: 2, count: 1, sports: false },
                            { tick: 3, count: 2, sports: false },
                        ]
                    },
                    counter: 2
                },
                2: {
                    car: {
                        chassisNumber: '2',
                        color: 'blue',
                        wheels: [
                            { tick: 8, count: 1, size: 16 },
                            { tick: 9, count: 2, size: 16 },
                            { tick: 10, count: 3, size: 16 },
                            { tick: 11, count: 4, size: 16 }
                        ],
                        steeringWheel: '2',
                        seats: [
                            { tick: 4, count: 1, sports: false },
                            { tick: 5, count: 2, sports: false },
                        ]
                    },
                    counter: 3
                },
            });
        }));
    });

    describe('createChassis', () => {
        it('should return a non-stopping stream of chassis', marbles(m => {
            jest.spyOn(Car, 'createChassisNumber').mockImplementation(({ tick }: { tick: number }) => of(`${tick}`));
            const result$ = carAssemblyLine['createChassis']().pipe(take(5));
            const expected$ = m.cold('750ms 0 999ms 1 999ms 2 999ms 3 999ms (4|)');
            m.expect(result$).toBeObservable(expected$);
        }));
    });

    describe('createWheels', () => {
        it('should return a non-stopping stream of wheels', marbles(m => {
            jest.spyOn(Wheel, 'createWheel').mockImplementation(({ tick }: { tick: number }) => of({ tick, count: 1, size: 16 }));
            const returnValues = {
                '0': [
                    { tick: 0, count: 1, size: 16 },
                    { tick: 1, count: 2, size: 16 },
                    { tick: 2, count: 3, size: 16 },
                    { tick: 3, count: 4, size: 16 },
                ],
                '1': [
                    { tick: 4, count: 1, size: 16 },
                    { tick: 5, count: 2, size: 16 },
                    { tick: 6, count: 3, size: 16 },
                    { tick: 7, count: 4, size: 16 },
                ],
                '2': [
                    { tick: 8, count: 1, size: 16 },
                    { tick: 9, count: 2, size: 16 },
                    { tick: 10, count: 3, size: 16 },
                    { tick: 11, count: 4, size: 16 },
                ],
            };
            const result$ = carAssemblyLine['createWheels']().pipe(take(3));
            const expected$ = m.cold('975ms 0 999ms 1 999ms (2|)', returnValues) as any;
            m.expect(result$).toBeObservable(expected$);
        }));

        it('should remove square wheels from stream', marbles(m => {
            jest.spyOn(Wheel, 'createWheel').mockImplementation(({ tick }: { tick: number }) => {
                if (tick > 0 && tick % 3 === 0) {
                    return throwError('Mocked square wheel');
                }
                else {
                    return of({ tick, count: 1, size: 16 });
                }
            });
            const returnValues = {
                '0': [
                    { tick: 0, count: 1, size: 16 },
                    { tick: 1, count: 2, size: 16 },
                    { tick: 2, count: 3, size: 16 },
                    { tick: 4, count: 4, size: 16 },
                ],
                '1': [
                    { tick: 5, count: 1, size: 16 },
                    { tick: 7, count: 2, size: 16 },
                    { tick: 8, count: 3, size: 16 },
                    { tick: 10, count: 4, size: 16 },
                ],
                '2': [
                    { tick: 11, count: 1, size: 16 },
                    { tick: 13, count: 2, size: 16 },
                    { tick: 14, count: 3, size: 16 },
                    { tick: 16, count: 4, size: 16 },
                ],
            };
            const result$ = carAssemblyLine['createWheels']().pipe(take(3));
            const expected$ = m.cold('1225ms 0 1499ms 1 1499ms (2|)', returnValues) as any;
            m.expect(result$).toBeObservable(expected$);
        }));
    });

    describe('createSteeringWheel', () => {
        it('should return a non-stopping stream of chassis', marbles(m => {
            jest.spyOn(SteeringWheel, 'createSteeringWheel').mockImplementation(({ tick }: { tick: number }) => of(`${tick}`) as any);
            const result$ = carAssemblyLine['createSteeringWheel']().pipe(take(5));
            const expected$ = m.cold('750ms 0 999ms 1 999ms 2 999ms 3 999ms (4|)');
            m.expect(result$).toBeObservable(expected$);
        }));
    });

    describe('createSeats', () => {
        it('should return a non-stopping stream of seats', marbles(m => {
            jest.spyOn(Seat, 'createSeat').mockImplementation(({ tick }: { tick: number }) => of({ tick, count: 1, sports: false }));
            const returnValues = {
                '0': [
                    { tick: 0, count: 1, sports: false },
                    { tick: 1, count: 2, sports: false },
                ],
                '1': [
                    { tick: 2, count: 1, sports: false },
                    { tick: 3, count: 2, sports: false },
                ],
                '2': [
                    { tick: 4, count: 1, sports: false },
                    { tick: 5, count: 2, sports: false },
                ],
                '3': [
                    { tick: 6, count: 1, sports: false },
                    { tick: 7, count: 2, sports: false },
                ],
                '4': [
                    { tick: 8, count: 1, sports: false },
                    { tick: 9, count: 2, sports: false },
                ],
            };
            const result$ = carAssemblyLine['createSeats']().pipe(take(5));
            const expected$ = m.cold('950ms 0 999ms 1 999ms 2 999ms 3 999ms (4|)', returnValues) as any;
            m.expect(result$).toBeObservable(expected$);
        }));
    });
});