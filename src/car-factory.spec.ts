import { CarFactory } from './car-factory';

describe('CarFactory', () => {
    let carFactory: CarFactory;
    let buttonElementMock: any;

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        buttonElementMock = {
            setAttribute: jest.fn(),
            removeAttribute: jest.fn(),
        };
        carFactory = new CarFactory(buttonElementMock);
    });

    describe('startFactory', () => {
        it('should set isRunning to true when not running', () => {
            carFactory['isRunning'] = false;
            carFactory.startFactory();
            expect(carFactory['isRunning']).toBeTruthy();
        });
        it('should keep isRunning to true when running', () => {
            carFactory['isRunning'] = true;
            carFactory.startFactory();
            expect(carFactory['isRunning']).toBeTruthy();
        });
    });

    describe('stopFactory', () => {
        it('should set isRunning to false when running', () => {
            carFactory['isRunning'] = false;
            carFactory.stopFactory();
            expect(carFactory['isRunning']).toBeFalsy();
        });
        it('should keep isRunning to false when not running', () => {
            carFactory['isRunning'] = true;
            carFactory.stopFactory();
            expect(carFactory['isRunning']).toBeFalsy();
        });
    });

    describe('createCarsInColor', () => {

        let createCarSpy: jest.SpyInstance;

        beforeEach(() => {
            createCarSpy = jest.spyOn(carFactory['carAssemblyLine'], 'createCarOnLine');
        });

        it('should not create cars when not running', () => {
            carFactory['isRunning'] = false;
            carFactory.createCarsInColor('blue');
            expect(createCarSpy).not.toHaveBeenCalled();
        });

        it('should create cars when running', () => {
            carFactory['isRunning'] = true;
            carFactory.createCarsInColor('red');
            expect(createCarSpy).toHaveBeenCalledTimes(1);
            expect(createCarSpy).toHaveBeenCalledWith('red');
        });
    });
});