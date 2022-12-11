# Cancellable Promise

## Basic Usage
```ts
const cancellablePromise = new CancellablePromise<LongRunningResult>((resolve, reject) => {
    
    resolve(runLongRunningProcess())
}, (reason: string) => {
    console.warn('request cancelled')
});

// cancel the promise if it runs longer than 10s
setTimeout(() => {
    cancellablePromise.cancel();
}, 10000)
console.log(await cancellablePromise);
```


## Make a native Promise cancellable
```ts
const cancellablePromise = CancellablePromise.fromPromise(runLongRunningProcess());

// cancel the promise if it runs longer than 10s
setTimeout(() => {
    cancellablePromise.cancel();
}, 10000)
console.log(await cancellablePromise);
```
