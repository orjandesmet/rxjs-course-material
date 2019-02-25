# Exercise 8: Unit Testing

Reset, commit or stash your changes and check out tag **ex08** before starting this exercise.
You can test the application with `npm test` or `yarn test`. If all tests pass, the solution should be correct.

## Problem

At the moment the factory isn't fail safe for changes.
We need some basic unit tests to make sure the assembly line stays running.
Add Unit tests for **paint-shop.spec.ts** and **car-assembly-line.spec.ts**

## Task

In **paint-shop.spec.ts** first define the stream's input variables:

```typescript
const car = Car.build();
const color: CarColor = 'red';
```

Then define the stream's output variables and the expected result:

```typescript
const paintedCar = {...car, color};

const expected$ = m.cold('500ms (c|)', {c: paintedCar});
```

Notice that the expected result starts with '500ms'.
That syntax means that the stream doesn't emit anything for 500ms, since it takes 500ms to paint a car.
The test itself will not take 500ms because it uses a mocked time scheduler.

Then create the actual result by calling the function:

```typescript
const actual$ = paintShop.paintCar(car, color);
```

Lastly, assert that the actual result and expected result are equal:

```typescript
m.equal(actual$, expected$);
```

You can do a similar way of working in **car-assembly-line.spec.ts**, but there are no input variables.
Instead the stream exists of different (sub)streams.

You can mock those substreams, even though they're private:

```typescript
jest.spyOn(carAssemblyLine, 'createChassis' as any).mockReturnValue(m.cold('-(c|)', {c: chassisNumber}));
jest.spyOn(carAssemblyLine, 'createWheels' as any).mockReturnValue(m.cold('-(w|)', {w: [wheel, wheel, wheel, wheel]}));
jest.spyOn(carAssemblyLine, 'createSteeringWheel' as any).mockReturnValue(m.cold('-(s|)', {s: steeringWheel}));
jest.spyOn(carAssemblyLine, 'createSeats' as any).mockReturnValue(m.cold('-(s|)', {s: [seat, seat]}));
```

Notice that we mocked the streams to always return a value and complete on frame 1.
Mocked streams are 0-based, meaning the first '-' is frame 0.
By using braces, you can make stream emit an event as well as a complete on the same frame.

Like previously, the expected stream will wait for at least 1s before emitting the built car:

```typescript
const expected$ = m.cold('1s -(c|)', {c: {car, counter: 1}});
```

Notice that there is 1 more frame after the first second.
This is because all substreams also emit on frame 1.
If one of the substreams would emit later, e.g. on frame 3, then the expected stream will also emit on frame 1003.
Smart as you are, you notice that 1 frame also equals 1ms.

And now you're super motivated to create unit tests for all parts of the application.

## Bonus

Although the tests in **car-assembly-operator.spec.ts**, test whether logging occurs, currently they don't test the order of the logging.
This should be possible by introducing a Subject, mocking an implementation for the consoleLogSpy and marble-testing that Subject.

## Solution

If you get stuck, you can check out tag **sol08** and **sol08-bonus** to see the solution.
