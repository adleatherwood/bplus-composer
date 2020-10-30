import { Result } from "../src/result"

describe("result examples", () => {

    test("result construct success", () => {
        let success = Result.success("test")
        let failure = Result.failure("something went wrong")
    })

    test("result match", () => {
        let result = Result.success("test")
        let value = Result.match(result,
            success => "successful " + success,
            failure => "epic failure")

        expect(value).toBe("successful test")
    })

    test("result query", () => {
        let result = Result.success("test")
        let value = Result.query(result)
            .select(text => "successful " + text)
            .select(text => text.toUpperCase())
            .single()

        expect(value).toBe("SUCCESSFUL TEST")
    })

    test("result is", () => {
        let result = Result.success("test")
        let success = Result.isSuccess(result)
        let failure = Result.isFailure(result)

        expect(success).toBe(true)
        expect(failure).toBe(false)
    })
})

describe("result tests", () => {

    test("succeed with value", () => {
        let result = Result.success("test")
        let actual = Result.match(result,
            success => success,
            failure => "fail")

        expect(actual).toBe("test")
    })

    test("succeed with undefined", () => {
        let result = Result.success(undefined)
        let actual = Result.match(result,
            success => success,
            failure => "fail")

        expect(actual).toBeUndefined()
    })

    test("isSuccess with value", () => {
        let result = Result.success("test")
        let actual = Result.isSuccess(result)

        expect(actual).toBe(true)
    })

    test("isSuccess with undefined", () => {
        let result = Result.success(undefined)
        let actual = Result.isSuccess(result)

        expect(actual).toBe(true)
    })

    test("fail with error", () => {
        let result = Result.failure("epic")
        let actual = Result.match(result,
            success => success,
            failure => "pass")

        expect(actual).toBe("pass")
    })

    test("isfailure with error", () => {
        let result = Result.failure("epic")
        let actual = Result.isFailure(result)

        expect(actual).toBe(true)
    })

    test("query with value", () => {
        let result = Result.success("123")
        let actual = Result.query(result)
            .any()

        expect(actual).toBe(true)
    })

    test("query without value", () => {
        let option = Result.failure("")
        let actual = Result.query(option)
            .any()

        expect(actual).toBe(false)
    })
})
