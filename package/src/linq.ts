import { Option } from "./option"
import { self } from "./common"

export type Value = string | number | bigint | boolean
export type Group<K extends Value, T> = {
    key: K
    values: T[]
}

export type Selector<A, B> = (a: A) => B
export type ValueSelector<T, V extends Value> = Selector<T, V>
export type NumberSelector<T> = Selector<T, number>
export type ResultSelector<A, B, C> = (a: A, b: B) => C
export type Comparer<T> = (a: T, b: T) => number
export type SelectComparer<T, K> = [Selector<T, K>, Comparer<K>]
export type SortOrder = "asc" | "desc"
export type SelectOrder<T, K> = [SortOrder, SelectComparer<T, K>]
export type Predicate<T> = (t: T) => boolean

export type Query<T> = {
    any: () => boolean
    append: (item: T) => Query<T>
    concat: (other: Iterable<T>) => Query<T>
    count: () => number
    distinctBy: <K extends Value>(keySelector: ValueSelector<T, K>) => Query<T>
    except: <K extends Value>(others: Iterable<T>, keySelector: ValueSelector<T, K>) => Query<T>
    first: () => T
    firstOrUndefined: () => Option<T>
    groupBy: <K extends Value, B>(k: ValueSelector<T, K>, v: Selector<T, B>) => Query<Group<K, B>>
    join: <K extends Value, B, R>(second: Iterable<B>, fKey: ValueSelector<T, K>, sKey: ValueSelector<B, K>, resultSelector: ResultSelector<T, B, R>) => Query<R>
    last: () => T
    lastOrUndefined: () => Option<T>
    maxOf: <K>(k: SelectComparer<T, K>) => Option<T>
    minOf: <K>(k: SelectComparer<T, K>) => Option<T>
    orderBy: <K>(...sorters: SelectOrder<T, K>[]) => Query<T>
    prepend: (t: T) => Query<T>
    select: <B>(s: Selector<T, B>) => Query<B>
    selectMany: <B>(s: Selector<T, Iterable<B>>) => Query<B>
    single: () => T
    singleOrUndefined: () => Option<T>
    skip: (n: number) => Query<T>
    sumOf: (n: NumberSelector<T>) => number
    take: (n: number) => Query<T>
    toArray: () => T[]
    toIterable: () => Iterable<T>
    toLookup: <K extends Value, B>(k: ValueSelector<T, K>, v: Selector<T, B>) => Map<K, B[]>
    toMap: <K extends Value, B>(k: ValueSelector<T, K>, v: Selector<T, B>) => Map<K, B>
    toSet: () => Set<T>
    where: (p: Predicate<T>) => Query<T>
    zip: <B, C>(others: Iterable<B>, r: ResultSelector<T, B, C>) => Query<C>
}

export module Value {
    export function compare(a: Value, b: Value) {
        return a < b ? -1 : a > b ? 1 : 0
    }
}

export module Compare {
    export function self<T extends Value>(): SelectComparer<T, T> {
        return [t => t, Value.compare]
    }

    export function value<T, K extends Value>(selector: Selector<T, K>): SelectComparer<T, K> {
        return [selector, Value.compare]
    }

    export function explicit<T, K>(selector: Selector<T, K>, comparer: Comparer<K>): SelectComparer<T, K> {
        return [selector, comparer]
    }
}

export module Asc {
    export function self<T extends Value>(): SelectOrder<T, T> {
        return ["asc", Compare.self()]
    }

    export function by<T, V extends Value>(selector: Selector<T, V>): SelectOrder<T, V> {
        return ["asc", Compare.value(selector)]
    }

    export function explicit<T, K>(selector: Selector<T, K>, comparer: Comparer<K>): SelectOrder<T, K> {
        return ["asc", Compare.explicit(selector, comparer)]
    }
}

export module Desc {
    export function self<T extends Value>(): SelectOrder<T, T> {
        return ["desc", Compare.self()]
    }

    export function by<T, V extends Value>(selector: Selector<T, V>): SelectOrder<T, V> {
        return ["desc", Compare.value(selector)]
    }

    export function explicit<T, K>(selector: Selector<T, K>, comparer: Comparer<K>): SelectOrder<T, K> {
        return ["desc", Compare.explicit(selector, comparer)]
    }
}

