# Exercise 4: Switching Streams

Reset, commit or stash your changes and check out tag **ex04** before starting this exercise.
Start the application using `npm start` or `yarn start` and navigate your browser to `http://localhost:9000`.
You can test the application with `npm test` or `yarn test`. If all tests pass, the solution should be correct.

## Problem

Our shop is so popular that we don't need to wait for a customer's order.
We've upgraded our factory so it can create 10 cars in a row and we can now choose colors.
And the factory can be started and stopped when something is on the assembly line.
Currently to change the color of the cars being created, the factory stops if it's running, and then starts again.
In marble diagrams, this is the current situation:

```marble
btnWhite: -w--------------------------------------------------
btnRed:   -------------------------r--------------------------
btnBlue:  ----------------------------------b-----------------
btnStop:  ------------------------------------------------s---
cars:     --w-w-w-w-w-w-w-w-w-(w|) -r-r-r-r-(r|) -b-b-b-b-(b|)
          ^                     ^  ^          ^  ^          ^
factory:  start              stop  start   stop  start   stop

w: white car
r: red car
b: blue car
```

## Task

To solve this problem, we need to define a single stream of colors, so that the marble diagram looks like this:

```marble
btnWhite: -w---------------------------------------------
btnRed:   -------------------------r---------------------
btnBlue:  ----------------------------------b------------
btnStop:  -------------------------------------------s---
color:    -w-----------------------r--------b------------
cars:     --w-w-w-w-w-w-w-w-w-w-----r-r-r-r--b-b-b-b-(b|)
          ^                                            ^
factory:  start                                     stop

w: white car
r: red car
b: blue car
```

The **color** stream is a **Subject** on which the individual buttons can set their value using the **next** function.
Create a new **Subject** of type **CarColor** in  *src/car-factory.ts*:

```typescript
import { Subject } from 'rxjs';

const colorSubject = new Subject<CarColor>();
```

Change the function **createCarsInColor** so it doesn't cancel the existing subscription when it's already running.
Instead, start the subscription if it isn't already running.

To make the subscription react on a different stream (in this case our Subject), you can use the **mergeMap**, **switchMap**, **concatMap** or **exhaustMap** operator, like this:

```typescript
import { mergeMap } from 'rxjs/operators';

yourSubject.pipe(
    mergeMap(subjectValue => createNewObservable(subjectValue))
).subscribe(newObservableValue => {
    ...
})
```

The **mergeMap**, **switchMap**, **concatMap** and **exhaustMap** operators all behave in a different way.
Do this in the **createCars** function. The parameter *color* is no longer needed as the *colorSubject* will provide it.
It's for you to find out which operator is best suited here. Experiment with the different operators to see the different effects.
Remember that there is only 1 factory line, so only 1 car can be created at a time.

Since there is now only a single input stream of cars, we can modify the **startFactory** function to always use *this.createCars()* instead of the parameter *assembly*.

### Bonus 1

We want the factory to produce black cars the moment the factory starts.
How can this be achieved?
Hint: look at either the **startWith** operator or a **BehaviorSubject**.

### Bonus 2

We now have an inner (assembly line) and outer (factory) stream.
Currently when we cancel the build of cars, we shut down the whole factory.
This can be changed so that we only shut down the assembly line.
Take a look at the operator **takeUntil** and try to remove the use of **stopFactory** in *stopCreatingCars()*.

## Solution

If you get stuck, you can check out tag **sol04**, **sol04-bonus1** and **sol04-bonus2** to see the solution.
