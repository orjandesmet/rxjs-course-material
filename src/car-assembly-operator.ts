import { EMPTY, Observable, OperatorFunction } from 'rxjs';
import { bufferCount, catchError, delay, mergeMap, scan, tap } from 'rxjs/operators';

type CreatorFunction<T> = ({tick}: {tick: number}) => Observable<T>;

export function carAssemblyOperator<T>(name: string, time: number, creator: CreatorFunction<T>): OperatorFunction<number, T> {
    const startTime = time / 3;
    const endTime = time / 3 * 2;
    return (source$: Observable<number>): Observable<T> => source$.pipe(
        delay(startTime),
        tap(() => console.log(name, 'STARTED')),
        delay(endTime),
        mergeMap(tick => creator({tick}).pipe(
            catchError(err => {
                console.log(name, 'RESOLVED_ERROR', err);
                return EMPTY;
            }))
        ),
        tap(obj => console.log(name, 'FINISHED', obj)),
    );
}

export function multiCarAssemblyOperator<T extends {count: number}>(name: string, time: number, creator: CreatorFunction<T>, count: number): OperatorFunction<number, T[]> {
    return (source$: Observable<number>): Observable<T[]> => source$.pipe(
        carAssemblyOperator<T>(name, time, creator),
        scan((acc, current) => ({...current, count: (acc.count % count) + 1})),
        bufferCount(count),
    );
}