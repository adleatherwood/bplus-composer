import { Linq, Compare, Asc, Desc } from "../src/linq"
import { self } from "../src/common"

describe("any tests", () => {

    test("any is true for many", () => {
        let input = [1, 2, 3]
        let actual = Linq.query(input)
            .any()

        expect(actual).toBe(true)
    })

    test("any is true for single", () => {
        let input = [1]
        let actual = Linq.query(input)
            .any()

        expect(actual).toBe(true)
    })

    test("any is false for empty", () => {
        let input: number[] = []
        let actual = Linq.query(input)
            .any()

        expect(actual).toBe(false)
    })
})

describe("append tests", () => {

    test("append adds single element", () => {
        let input = [1]
        let actual = Linq.query(input)
            .append(2)
            .toArray()
            .join()

        expect(actual).toBe("1,2")
    })

    test("append adds multiple elements", () => {
        let input = [1]
        let actual = Linq.query(input)
            .append(2)
            .append(3)
            .toArray()
            .join()

        expect(actual).toBe("1,2,3")
    })
})

describe("concat tests", () => {

    test("concat adds elements", () => {
        let input = [1, 2]
        let actual = Linq.query(input)
            .concat([3, 4])
            .toArray()
            .join()

        expect(actual).toBe("1,2,3,4")
    })

    test("concat adds no elements", () => {
        let input = [1, 2]
        let actual = Linq.query(input)
            .concat([])
            .toArray()
            .join()

        expect(actual).toBe("1,2")
    })

    test("concat another enumerable", () => {
        let input = [1, 2]
        let other = Linq.query([3, 4])
            .toIterable()
        let actual = Linq.query(input)
            .concat(other)
            .toArray()
            .join()

        expect(actual).toBe("1,2,3,4")
    })
})

describe("count tests", () => {

    test("count for zero items", () => {
        let actual = Linq.query([])
            .count()

        expect(actual).toBe(0)
    })

    test("count for one item", () => {
        let actual = Linq.query([2])
            .count()

        expect(actual).toBe(1)
    })

    test("count for multiple items", () => {
        let actual = Linq.query([1, 2, 3])
            .count()

        expect(actual).toBe(3)
    })
})

describe("distinctBy tests", () => {

    test("distinctBy string value", () => {
        let input = ["a", "b", "a", "c", "b", "a"]
        let actual = Linq.query(input)
            .distinctBy(self)
            .toArray()
            .join()

        expect(actual).toBe("a,b,c")
    })

    test("distinctBy number value", () => {
        let input = [1, 2, 1, 3, 1, 3, 2]
        let actual = Linq.query(input)
            .distinctBy(self)
            .toArray()
            .join()

        expect(actual).toBe("1,2,3")
    })
})

describe("except tests", () => {

    test("except string test", () => {
        let input = ["a", "b", "c", "d", "e", "f"]
        let other = ["b", "d", "f"]

        let actual = Linq.query(input)
            .except(other, self)
            .toArray()
            .join()

        expect(actual).toBe("a,c,e")
    })

    test("except number test", () => {
        let input = [1, 2, 3, 4, 5, 6]
        let other = [2, 4, 6]

        let actual = Linq.query(input)
            .except(other, self)
            .toArray()
            .join()

        expect(actual).toBe("1,3,5")
    })
})

describe("first tests", () => {

    test("first of many", () => {
        let input = [3, 2, 1]
        let actual = Linq.query(input)
            .first()

        expect(actual).toBe(3)
    })

    test("first of none throws", () => {
        try {
            Linq.query([]).first()
            fail("no error thrown")
        } catch (error) {
            expect(error).toBeTruthy()
        }
    })
})

describe("firstOrUndefined tests", () => {

    test("firstOrUndefined of many", () => {
        let input = [3, 4, 5]
        let actual = Linq.query(input)
            .firstOrUndefined()

        expect(actual).toBe(3)
    })

    test("firstOrUndefined of none", () => {
        let input: number[] = []
        let actual = Linq.query(input)
            .firstOrUndefined()

        expect(actual).toBeUndefined()
    })
})

describe("groupBy tests", () => {

    test("groupBy basic usage", () => {
        let input = [1, 2, 2, 3, 3, 3]
        let actual = Linq.query(input)
            .groupBy(self, self)
            .select(g => g.values.join(""))
            .toArray()
            .join()

        expect(actual).toBe("1,22,333")
    })
})

describe("join tests", () => {

    test("join basic usage", () => {
        let input = [1, 2, 3]
        let other = [3, 2, 1]
        let actual = Linq.query(input)
            .join(other, self, self, (a, b) => `${a}${b}`)
            .toArray()
            .join()

        expect(actual).toBe("11,22,33")
    })
})

