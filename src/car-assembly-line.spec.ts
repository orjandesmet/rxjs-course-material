import { CarAssemblyLine } from './car-assembly-line';

describe('CarAssemblyLine', () => {

    let carAssemblyLine: CarAssemblyLine;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleLogSpy.mock.calls = [];
        carAssemblyLine = new CarAssemblyLine();
    });

    describe('createCarOnLine', () => {
        it('should return a promise which resolves after a time', done => {
            carAssemblyLine['TIME_TO_CREATE_LINE'] = 0;
            const returnValue = carAssemblyLine.createCarOnLine('blue');
            returnValue.then(x => {
                expect(x).toBe(undefined);
                done();
            });
        });
    });
});