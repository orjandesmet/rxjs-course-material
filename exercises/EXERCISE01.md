# Exercise 1: Promise to be good

Reset, commit or stash your changes and check out tag **ex01** before starting this exercise.
Start the application using `npm start` or `yarn start` and navigate your browser to `http://localhost:9000`.
You can test the application with `npm test` or `yarn test`. If all tests pass, the solution should be correct.

## Problem

The current car factory has a blocking **createCarOnLine** function.
This means that no code can be executed while this **createCarOnLine** function has been completed.
The buttons on the page are also blocked as long as it takes to create the car and they respond only when the car is completed.
As such, the messages being logged, will only appear after all code has been finished.
If you push the `Create A Blue Car`-button multiple times, it takes even longer for the application to respond again.

## Task

To understand reactive programming, first you need to understand promises.

Update the function **createCarOnLine** in *src/car-assembly-line.ts* so it will return a **Promise** after the given time.
You can create a Promise like this:

```typescript
new Promise(resolve => {
    <your code>
    resolve()
})
```

The function *resolve* must only be called after the given time.
To make this non-blocking, use *setTimeout* like this:

```typescript
setTimeout(() => {
    <your code>
}, timeInMS);
```

Update the function **createCarOnline** in *src/car-assembly-line.ts* so the message `FINISHED_CREATING_CAR` is only displayed after the car has been created.
Use the Promise.prototype.function **then** like this:

```typescript
yourPromise.then(resolvedValue => {
    <your code>
})
```

### Bonus

The Promise.prototype.function **then** also returns a Promise.
Update the function **createCarsInColor** in *src/car-factory* so the button only enables again after the car has been created.

## Solution

If you get stuck, you can check out tag **sol01** to see the solution.
