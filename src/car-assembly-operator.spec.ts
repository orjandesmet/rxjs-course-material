import { Subject } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { carAssemblyOperator, multiCarAssemblyOperator } from './car-assembly-operator';

describe('Car Assembly Operators', () => {
    let consoleLogSpy: jest.SpyInstance;
    let consoleLogSubject$: Subject<any>;
    const consoleLogValues = {
        s: {message: 'Something', 0: 1, 1: 'STARTED' },
        f: {message: 'Something', 0: 1, 1: 'FINISHED', 2: 'SOMETHING'},
        e: {message: 'Something', 0: 1, 1: 'RESOLVED_ERROR', 2: 'error'}
    };
    const multiConsoleLogValues = {
        s: {message: 'Something', 0: 1, 1: 'STARTED' },
        f: {message: 'Something', 0: 1, 1: 'FINISHED', 2: {count: 1, text: 'SOMETHING' }},
        e: {message: 'Something', 0: 1, 1: 'RESOLVED_ERROR', 2: 'error'}
    };

    beforeEach(() => {
        consoleLogSubject$ = new Subject();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
            .mockImplementation((message: string, ...args: string[]) => consoleLogSubject$.next({message, ...args}));
        consoleLogSpy.mock.calls = [];
    });

    describe('carAssemblyOperator', () => {
        it('should build something in given time', marbles(m => {
            const creator = jest.fn().mockReturnValue(m.cold('---(s|)', {s: 'SOMETHING'}));
            const time = 300;
            const name = 'Something';

            const result$ = carAssemblyOperator(1)(name, time, creator)(m.cold('x|', {x: undefined}));
            m.expect(result$).toBeObservable('300ms ---(s|)', {s: 'SOMETHING'});
            m.expect(consoleLogSubject$).toBeObservable('100ms s 200ms --f', consoleLogValues);
        }));

        it('should return EMPTY on error', marbles(m => {
            const creator = jest.fn().mockReturnValue(m.cold('---#'));
            const time = 300;
            const name = 'Something';

            const result$ = carAssemblyOperator(1)(name, time, creator)(m.cold('x|', {x: undefined}));
            m.expect(result$).toBeObservable('300ms ---|', {s: 'SOMETHING'});
            m.expect(consoleLogSubject$).toBeObservable('100ms s 200ms --e', consoleLogValues);
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
            m.expect(consoleLogSubject$).toBeObservable('100ms s 200ms --f 97ms s 200ms --f 97ms s 200ms --f', multiConsoleLogValues);
        }));

        it('should return EMPTY on error', marbles(m => {
            const creator = jest.fn().mockReturnValue(m.cold('---#'));
            const time = 300;
            const name = 'Something';
            type T = {count: number, text: string};

            const result$ = multiCarAssemblyOperator<T>(1)<T>(name, time, creator, 3)(m.cold('x 300ms x 300ms x|', {x: undefined}));
            m.expect(result$).toBeObservable('900ms -----|', {s: [{count: 1, text: 'SOMETHING' }, {count: 2, text: 'SOMETHING' }, {count: 3, text: 'SOMETHING' }]});
            m.expect(consoleLogSubject$).toBeObservable('100ms s 200ms --e 97ms s 200ms --e 97ms s 200ms --e', multiConsoleLogValues);
        }));
    });
});
