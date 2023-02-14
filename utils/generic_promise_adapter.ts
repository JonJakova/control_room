// export const generic_promise_adapter = <T>(promise: any): Promise<T | Error> => {
//         return promise.then((data: T) => data).catch((err: Error) => err);
// }

export const generic_promise_adapter = <T>(promise: any): Promise<T | Error> => {
    if (promise instanceof Promise) {
        return promise.then((data: T) => data).catch((err: Error) => err);
    }
    return promise;
}