export class Deferred<T = any> {
  promise: Promise<T>;
  resolve!: (value?: T | PromiseLike<T> | undefined) => void;
  reject!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
