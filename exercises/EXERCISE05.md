# Exercise 5: Combining multiple Streams

Reset, commit or stash your changes and check out tag **ex05** before starting this exercise.
Start the application using `npm start` or `yarn start` and navigate your browser to `http://localhost:9000`.
You can test the application with `npm test` or `yarn test`. If all tests pass, the solution should be correct.

## Problem

Let's take a closer look at our car assembly line.
At the moment each part of the car is created in series.
This makes the run time of the assembly longer.
We should update our assembly line to let the parts be created in parallel.

## Task

When viewing the function **createCarOnLine** of *src/car-assembly-line.ts*, you'll notice a series of **concatMap**.
These only start a new inner stream when the previous inner stream is finished.

In marble diagrams this will look like this:

```marble
timer:    -0---------1----------2----------...
chassis:  ---c---------c----------c--------...
wheels:   -----w---------w----------w------...
stWheel:  -------s---------s----------s----...
seats:    ---------z---------z----------z--...
assembly: ----------A---------A----------A-...
```

You can make the streams run simultaneously by using the **zip** constructor, like this:

```typescript

import { zip } from 'rxjs';

zip(stream1$, stream2$, stream3$, ...)
.pipe(
    tap(([stream1Value, stream2Value, stream3Value, ...]) => {...})
)

```

As you can see, the **zip** combines different streams and will result in a new stream which emits an array of the values of each separate stream.

Change the existing **concatMap** operator from:

```typescript
concatMap(() => this.createChassis().pipe(
    concatMap(chassisNr => this.createWheels()
        .pipe(concatMap(wheels => this.createSteeringWheel()
            .pipe(concatMap(steeringWheel => this.createSeats()
                .pipe(concatMap(seats => this.assembleCar(chassisNr, wheels, steeringWheel, seats)))
            ))
        ))
    )),
),
```

into:

```typescript
concatMap(() => zip(this.createChassis(), this.createWheels(), this.createSteeringWheel(), this.createSeats())),
concatMap(([chassisNr, wheels, steeringWheel, seats]) => this.assembleCar(chassisNr, wheels, steeringWheel, seats)),
```

This combined (**zipped**) stream will only emit as much values as the least value emitting stream.
In our case each stream currently emits only 1 value, so there's no problem with that.

Now the marble stream looks like this

```marble
timer:    -0---------1---------2---------...
chassis:  ---c---------c---------c-------...
wheels:   ---w---------w---------w-------...
stWheel:  ---s---------s---------s-------...
seats:    ---z---------z---------z-------...
assembly: ----A---------A---------A------...
```

But we can do better.
Let's say that each part of the assembly line doesn't have to wait for a starting signal.
Instead, we can keep on creating parts but only take the amount needed.

Remove the **take** operator from each assembly line part.
And change the following in *createCarOnLine*:

```typescript
timer(0, 7000).pipe(
    tap(() => console.log('CarAssemblyLine', `START_CREATING_CAR`, color)),
    concatMap(() => zip(this.createChassis(), this.createWheels(), this.createSteeringWheel(), this.createSeats())),
    concatMap(([chassisNr, wheels, steeringWheel, seats]) => this.assembleCar(chassisNr, wheels, steeringWheel, seats)),
    ...
```

into:

```typescript
console.log('CarAssemblyLine', `START_CREATING_CAR`, color)
zip(this.createChassis(), this.createWheels(), this.createSteeringWheel(), this.createSeats()).pipe(
    concatMap(([chassisNr, wheels, steeringWheel, seats]) => this.assembleCar(chassisNr, wheels, steeringWheel, seats)),
    ...
```

The marble diagram for this is now:

```marble
chassis:  --c--c--c--...
wheels:   --w--w--w--...
stWheel:  --s--s--s--...
seats:    --z--z--z--...
assembly: ---A--A--A-...
```

## Solution

If you get stuck, you can check out tag **sol05** to see the solution.
