import { Linq, Query } from "./linq"

export type Option<T> = T | undefined | null

export module Option {

    export function isSome<T>(o: Option<T>): o is T {
        return match(o, _ => true, _ => false)
    }

    export function isNone<T>(o: Option<T>): o is T {
        return match(o, _ => false, _ => true)
    }

    export function match<T, U>(option: Option<T>, fsome: (s: T) => U, fnone: (n: undefined) => U) {
        return option !== undefined && option !== null
            ? fsome(option)
            : fnone(undefined)
    }

    export function iterate<T>(option: Option<T>): Iterable<T> {
        return match(option, some => [some], _ => [])
    }

    export function query<T>(option: Option<T>): Query<T> {
        return Linq.query(iterate(option))
    }
}
