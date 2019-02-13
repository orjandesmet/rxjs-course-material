# Exercise 2: Cancelling an Observable

Reset, commit or stash your changes and check out tag **ex02** before starting this exercise.
Start the application using `npm start` or `yarn start` and navigate your browser to `http://localhost:9000`.
You can test the application with `npm test` or `yarn test`. If all tests pass, the solution should be correct.

## Problem

Creating a car still takes a lot of time.
Someone got impatient and cancelled their order.
A Promise can only be resolved or rejected, not cancelled.
So while we can stop our factory while creating a car, the car will still be created.
An Observable however can be cancelled, so we can stop creating the car when the factory stops.

## Task

Update the function **createCarOnLine** in *src/car-assembly-line.ts* so it will return an **Observable** after the given time.
You can create an Observable with a timer like this:

```typescript
import { timer } from 'rxjs';

timer(timeInMS);
```

The timer function will emit a value after the given time and then emit a complete signal.

Since the **createCarOnLine** function now returns an Observable, the function **createCar** in *src/car-factory.ts* has to be updated too.
The Promise.prototype.function **then** won't work anymore.
Instead we can pipe a **tap** operator to display a message when an event is emitted like this:

```typescript
import { tap } from 'rxjs/operators';

yourObservable.pipe(
    tap(next => {
        <your code>
    })
)
```

The **tap** operator will not subscribe on the Observable.
It will thus do nothing when there is no other subscription present.

Since the **createCar** function now returns an Observable, the function **createCarsInColor** in *src/car-factory.ts* has to be updated too.
This time we can use the Observable function **subscribe**, to subscribe on the emitted values.

```typescript
yourObservable.subscribe(next => {
    <your code>
})
```

Cancelling an Observable is as easy as unsubscribing.
To do this, you need to save the subscription into a variable and call the function **unsubscribe** when needed.

```typescript
import { Subscription } from 'rxjs';

let subscription: Subscription;
subscription = yourObservable.subscribe(...);

subscription.unsubscribe();
```

You can know when a subscription is still active by testing the **closed** property.

## Solution

If you get stuck, you can check out tag **sol02** to see the solution.
