# Exercise 6: Error handling

Reset, commit or stash your changes and check out tag **ex06** before starting this exercise.
Start the application using `npm start` or `yarn start` and navigate your browser to `http://localhost:9000`.
You can test the application with `npm test` or `yarn test`. If all tests pass, the solution should be correct.

## Problem

The wheel creator isn't very reliable.
It sometimes creates square wheels.
Unfortunately this makes the whole factory stop, which isn't needed.
We should just remove the wrong wheels.

## Task

The easiest way to solve this is to just retry wheel generation.
This can be done by adding the **catchError** pipe, like this:

```typescript
mergeMap(tick => Wheel.createWheel({tick})),
catchError(() => {
    console.log('Wheels', 'REMOVED_SQUARE_WHEEL');
    return EMPTY;
}),
```

When you do this, you'll notice that the stream changed.
Now, no new wheels are created anymore.
The reason is that we replaced the whole stream by an **EMPTY** stream, while only a part of the stream failed.

To solve this, add the catchError pipe to this substream:

```typescript
mergeMap(tick => Wheel.createWheel({tick}).pipe(
    catchError(() => {
        console.log('Wheels', 'REMOVED_SQUARE_WHEEL');
        return EMPTY;
    }))
),
```

An other way is to add the **retry** pipe.
This will restart this stream when an error occurs.
It's possible to set a maximum amount of retries, like this:

```typescript
mergeMap(tick => Wheel.createWheel({tick})),
retry(2),
```

If no retry count is set, the stream will be restarted on every error.
There's also **retryWhen** which lets you choose depending on the error whether or not to retry.

## Solution

If you get stuck, you can check out tag **sol06** to see the solution.
