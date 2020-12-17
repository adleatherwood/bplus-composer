import { Option } from "../src/option"

describe("Option examples", () => {

    test("match example", () => {
        let option = "some value"
        let result = Option.match(option,
            success => success.split(" "),
            failure => [])

        expect(result.length).toBe(2)
    })

    test("query example", () => {
        let option = "some value"
        let result = Option.query(option)
            .select(text => text.split(" "))
            .single()

        expect(result.length).toBe(2)
    })

    test("typical example", () => {
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
    })

    test("option is", () => {
        let option = "test"
        let success = Option.isSome(option)
        let failure = Option.isNone(option)

        expect(success).toBe(true)
        expect(failure).toBe(false)
    })
})

describe("option tests", () => {

    test("some test", () => {
        let option = "test"
        let actual = Option.match(option,
            some => some,
            none => fail("should not be none"))

        expect(actual).toBe("test")
    })

    test("undefined as none test", () => {
        let option = undefined
        let actual = Option.match(option,
            some => fail("should not be some"),
            none => "pass")

        expect(actual).toBe("pass")
    })

    test("null as none test", () => {
        let option = null
        let actual = Option.match(option,
            some => fail("should not be some"),
            none => "pass")

        expect(actual).toBe("pass")
    })

    test("isSome test", () => {
        let option = "test"
        let actual = Option.isSome(option)

        expect(actual).toBe(true)
    })

    test("isSome with undefined", () => {
        let option = undefined
        let actual = Option.isSome(option)

        expect(actual).toBe(false)
    })

    test("isSome with null", () => {
        let option = null
        let actual = Option.isSome(option)

        expect(actual).toBe(false)
    })

    test("isNone with value", () => {
        let option = "test"
        let actual = Option.isNone(option)

        expect(actual).toBe(false)
    })

    test("isNone with undefined", () => {
        let option = undefined
        let actual = Option.isNone(option)

        expect(actual).toBe(true)
    })

    test("isNone with null", () => {
        let option = null
        let actual = Option.isNone(option)

        expect(actual).toBe(true)
    })

    test("query with value", () => {
        let option = "123"
        let actual = Option.query(option)
            .any()

        expect(actual).toBe(true)
    })

    test("query without value", () => {
        let option = undefined
        let actual = Option.query(option)
            .any()

        expect(actual).toBe(false)
    })
})