describe("last tests", () => {

    test("last from many", () => {
        let input = [1, 2, 3]
        let actual = Linq.query(input)
            .last()

        expect(actual).toBe(3)
    })

    test("last from none throws", () => {
        try {
            let input: number[] = []
            Linq.query(input)
                .last()
        } catch (error) {
            expect(error).toBeTruthy()
        }
    })
})

describe("lastOrUndefined tests", () => {

    test("lastOrUndefined from many", () => {
        let input = [1, 2, 3]
        let actual = Linq.query(input)
            .lastOrUndefined()

        expect(actual).toBe(3)
    })

    test("lastOrUndefined from none", () => {
        let input: number[] = []
        let actual = Linq.query(input)
            .lastOrUndefined()

        expect(actual).toBeUndefined()
    })
})

describe("maxOf tests", () => {

    test("maxOf many", () => {
        let input = [3, 5, 1]
        let actual = Linq.query(input)
            .maxOf(Compare.self())

        expect(actual).toBe(5)
    })

    test("maxOf none", () => {
        let input: number[] = []
        let actual = Linq.query(input)
            .maxOf(Compare.self())

        expect(actual).toBeUndefined()
    })
})

describe("minOf tests", () => {

    test("minOf many", () => {
        let input = [3, 5, 1]
        let actual = Linq.query(input)
            .minOf(Compare.self())

        expect(actual).toBe(1)
    })

    test("minOf none", () => {
        let input: number[] = []
        let actual = Linq.query(input)
            .maxOf(Compare.self())

        expect(actual).toBeUndefined()
    })
})

describe("orderBy tests", () => {

    test("orderBy ascending", () => {
        let input = [5, 2, 4, 3, 1]
        let actual = Linq.query(input)
            .orderBy(Asc.self())
            .toArray()
            .join()

        expect(actual).toBe("1,2,3,4,5")
    })

    test("orderBy descending", () => {
        let input = [5, 2, 4, 3, 1]
        let actual = Linq.query(input)
            .orderBy(Desc.self())
            .toArray()
            .join()

        expect(actual).toBe("5,4,3,2,1")
    })

    test("orderBy multi-directional", () => {
        let input = [[2, 1], [3, 2], [2, 3], [2, 2], [1, 3], [1, 2], [3, 3], [1, 1], [3, 1]]
        let actual = Linq.query(input)
            .orderBy(Desc.by(t => t[0]), Asc.by(t => t[1]))
            .select(t => `${t[0]}${t[1]}`)
            .toArray()
            .join()

        expect(actual).toBe("31,32,33,21,22,23,11,12,13")
    })
})

describe("prepend tests", () => {

    test("prepend single", () => {
        let input = [2, 3, 4]
        let actual = Linq.query(input)
            .prepend(1)
            .toArray()
            .join()

        expect(actual).toBe("1,2,3,4")
    })

    test("prepend multiple", () => {
        let input = [3, 4, 5]
        let actual = Linq.query(input)
            .prepend(1)
            .prepend(2)
            .toArray()
            .join()

        expect(actual).toBe("2,1,3,4,5")
    })
})

describe("select tests", () => {

    test("basic usage", () => {
        let input = [1, 2, 3]
        let actual = Linq.query(input)
            .select(n => `num:${n}`)
            .toArray()
            .join()

        expect(actual).toBe("num:1,num:2,num:3")
    })
})

describe("selectMany tests", () => {

    test("selectMany basic usage", () => {
        let input = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        let actual = Linq.query(input)
            .selectMany(self)
            .toArray()
            .join()

        expect(actual).toBe("1,2,3,4,5,6,7,8,9")
    })
})

describe("single tests", () => {

    test("single of one", () => {
        let input = [1]
        let actual = Linq.query(input)
            .single()

        expect(actual).toBe(1)
    })

    test("single of none throws", () => {
        try {
            let input: number[] = []
            Linq.query(input).single()
            fail("no error thrown")
        } catch (error) {
            expect(error).toBeTruthy()
        }
    })

    test("single of many throws", () => {
        try {
            let input = [1, 1]
            Linq.query(input).single()
            fail("no error thrown")
        } catch (error) {
            expect(error).toBeTruthy()
        }
    })
})

describe("singleOrUndefined tests", () => {

    test("singleOrUndefined of one", () => {
        let input = [1]
        let actual = Linq.query(input)
            .singleOrUndefined()

        expect(actual).toBe(1)
    })

    test("singleOrUndefined of none", () => {
        let input: number[] = []
        let actual = Linq.query(input)
            .singleOrUndefined()

        expect(actual).toBeUndefined()
    })

    test("singleOrUndefined of many throws", () => {
        try {
            let input = [1, 1]
            Linq.query(input).singleOrUndefined()
            fail("no error thrown")
        } catch (error) {
            expect(error).toBeTruthy()
        }
    })
})

