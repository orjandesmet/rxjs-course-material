import { marbles } from 'rxjs-marbles';
import { CarFactory } from './car-factory';

describe('CarFactory', () => {
    let carFactory: CarFactory;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleLogSpy.mock.calls = [];
        carFactory = new CarFactory();
    });

    describe('startFactory', () => {

        let createCarSpy1: jest.SpyInstance;
        let createCarSpy2: jest.SpyInstance;

        beforeEach(() => {
            createCarSpy1 = jest.spyOn(carFactory['carAssemblyLines'][1], 'createCarOnLine');
            createCarSpy2 = jest.spyOn(carFactory['carAssemblyLines'][2], 'createCarOnLine');
        });

        it('should log that the factory started when not running', () => {
            carFactory.startFactory();
            expect(consoleLogSpy).toHaveBeenCalledWith('CarFactory', 'STARTED');
            expect(createCarSpy1).toHaveBeenCalledTimes(1);
            expect(createCarSpy2).toHaveBeenCalledTimes(1);
        });
        it('should log that the factory was already running when running', () => {
            carFactory['subscription'] = {closed: false} as any;
            carFactory.startFactory();
            expect(consoleLogSpy).toHaveBeenCalledWith('CarFactory', 'ALREADY_RUNNING');
        });
    });

    describe('stopFactory', () => {
        it('should log that the factory stopped when running', () => {
            carFactory['subscription'] = {closed: false, unsubscribe: jest.fn()} as any;
            carFactory.stopFactory();
            expect(consoleLogSpy).toHaveBeenCalledWith('CarFactory', 'STOPPED');
            expect(carFactory['subscription'].unsubscribe).toHaveBeenCalled();
        });
        it('should log that the factory is not running when not running', () => {
            carFactory.stopFactory();
            expect(consoleLogSpy).toHaveBeenCalledWith('CarFactory', 'NOT_RUNNING');
        });
    });

    describe('createCarsInColor', () => {

        let createCarSpy1: jest.SpyInstance;
        let createCarSpy2: jest.SpyInstance;
        let stopFactorySpy: jest.SpyInstance;

        beforeEach(() => {
            createCarSpy1 = jest.spyOn(carFactory['carAssemblyLines'][1], 'createCarOnLine');
            createCarSpy2 = jest.spyOn(carFactory['carAssemblyLines'][2], 'createCarOnLine');
            stopFactorySpy = jest.spyOn(carFactory, 'stopFactory');
        });

        it('should not create cars when not running', marbles(m => {
            createCarSpy1.mockReturnValue(m.cold('-(c|)', {c: undefined}));
            createCarSpy2.mockReturnValue(m.cold('-(c|)', {c: undefined}));
            carFactory.createCarsInColor('blue');
            m.flush();
            expect(carFactory['subscription']).toBeUndefined();
            expect(createCarSpy1).not.toHaveBeenCalled();
            expect(createCarSpy2).not.toHaveBeenCalled();
            expect(stopFactorySpy).not.toHaveBeenCalled();
        }));

        it('should switch cars color when running', marbles(m => {
            carFactory.startFactory();
            createCarSpy1.mockReturnValue(m.cold('-(c|)', {c: {car: undefined}}));
            createCarSpy2.mockReturnValue(m.cold('-(c|)', {c: {car: undefined}}));
            carFactory.createCarsInColor('red');
            carFactory.stopFactory();
            m.flush();
            expect(createCarSpy1).toHaveBeenCalledTimes(1);
            expect(createCarSpy2).toHaveBeenCalledTimes(1);
            expect(stopFactorySpy).toHaveBeenCalledTimes(1);
        }));
    });
});