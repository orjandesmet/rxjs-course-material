import { marbles } from 'rxjs-marbles';
import { carAssemblyOperator, multiCarAssemblyOperator } from './car-assembly-operator';

describe('Car Assembly Operators', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleLogSpy.mock.calls = [];
    });

    describe('carAssemblyOperator', () => {
        it('should build something in given time', marbles(m => {
            const creator = jest.fn().mockReturnValue(m.cold('---(s|)', {s: 'SOMETHING'}));
            const time = 300;
            const name = 'Something';

            const result$ = carAssemblyOperator(1)(name, time, creator)(m.cold('x|', {x: undefined}));
            m.expect(result$).toBeObservable('300ms ---(s|)', {s: 'SOMETHING'});
            m.flush();
            expect(consoleLogSpy).toHaveBeenCalledTimes(2);
            expect(consoleLogSpy).toHaveBeenCalledWith('Something', 1, 'STARTED');
            expect(consoleLogSpy).not.toHaveBeenCalledWith('Something', 1, 'RESOLVED_ERROR', 'error');
            expect(consoleLogSpy).toHaveBeenCalledWith('Something', 1, 'FINISHED', 'SOMETHING');
        }));

        it('should return EMPTY on error', marbles(m => {
            const creator = jest.fn().mockReturnValue(m.cold('---#'));
            const time = 300;
            const name = 'Something';

            const result$ = carAssemblyOperator(1)(name, time, creator)(m.cold('x|', {x: undefined}));
            m.expect(result$).toBeObservable('300ms ---|', {s: 'SOMETHING'});
            m.flush();
            expect(consoleLogSpy).toHaveBeenCalledTimes(2);
            expect(consoleLogSpy).toHaveBeenCalledWith('Something', 1, 'STARTED');
            expect(consoleLogSpy).toHaveBeenCalledWith('Something', 1, 'RESOLVED_ERROR', 'error');
            expect(consoleLogSpy).not.toHaveBeenCalledWith('Something', 1, 'FINISHED', 'SOMETHING');
        }));
    });

    describe('multiCarAssemblyOperator', () => {
        it('should build something in given time', marbles(m => {
            const creator = jest.fn().mockReturnValue(m.cold('---(s|)', {s: {count: 1, text: 'SOMETHING' }}));
            const time = 300;
            const name = 'Something';
            type T = {count: number, text: string};

            const result$ = multiCarAssemblyOperator<T>(1)<T>(name, time, creator, 3)(m.cold('x 300ms x 300ms x|', {x: undefined}));
            m.expect(result$).toBeObservable('900ms -----(s|)', {s: [{count: 1, text: 'SOMETHING' }, {count: 2, text: 'SOMETHING' }, {count: 3, text: 'SOMETHING' }]});
            m.flush();
            expect(consoleLogSpy).toHaveBeenCalledTimes(6);
            expect(consoleLogSpy).toHaveBeenCalledWith('Something', 1, 'STARTED');
            expect(consoleLogSpy).not.toHaveBeenCalledWith('Something', 1, 'RESOLVED_ERROR', 'error');
            expect(consoleLogSpy).toHaveBeenCalledWith('Something', 1, 'FINISHED', {count: 1, text: 'SOMETHING' });
        }));

        it('should return EMPTY on error', marbles(m => {
            const creator = jest.fn().mockReturnValue(m.cold('---#'));
            const time = 300;
            const name = 'Something';
            type T = {count: number, text: string};

            const result$ = multiCarAssemblyOperator<T>(1)<T>(name, time, creator, 3)(m.cold('x 300ms x 300ms x|', {x: undefined}));
            m.expect(result$).toBeObservable('900ms -----|', {s: [{count: 1, text: 'SOMETHING' }, {count: 2, text: 'SOMETHING' }, {count: 3, text: 'SOMETHING' }]});
            m.flush();
            expect(consoleLogSpy).toHaveBeenCalledTimes(6);
            expect(consoleLogSpy).toHaveBeenCalledWith('Something', 1, 'STARTED');
            expect(consoleLogSpy).toHaveBeenCalledWith('Something', 1, 'RESOLVED_ERROR', 'error');
            expect(consoleLogSpy).not.toHaveBeenCalledWith('Something', 1, 'FINISHED', 'SOMETHING');
        }));
    });
});