describe("skip tests", () => {

    test("skip once", () => {
        let input = [1, 2, 3, 4, 5, 6]
        let actual = Linq.query(input)
            .skip(3)
            .toArray()
            .join()

        expect(actual).toBe("4,5,6")
    })

    test("skip many", () => {
        let input = [1, 2, 3, 4, 5, 6]
        let actual = Linq.query(input)
            .skip(1)
            .skip(1)
            .skip(1)
            .toArray()
            .join()

        expect(actual).toBe("4,5,6")
    })
})

describe("sumOf tests", () => {

    test("sumOf basic usage", () => {
        let input = [1, 2, 3]
        let actual = Linq.query(input)
            .sumOf(self)

        expect(actual).toBe(6)
    })
})

describe("take tests", () => {

    test("take single test", () => {
        let input = [3, 2, 1]
        let actual = Linq.query(input)
            .take(1)
            .toArray()
            .join()

        expect(actual).toBe("3")
    })

    test("take many test", () => {
        let input = [3, 2, 1]
        let actual = Linq.query(input)
            .take(2)
            .toArray()
            .join()

        expect(actual).toBe("3,2")
    })

    test("take more than available test", () => {
        let input = [3, 2, 1]
        let actual = Linq.query(input)
            .take(16)
            .toArray()
            .join()

        expect(actual).toBe("3,2,1")
    })

    test("take from empty test", () => {
        let input: number[] = []
        let actual = Linq.query(input)
            .take(3)
            .toArray()
            .join()

        expect(actual).toBe("")
    })
})

describe("toArray tests", () => {

    test("toArray basic usage", () => {
        let input = [1, 2, 3]
        let actual = Linq.query(input)
            .toArray()

        expect(Array.isArray(actual)).toBe(true)
        expect(actual.length).toBe(3)
        expect(actual[0]).toBe(1)
        expect(actual[1]).toBe(2)
        expect(actual[2]).toBe(3)
    })
})

describe("toEnumerable tests", () => {

    test("toEnumerable basic usage", () => {
        let input = [1, 2, 3]
        let iterable = Linq.query(input)
            .toIterable()

        let actual = ""
        for (const value of iterable) {
            actual += value.toString()
        }

        expect(actual).toBe("123")
    })
})

describe("toLookup tests", () => {

    test("toLookup basic usage", () => {
        let input = [{ id: 1, value: "a" }, { id: 2, value: "a" }, { id: 2, value: "b" }, { id: 3, value: "a" }, { id: 3, value: "b" }, { id: 3, value: "c" }]
        let actual = Linq.query(input)
            .toLookup(r => r.id, r => r.value)

        let x = actual.get(1)
        let y = actual.get(2)
        let z = actual.get(3)

        if (x && y && z) {
            expect(x.join()).toBe("a")
            expect(y.join()).toBe("a,b")
            expect(z.join()).toBe("a,b,c")
        }
        else
            fail("values are undefined")
    })
})

describe("toMap tests", () => {

    test("toMap basic usage", () => {
        let input = [{ id: 1, value: "a" }, { id: 2, value: "b" }, { id: 3, value: "c" }]
        let actual = Linq.query(input)
            .toMap(r => r.id, r => r.value)

        expect(actual.get(1)).toBe("a")
        expect(actual.get(2)).toBe("b")
        expect(actual.get(3)).toBe("c")
    })

    test("toMap throws on duplicate key", () => {
        try {
            let input = [{ id: 1, value: "a" }, { id: 1, value: "b" }]
            Linq.query(input).toMap(r => r.id, r => r.value)
            fail("no error thrown")
        } catch (error) {
            expect(error).toBeTruthy()
        }
    })
})

describe("toSet tests", () => {

    test("toSet basic usage", () => {
        let input = [1, 2, 2, 3, 3, 3]
        let set = Linq.query(input)
            .toSet()

        let actual: number[] = []
        set.forEach(v => actual.push(v))

        expect(actual.join()).toBe("1,2,3")
    })
})

describe("where tests", () => {

    test("where basic usage", () => {
        let input = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        let actual = Linq.query(input)
            .where(n => n % 2 == 0)
            .toArray()
            .join()

        expect(actual).toBe("2,4,6,8")
    })
})

describe("zip tests", () => {

    test("zip basic usage", () => {
        let input = [1, 2, 3]
        let other = ["a", "b", "c"]
        let actual = Linq.query(input)
            .zip(other, (a, b) => [a, b])
            .select(a => a.join(""))
            .toArray()
            .join()

        expect(actual).toBe("1a,2b,3c")
    })
})