export module Linq {
    export function query<T>(value: T | Iterable<T>): Query<T> {
        const current = toIterable(value)

        return {
            any: () => Linq.any(current),
            append: (other) => query(Linq.append(current, other)),
            concat: (other) => query(Linq.concat(current, other)),
            count: () => Linq.count(current),
            distinctBy: (k) => query(Linq.distinctBy(current, k)),
            except: (others, k) => query(Linq.except(current, others, k)),
            first: () => Linq.first(current),
            firstOrUndefined: () => Linq.firstOrUndefined(current),
            groupBy: (k, v) => query(Linq.groupBy(current, k, v)),
            join: (s, tk, sk, r) => query(Linq.join(current, s, tk, sk, r)),
            last: () => Linq.last(current),
            lastOrUndefined: () => Linq.lastOrUndefined(current),
            maxOf: (s) => Linq.maxOf(current, s),
            minOf: (s) => Linq.minOf(current, s),
            orderBy: (...s) => query(Linq.orderBy(current, ...s)),
            prepend: (t) => query(Linq.prepend(current, t)),
            select: (s) => query(Linq.select(current, s)),
            selectMany: (s) => query(Linq.selectMany(current, s)),
            single: () => Linq.single(current),
            singleOrUndefined: () => Linq.singleOrUndefined(current),
            skip: (c) => query(Linq.skip(current, c)),
            // skipLast
            sumOf: (n) => Linq.sumOf(current, n),
            take: (c) => query(Linq.take(current, c)),
            // takeLast
            toArray: () => Linq.toArray(current),
            toIterable: () => current,
            toLookup: (k, v) => Linq.toLookup(current, k, v),
            toMap: (k, v) => Linq.toMap(current, k, v),
            toSet: () => Linq.toSet(current),
            where: (p) => query(Linq.where(current, p)),
            zip: (other, f) => query(Linq.zip(current, other, f))
        }
    }

    export function any<T>(values: Iterable<T>): boolean {
        return firstOrUndefined(values) !== undefined
    }

    export function* append<T>(values: Iterable<T>, value: T): Iterable<T> {
        for (const v of values) {
            yield v
        }
        yield value
    }

    export function* concat<T>(first: Iterable<T>, second: Iterable<T>): Iterable<T> {
        for (const v of first) {
            yield v
        }
        for (const v of second) {
            yield v
        }
    }

    export function count<T>(values: Iterable<T>): number {
        return sumOf(select(values, (_) => 1), self)
    }

    export function distinctBy<T, K extends Value>(values: Iterable<T>, keySelector: ValueSelector<T, K>): Iterable<T> {
        const keys: Set<Value> = new Set<Value>()

        return where(values, (v) => {
            var key = keySelector(v)
            return add(keys, key)
        })
    }

    export function except<T, K extends Value>(first: Iterable<T>, second: T | Iterable<T>, keySelector: ValueSelector<T, K>): Iterable<T> {
        const secondi = toIterable<T>(second)
        const keys = new Set<Value>(select(secondi, keySelector))

        return where(first, (v) => {
            const key = keySelector(v)
            return add(keys, key)
        })
    }

    export function first<T>(values: Iterable<T>): T {
        const result = firstOrUndefined(values)

        if (!result)
            throw "No result found"

        return result
    }

    export function firstOrUndefined<T>(values: Iterable<T>): Option<T> {
        const head = toArray(take(values, 1))

        return head.length === 0
            ? undefined
            : head[0]
    }

    export function* groupBy<T, K extends Value, B>(values: Iterable<T>, keySelector: ValueSelector<T, K>, valueSelector: Selector<T, B>): Iterable<Group<K, B>> {
        const map = new Map<K, B[]>()
        for (const value of values) {
            const key = keySelector(value)
            const val = valueSelector(value)
            if (!map.has(key))
                map.set(key, [val])
            else
                map.get(key)?.push(val)
        }
        for (const [key, val] of map) {
            yield { key: key, values: val }
        }
    }

    export function* join<F, S, K extends Value, R>(first: Iterable<F>, second: Iterable<S>, firstKey: ValueSelector<F, K>, secondKey: ValueSelector<S, K>, resultSelector: ResultSelector<F, S, R>) {
        const f = toMap(first, firstKey, self)
        const s = toMap(second, secondKey, self)

        for (const [key, left] of f) {
            const right = s.get(key)
            if (right) {
                yield resultSelector(left, right)
            }
        }
    }

    export function last<T>(values: Iterable<T>): T {
        const result = lastOrUndefined(values)

        if (!result)
            throw "No result found"

        return result
    }

    export function lastOrUndefined<T>(values: Iterable<T>): Option<T> {
        let last: T | undefined = undefined

        for (const value of values) {
            last = value
        }

        return last
    }

    export function maxOf<T, K>(values: Iterable<T>, selectComparer: SelectComparer<T, K>): Option<T> {
        return firstOrUndefined(orderBy(values, ["desc", selectComparer]))
    }

