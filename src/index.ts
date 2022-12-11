type ExecutorFunction<T = any> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;
type CancellablePromiseRefs = {
  complete: boolean;
  reject: (reason?: any) => void;
}

export class CancellablePromise<T = any> extends Promise<T> {

  private readonly onCancel: (reason?: any) => any;
  private readonly refs: CancellablePromiseRefs;
  // todo: add event emitter support so multiple objects can listen to the cancel event
  // private listeners: {[event: string]: (value) => void}

  constructor(executor: ExecutorFunction<T>, onCancel: (reason?: any) => any = (reason) => reason) {

    const refs: CancellablePromiseRefs = {
      complete: false
    } as CancellablePromiseRefs;

    super((resolve) => {
      resolve(Promise.race([
        new Promise<T>(executor),
        new Promise<T>((_, r) => {
          refs.reject = r;
        })
      ]).then(v => {
        refs.complete = true;
        return v;
      }))
    });

    this.refs = refs;
    this.onCancel = onCancel;
  }

  cancel(reason?: any) {
    if (!this.refs.complete) {
      this.refs.reject(this.onCancel(reason) ?? reason);
    }
  }

  /**
   * Create new CancellablePromise from the
   * @param promise
   * @param onCancel
   */
  static fromPromise<T = any>(promise: Promise<T>, onCancel?: (reason?: any) => any): CancellablePromise<T> {
    return new CancellablePromise<T>((resolve) => resolve(promise), onCancel);
  }
}