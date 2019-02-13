# Exercise 3: Map Operator

Reset, commit or stash your changes and check out tag **ex03** before starting this exercise.
Start the application using `npm start` or `yarn start` and navigate your browser to `http://localhost:9000`.
You can test the application with `npm test` or `yarn test`. If all tests pass, the solution should be correct.

## Problem

Each car we create is different so it receives a unique chassis number.
To follow up on the created cars, we would like to see this chassis number in the line of cars that are created.
At the moment the car assembly line will only create a car object, but not return it.
The **tap** operator allows to execute specific logic for each of the possible events (next, error, complete) on the stream.

## Task

Change the first **tap** operator in **createCarOnLine** in *src/car-assembly-line.ts* so it will return an **Observable** of type **Car**, using the **map** operator:

```typescript
import { map } from 'rxjs/operators';

yourObservable.pipe(
    map(obervableValue => newValue)
)
```

In marble diagrams, this will look like:

```marble
source: --(0|)
         map
result: --(c|)
c = car0
```

You can also use the operator **mapTo** if the return value should always be the same object.

```typescript
import { mapTo } from 'rxjs/operators';

yourObservable.pipe(
    mapTo(newValue)
)
```

Since the **map** and **mapTo** operators change the return type of an Observable, the second **tap** can now be updated to display the new car's information.
Change the **tap** operator to display information about the next value:

```typescript
import { tap } from 'rxjs/operators';

yourObservable.pipe(
    tap(obervableValue => {
        <your code>
    })
)
```

The parameter **obervableValue** will have the type Car through type inference.

## Solution

If you get stuck, you can check out tag **sol03** to see the solution.
