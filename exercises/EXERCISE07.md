# Exercise 7: Pipeable Operators

Reset, commit or stash your changes and check out tag **ex07** before starting this exercise.
Start the application using `npm start` or `yarn start` and navigate your browser to `http://localhost:9000`.
You can test the application with `npm test` or `yarn test`. If all tests pass, the solution should be correct.

## Problem

The car assembly line is becoming WET.
The functions **createChassis** and **createSteeringWheel** in *src/car-assembly-line.ts* have the same structure.
Likewise, the functions  **createWheels** and **createSeats** in *src/car-assembly-line.ts* have the same structure.
You can make it DRYer by creating our own pipeable operator.

## Task

Let's start with **createChassis** and **createSteeringWheel**.
The file *src/car-assembly-operator.ts* exports a function **carAssemblyOperator**.

The goal is to use this function in pipes like this:

```typescript
const time = 1000;
timer(0, 1000).pipe(
    carAssemblyOperator<SteeringWheel>('SteeringWheel', 750, SteeringWheel.createSteeringWheel)
)
```

To do this, start by letting the **carAssemblyOperator** return an anonymous function, which takes an Observable of type number as parameter **source$** and returns an Observable of type T:

```typescript
export function carAssemblyOperator<T>(name: string, time: number, creator: CreatorFunction<T>): OperatorFunction<number, T> {
    return (source$: Observable<number>): Observable<T> => {}
}
```

Then make that function return the source$ with the required pipes. We can take all the pipes of the **createChassis** function since they're all repeated in **createSteeringWheel**:

```typescript
export function carAssemblyOperator<T>(name: string, time: number, creator: CreatorFunction<T>): OperatorFunction<number, T> {
    return (source$: Observable<number>): Observable<T> => source$.pipe(
        delay(250),
        tap(() => console.log('Chassis', 'STARTED')),
        delay(500),
        mergeMap(tick => createChassisNumber({tick}).pipe(
            catchError(err => {
                console.log('Chassis', 'RESOLVED_ERROR', err);
                return EMPTY;
            }))
        ),
        tap(() => console.log('Chassis', 'FINISHED'))
    );
}
```

Now all that's left is to use the parameters:

```typescript
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
```

Now you can use **carAssemblyOperator** for **createChassis** and **createSteeringWheel** like this:

```typescript
private createChassis(): Observable<string> {
    return timer(0, 1000).pipe(
        carAssemblyOperator<string>('Chassis', 750, createChassisNumber),
    )
}

private createSteeringWheel(): Observable<string> {
    return timer(0, 1000).pipe(
        carAssemblyOperator<SteeringWheel>('SteeringWheel', 750, createSteeringWheel),
    )
}
```

You can do the same for **createWheels** and **createSeats**, where you use **multiCarAssemblyOperator** like this:

```typescript
timer(0, 250).pipe(
    multiCarAssemblyOperator<Wheel>('Wheels', 225, Wheel.createWheel, 4);
)
```

## Bonus

It's possible to let **multiCarAssemblyOperator** use **carAssemblyOperator**.

## Solution

If you get stuck, you can check out tag **sol07** to see the solution.
