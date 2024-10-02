import { expect } from '@jest/globals'
import {
  TJSONConverter,
  ParseOptions,
  TJSON,
  INT8_ARRAY_CONVERTER,
  UINT8_ARRAY_CONVERTER,
  UINT8_CLAMPED_ARRAY_CONVERTER,
  INT16_ARRAY_CONVERTER,
  UINT16_ARRAY_CONVERTER,
  INT32_ARRAY_CONVERTER,
  UINT32_ARRAY_CONVERTER,
  FLOAT32_ARRAY_CONVERTER,
  FLOAT64_ARRAY_CONVERTER,
  BIGINT64_ARRAY_CONVERTER,
  BIGUINT64_ARRAY_CONVERTER,
} from '../dist/index.esm'

describe('test basic types', () => {
  it('test undefined not registered', () => {
    const TypedJSON = new TJSON()
    const input = undefined
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test null not registered', () => {
    const TypedJSON = new TJSON()
    const input = null
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{}')
    expect(TypedJSON.parse(tjson)).toEqual(undefined)
  })
  it('test string', () => {
    const TypedJSON = new TJSON()
    const input = 'test string'
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":"test string","type":{}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test number', () => {
    const TypedJSON = new TJSON()
    const input = 1
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":1,"type":{}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test Infinity', () => {
    const TypedJSON = new TJSON()
    const input = 1 / 0
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":"Infinity","type":{"":"js:number:infinity"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test -Infinity', () => {
    const TypedJSON = new TJSON()
    const input = -1 / 0
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":"-Infinity","type":{"":"js:number:infinity"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test NaN', () => {
    const TypedJSON = new TJSON()
    const input = NaN
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":"NaN","type":{"":"js:number:nan"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test Set', () => {
    const TypedJSON = new TJSON()
    const input = new Set(['a', 'b', 'c'])
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":["a","b","c"],"type":{"":"js:set"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test nested types in Set', () => {
    const TypedJSON = new TJSON()
    const input = new Set([new Date('2018-05-18'), 1n, new Set(['a', 2n]), /a-Z/g])
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual(
      '{"content":["2018-05-18T00:00:00.000Z","1",["a","2"],"/a-Z/g"],"type":{"":"js:set","[0]":"js:date","[1]":"js:bigint","[2]":"js:set","[2].[1]":"js:bigint","[3]":"js:regex"}}',
    )
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test Map', () => {
    const TypedJSON = new TJSON()
    const input = new Map<string, any>([
      ['a', 'b'],
      ['date', new Date('2018-05-18')],
    ])
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual(
      '{"content":[["a","b"],["date","2018-05-18T00:00:00.000Z"]],"type":{"":"js:map","[1].[1]":"js:date"}}',
    )
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test strange Map', () => {
    const TypedJSON = new TJSON()
    const input = new Map<any, any>([
      [1, 'b'],
      [new Date('2018-05-18'), 'date'],
    ])
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual(
      '{"content":[[1,"b"],["2018-05-18T00:00:00.000Z","date"]],"type":{"":"js:map","[1].[0]":"js:date"}}',
    )
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test Date', () => {
    const TypedJSON = new TJSON()
    const input = new Date('2024-09-11')
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":"2024-09-11T00:00:00.000Z","type":{"":"js:date"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test invalid Date', () => {
    const TypedJSON = new TJSON()
    const input = new Date('invalid date')
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":null,"type":{"":"js:date"}}')
    expect(TypedJSON.parse(tjson).getTime()).toEqual(input.getTime())
  })
  it('test BigInt', () => {
    const TypedJSON = new TJSON()
    const input = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":"9007199254740992","type":{"":"js:bigint"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test regex', () => {
    const TypedJSON = new TJSON()
    const input = /a-Z/i
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":"/a-Z/i","type":{"":"js:regex"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test register custom Date', () => {
    const TypedJSON = new TJSON()
    class CDate {
      constructor(public date: Date) {}
    }
    const input = new CDate(new Date('2024-09-12'))

    const DATE_CONVERTER: TJSONConverter<CDate> = {
      is: function (obj: any): boolean {
        return obj instanceof CDate
      },
      key: 'date',
      toTJSON: function (obj: CDate): Array<any> | string {
        return obj.date.getTime().toFixed(0)
      },
      fromTJSON: function (obj: string): CDate {
        return new CDate(new Date(parseInt(obj)))
      },
    }
    TypedJSON.register(DATE_CONVERTER)
    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":"1726099200000","type":{"":"date"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
  it('test register undefined', () => {
    const TypedJSON = new TJSON().registerUndefined()
    const input = { undefined: undefined, null: null }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{"undefined":"undefined"},"type":{"undefined":"js:undefined"}}')
    expect(TypedJSON.parse(tjson)).toEqual({ undefined: undefined })
  })
  it('test register null', () => {
    const TypedJSON = new TJSON().registerNull()
    const input = { undefined: undefined, null: null }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{"null":"null"},"type":{"null":"js:null"}}')
    expect(TypedJSON.parse(tjson)).toEqual({ null: null })
  })
  it('test undefined and null without register', () => {
    const TypedJSON = new TJSON()
    const input = { undefined: undefined, null: null }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{},"type":{}}')
    expect(TypedJSON.parse(tjson)).toEqual({})
  })
  it('test symbol', () => {
    const TypedJSON = new TJSON()
    const input = { local: Symbol('local'), global: Symbol.for('global') }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual(
      '{"content":{"local":"local","global":"global"},"type":{"local":"js:symbol","global":"js:symbol"}}',
    )
    const parsed = TypedJSON.parse(tjson)
    expect(typeof parsed.local).toBe('symbol')
    expect(typeof parsed.global).toBe('symbol')
    expect(Symbol.keyFor(parsed.local)).toBe('local')
    expect(Symbol.keyFor(parsed.global)).toBe('global')
  })
})
describe('Typed Array Transformers', () => {
  it('test Int8Array', () => {
    const TypedJSON = new TJSON().register(INT8_ARRAY_CONVERTER)
    const input = { int8Array: new Int8Array([0, -1, 64]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{"int8Array":[0,-1,64]},"type":{"int8Array":"js:int8array"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })

  it('test Uint8Array', () => {
    const TypedJSON = new TJSON().register(UINT8_ARRAY_CONVERTER)
    const input = { uint8Array: new Uint8Array([0, 255]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{"uint8Array":[0,255]},"type":{"uint8Array":"js:uint8array"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })

  it('test Uint8ClampedArray', () => {
    const TypedJSON = new TJSON().register(UINT8_CLAMPED_ARRAY_CONVERTER)
    const input = { uint8ClampedArray: new Uint8ClampedArray([0, 255, 300]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual(
      '{"content":{"uint8ClampedArray":[0,255,255]},"type":{"uint8ClampedArray":"js:uint8clampedarray"}}',
    )
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })

  it('test Int16Array', () => {
    const TypedJSON = new TJSON().register(INT16_ARRAY_CONVERTER)
    const input = { int16Array: new Int16Array([0, -1, 64]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{"int16Array":[0,-1,64]},"type":{"int16Array":"js:int16array"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })

  it('test Uint16Array', () => {
    const TypedJSON = new TJSON().register(UINT16_ARRAY_CONVERTER)
    const input = { uint16Array: new Uint16Array([0, 65535]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{"uint16Array":[0,65535]},"type":{"uint16Array":"js:uint16array"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })

  it('test Int32Array', () => {
    const TypedJSON = new TJSON().register(INT32_ARRAY_CONVERTER)
    const input = { int32Array: new Int32Array([0, -1, 64]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{"int32Array":[0,-1,64]},"type":{"int32Array":"js:int32array"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })

  it('test Uint32Array', () => {
    const TypedJSON = new TJSON().register(UINT32_ARRAY_CONVERTER)
    const input = { uint32Array: new Uint32Array([0, 4294967295]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{"uint32Array":[0,4294967295]},"type":{"uint32Array":"js:uint32array"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })

  it('test Float32Array', () => {
    const TypedJSON = new TJSON().register(FLOAT32_ARRAY_CONVERTER)
    const input = { float32Array: new Float32Array([0.1, -1.5, 64.3]) }

    const tjson = TypedJSON.stringify(input)
    const parsed = TypedJSON.parse(tjson)
    expect(parsed?.float32Array[0]).toBeCloseTo(0.1, 5)
    expect(parsed?.float32Array[1]).toBeCloseTo(-1.5, 5)
    expect(parsed?.float32Array[2]).toBeCloseTo(64.3, 5)
  })

  it('test Float64Array', () => {
    const TypedJSON = new TJSON().register(FLOAT64_ARRAY_CONVERTER)
    const input = { float64Array: new Float64Array([0.1, -1.5, 64.3]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual('{"content":{"float64Array":[0.1,-1.5,64.3]},"type":{"float64Array":"js:float64array"}}')
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })

  it('test BigInt64Array', () => {
    const TypedJSON = new TJSON().register(BIGINT64_ARRAY_CONVERTER)
    const input = { bigint64Array: new BigInt64Array([9007199254740991n, -9007199254740991n]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual(
      '{"content":{"bigint64Array":["9007199254740991","-9007199254740991"]},"type":{"bigint64Array":"js:bigint64array","bigint64Array.[0]":"js:bigint","bigint64Array.[1]":"js:bigint"}}',
    )
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })

  it('test BigUint64Array', () => {
    const TypedJSON = new TJSON().register(BIGUINT64_ARRAY_CONVERTER)
    const input = { biguint64Array: new BigUint64Array([BigInt(0), 18446744073709551615n]) }

    const tjson = TypedJSON.stringify(input)
    expect(tjson).toEqual(
      '{"content":{"biguint64Array":["0","18446744073709551615"]},"type":{"biguint64Array":"js:biguint64array","biguint64Array.[0]":"js:bigint","biguint64Array.[1]":"js:bigint"}}',
    )
    expect(TypedJSON.parse(tjson)).toEqual(input)
  })
})
