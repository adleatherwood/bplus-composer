import { Linq, Query } from "./linq"

export type Success<T> = {
    kind: "success",
    value: T
}

export type Failure<T> = {
    kind: "failure",
    error: T
}

export type Results<T, F> =
    | Success<T>
    | Failure<F>

export type Result<T> = Results<T, string>

export module Result {

    export function success<T, F>(value: T): Results<T, F> {
        return {
            kind: "success",
            value: value,
        }
    }

    export function failure<T, F>(error: F): Results<T, F> {
        return {
            kind: "failure",
            error: error,
        }
    }

    export function isSuccess<T, F>(result: Results<T, F>): result is Success<T> {
        return result.kind === "success"
    }

    export function isFailure<T, F>(result: Results<T, F>): result is Failure<F> {
        return result.kind === "failure"
    }

    export function match<S, F, U>(result: Results<S, F>, fsuccess: (s: S) => U, ffailure: (f: F) => U): U {
        return (isSuccess(result))
            ? fsuccess(result.value)
            : ffailure(result.error)
    }

    export function iterate<S, F>(result: Results<S, F>): Iterable<S> {
        return match(result, success => [success], _ => [])
    }

    export function query<S, F>(result: Results<S, F>): Query<S> {
        return Linq.query(iterate(result))
    }
}
