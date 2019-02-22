import { Observable, OperatorFunction } from 'rxjs';

type CreatorFunction<T> = ({tick}: {tick: number}) => Observable<T>;

export function carAssemblyOperator<T>(name: string, time: number, creator: CreatorFunction<T>): OperatorFunction<number, T> {
    throw new Error('Not yet implemented');
}

export function multiCarAssemblyOperator<T>(name: string, time: number, creator: CreatorFunction<T>, count: number): OperatorFunction<number, T[]> {
    throw new Error('Not yet implemented');
}