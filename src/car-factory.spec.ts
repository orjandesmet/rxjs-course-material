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

        let createCarSpy: jest.SpyInstance;
        let colorSubjectSpy: jest.SpyInstance;

        beforeEach(() => {
            createCarSpy = jest.spyOn(carFactory['carAssemblyLine'], 'createCarOnLine');
            colorSubjectSpy = jest.spyOn(carFactory['colorSubject'], 'next');
        });

        it('should log that the factory started when not running', () => {
            carFactory.startFactory();
            expect(consoleLogSpy).toHaveBeenCalledWith('CarFactory', 'STARTED');
            expect(createCarSpy).toHaveBeenCalledTimes(1);
            expect(createCarSpy).toHaveBeenCalledWith('black');
            expect(colorSubjectSpy).not.toHaveBeenCalled();
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

        let createCarSpy: jest.SpyInstance;
        let stopFactorySpy: jest.SpyInstance;
        let colorSubjectSpy: jest.SpyInstance;

        beforeEach(() => {
            createCarSpy = jest.spyOn(carFactory['carAssemblyLine'], 'createCarOnLine');
            stopFactorySpy = jest.spyOn(carFactory, 'stopFactory');
            colorSubjectSpy = jest.spyOn(carFactory['colorSubject'], 'next');
        });

        it('should not create cars when not running', marbles(m => {
            createCarSpy.mockReturnValue(m.cold('-(c|)', {c: undefined}));
            carFactory.createCarsInColor('blue');
            m.flush();
            expect(carFactory['subscription']).toBeUndefined();
            expect(createCarSpy).not.toHaveBeenCalled();
            expect(stopFactorySpy).not.toHaveBeenCalled();
            expect(colorSubjectSpy).not.toHaveBeenCalled();
        }));

        it('should switch cars color when running', marbles(m => {
            carFactory.startFactory();
            createCarSpy.mockReturnValue(m.cold('-(c|)', {c: undefined}));
            carFactory['subscription'] = {closed: false, unsubscribe: jest.fn()} as any;
            carFactory.createCarsInColor('red');
            m.flush();
            expect(createCarSpy).toHaveBeenCalledTimes(2);
            expect(createCarSpy).toHaveBeenCalledWith('black');
            expect(createCarSpy).toHaveBeenCalledWith('red');
            expect(stopFactorySpy).not.toHaveBeenCalledTimes(1);
            expect(colorSubjectSpy).toHaveBeenCalledWith('red');
        }));
    });
});