    export function minOf<T, K>(values: Iterable<T>, selectComparer: SelectComparer<T, K>): Option<T> {
        return firstOrUndefined(orderBy(values, ["asc", selectComparer]))
    }

    export function* orderBy<T, K>(values: Iterable<T>, ...compareSelectors: SelectOrder<T, K>[]): Iterable<T> {
        const comparers = compareSelectors.map(toComparer)
        const ordered = toArray(values).sort((a, b) => compareMany(a, b, comparers))
        for (const value of ordered) {
            yield value
        }
    }

    export function* prepend<T>(values: Iterable<T>, value: T): Iterable<T> {
        yield value
        for (const v of values) {
            yield v
        }
    }

    export function* select<A, B>(values: Iterable<A>, selector: Selector<A, B>): Iterable<B> {
        for (const value of values) {
            yield selector(value)
        }
    }

    export function* selectMany<A, B>(values: Iterable<A>, selector: Selector<A, Iterable<B>>): Iterable<B> {
        for (const selection of select(values, selector)) {
            for (const value of selection)
                yield value
        }
    }

    export function single<T>(values: Iterable<T>): T {
        const result = singleOrUndefined(values)

        if (!result)
            throw "No result found"

        return result
    }

    export function singleOrUndefined<T>(values: Iterable<T>): Option<T> {
        const result = toArray(take(values, 2))

        if (result.length > 1)
            throw "More than one result found"

        return result.length === 0
            ? undefined
            : result[0]
    }

    export function* skip<T>(values: Iterable<T>, count: number): Iterable<T> {
        let counter = 0
        for (const value of values) {
            counter++
            if (counter <= count)
                continue
            yield value
        }
    }

    export function sumOf<T>(values: Iterable<T>, keySelector: NumberSelector<T>): number {
        let result = 0
        for (const value of values)
            result += keySelector(value)
        return result
    }

    export function* take<T>(values: Iterable<T>, count: number): Iterable<T> {
        let counter = 0
        for (const value of values) {
            counter++
            if (counter > count)
                break
            yield value
        }
    }

    export function toArray<T>(values: Iterable<T>): T[] {
        const result = []
        for (const value of values)
            result.push(value)
        return result
    }

    export function* toIterable<T>(input: T | Iterable<T>): Iterable<T> {
        var values = isIterable(input)
            ? input
            : [input]

        for (const value of values)
            yield value
    }

    export function toLookup<T, K extends Value, B>(values: Iterable<T>, keySelector: ValueSelector<T, K>, valueSelector: Selector<T, B>): Map<K, B[]> {
        const result = new Map<K, B[]>()
        for (const group of groupBy(values, keySelector, valueSelector))
            result.set(group.key, group.values)
        return result
    }

    export function toMap<T, K extends Value, B>(values: Iterable<T>, keySelector: ValueSelector<T, K>, valueSelector: Selector<T, B>): Map<K, B> {
        const result = new Map<K, B>()
        for (const value of values) {
            const key = keySelector(value)
            const val = valueSelector(value)
            if (result.has(key)) throw "Duplicate key found"
            result.set(key, val)
        }
        return result
    }

    export function toSet<T>(values: Iterable<T>): Set<T> {
        return new Set(values)
    }

    export function* where<T>(values: Iterable<T>, predicate: Predicate<T>) {
        for (const value of values) {
            if (predicate(value))
                yield value
        }
    }

    export function* zip<A, B, C>(first: Iterable<A>, second: Iterable<B>, resultSelector: ResultSelector<A, B, C>) {
        var fi = first[Symbol.iterator]()
        var si = second[Symbol.iterator]()

        while (true) {
            const f = fi.next()
            const s = si.next()

            if (f.done || s.done)
                break

            yield resultSelector(f.value, s.value)
        }
    }

    function isIterable<T>(o: T | Iterable<T>): o is Iterable<T> {
        return Symbol.iterator in Object(o)
    }

    function add<T>(values: Set<T>, value: T) {
        if (!values.has(value)) {
            values.add(value)
            return true
        }
        return false
    }

    function toComparer<T, K>(compareSelector: SelectOrder<T, K>): Comparer<T> {
        const [direction, [select, compare]] = compareSelector
        return (a, b) => {
            const result = compare(select(a), select(b))
            return direction == "asc"
                ? result
                : result * -1
        }
    }

    function compareMany<T>(a: T, b: T, comparers: Comparer<T>[]) {
        for (const compare of comparers) {
            const result = compare(a, b)
            if (result !== 0)
                return result
        }
        return 0
    }
}

