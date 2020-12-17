# BPLUS-COMPOSER

A functional composition library for TypeScript based on F# and Linq.  The Linq implementation
is fully lazy with the exception of the few functions that require a full iterable evaluation.

![pipeline](https://gitlab.com/adleatherwood/bplus-composer/badges/master/pipeline.svg)
![coverage](https://gitlab.com/adleatherwood/bplus-composer/badges/master/coverage.svg)

#### Note

This project is maintained over at GitLab: https://gitlab.com/adleatherwood/bplus-composer

## Install

https://www.npmjs.com/package/bplus-composer

```sh
npm i bplus-composer
```

## Option

An option is defined as either having a value or not.

```ts
export type Option<T> = T | undefined | null
```

You can deconstruct an option with either the match function...

```ts
let option = "some value"
let result = Option.match(option,
    success => success.split(" "),
    failure => [])

expect(result.length).toBe(2)
```

Or you can use the query function to enumerate the result.  Undefined & null will
result in an empty enumeration.

```ts
let option = "some value"
let result = Option.query(option)
    .select(text => text.split(" "))
    .single()

expect(result.length).toBe(2)
```

A typical example of how an option would appear in code.

```ts
let map = new Map([
    [1, { id: 1, first: "Larry", last: "Fine" }],
    [2, { id: 2, first: "Curly", last: "Howard" }],
    [3, { id: 3, first: "Moe", last: "Howard" }]
])

let result = map.get(2)
let initials = Option.query(result)
    .select(s => `${s.first[0]}.${s.last[0]}.`)
    .singleOrUndefined()

expect(initials).toBe("C.H.")
```

You can also test results for some or none.

```ts
let option = "test"
let success = Option.isSome(option)
let failure = Option.isNone(option)

expect(success).toBe(true)
expect(failure).toBe(false)
```

## Result

A result either has a value or an error.  Unlike the option, you need to construct a result as
either a `success` or a `failure`.

```ts
let success = Result.success("test")
let failure = Result.failure("something went wrong")
```

You can deconstruct a result either the match function...

```ts
let result = Result.success("test")
let value = Result.match(result,
    success => "successful " + success,
    failure => "epic failure")

expect(value).toBe("successful test")
```

Or you can use the query function to enumerate the result.  Failures will
result in an empty enumeration.

```ts
let result = Result.success("test")
let value = Result.query(result)
    .select(text => "successful " + text)
    .select(text => text.toUpperCase())
    .single()

expect(value).toBe("SUCCESSFUL TEST")
```

You can also test results for success or failure.

```ts
let result = Result.success("test")
let success = Result.isSuccess(result)
let failure = Result.isFailure(result)

expect(success).toBe(true)
expect(failure).toBe(false)
```

## Linq

I won't list all of the Linq functions that are implemented and how to use them.  They are mostly all
there and are used in a similar and intuitive manner as in C#.  There are some differences worth mentioning.
Although TypeScript offers enough flexibility for function overloads, they are generally very cumbersome
and this library would have had an unmanageable number of them.  Here are some of the more different
arrangements:

### OrderBy

In C#, you would use multiple subsequent Linq statements to sort data with secondary sorts.  In this
library, you will do it all in one statement.

```ts
let input = [5, 2, 4, 3, 1]
let actual = Linq.query(input)
    .orderBy(Asc.self())
    .toArray()
    .join()

expect(actual).toBe("1,2,3,4,5")

let input = [5, 2, 4, 3, 1]
let actual = Linq.query(input)
    .orderBy(Desc.self())
    .toArray()
    .join()

expect(actual).toBe("5,4,3,2,1")
```

Note the helper types of `Asc` and `Desc`.  There are other functions on those type that will allow you
to pass through custom key selectors and comparers.  Like so:

```ts
let input = [[2, 1], [3, 2], [2, 3], [2, 2], [1, 3], [1, 2], [3, 3], [1, 1], [3, 1]]
let actual = Linq.query(input)
    .orderBy(Desc.by(t => t[0]), Asc.by(t => t[1]))
    .select(t => `${t[0]}${t[1]}`)
    .toArray()
    .join()

expect(actual).toBe("31,32,33,21,22,23,11,12,13")
```

### MinOf & MaxOf

In C#, type specific extension methods either show or hide these functions base on specific types that
this function can be performed on.  In TypeScript we have no such luxury, so the function is always
available.  In this construct, you have to tell the function what you want to be matched.

```ts
let input = [3, 5, 1]
let actual = Linq.query(input)
    .maxOf(Compare.self())

expect(actual).toBe(5)
```

Again, there's a new helper called `Compare` that you can use to make these moments more readable.  There
are other functions on `Compare` that will allow you to pass through custom selectors and comparers.

### DistinctBy & toMap & toSet

These function use the native Map & Set types.  These types have restrictions on what types of value can
be used as keys, etc.  So the Linq functions are also restricted to these types.

```ts
let input = ["a", "b", "a", "c", "b", "a"]
let actual = Linq.query(input)
    .distinctBy(self)
    .toArray()
    .join()

expect(actual).toBe("a,b,c")
```

Notice the helper function `self` that can be used to select and return the item itself.  This function
is not necessary, but can make code more readable.

Icons made by [Freepik](http://www.freepik.com/) from [www.flaticon.com](https://www.flaticon.com/)
