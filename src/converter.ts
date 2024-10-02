import { parse, ParseOptions } from './parse'
import { preStringify, PreStringifyOptions } from './pre-stringify'
/**
 * Interface for defining a custom TJSON converter.
 * @template T - The type being converted.
 */
export interface TJSONConverter<T> {
  is: (obj: any) => boolean
  key: string
  toTJSON: (obj: T, options: PreStringifyOptions) => Array<any> | string
  fromTJSON: (content: any, type: any, options: ParseOptions) => T
}
/**
 * Abstract class for TJSON mappers that define custom serialization/deserialization logic.
 * @template T - The type being converted.
 */
export abstract class TJSONMapper<T> implements TJSONConverter<T> {
  abstract is: (obj: any) => boolean
  abstract key: string
  abstract toTJSON: (obj: T, options: PreStringifyOptions) => Array<any> | string
  abstract fromTJSON: (content: any, type: any, options: ParseOptions) => T
}

export const DATE_CONVERTER: TJSONConverter<Date> = {
  key: 'js:date',
  is: (obj: Date) => {
    return Date === obj?.constructor
  },
  toTJSON: (obj: Date) => {
    return obj?.toJSON()
  },
  fromTJSON: (obj: string) => {
    /**
     * when date is invalid it return null
     * null creates an valid date
     * ==> create an invalid date again
     **/
    if (obj === null) {
      return new Date(NaN)
    }
    return new Date(obj)
  },
}
export const NAN_CONVERTER: TJSONConverter<number> = {
  key: 'js:number:nan',
  is: (obj: any) => {
    return Number.isNaN(obj)
  },
  toTJSON: () => {
    return 'NaN'
  },
  fromTJSON: (): number => {
    return NaN
  },
}

export const INFINITY_CONVERTER: TJSONConverter<any> = {
  key: 'js:number:infinity',
  is: (obj: any) => {
    return Number.POSITIVE_INFINITY === obj || Number.NEGATIVE_INFINITY === obj
  },
  toTJSON: (obj: any) => {
    if (Number.POSITIVE_INFINITY === obj) {
      return 'Infinity'
    } else {
      return '-Infinity'
    }
  },
  fromTJSON: (obj: string) => {
    if ('Infinity' === obj) {
      return Infinity
    } else {
      return -Infinity
    }
  },
}

export const SET_CONVERTER: TJSONConverter<Set<any>> = {
  key: 'js:set',
  is: (obj: any) => {
    return Set === obj?.constructor
  },
  toTJSON: (obj, options) => {
    return preStringify([...obj], options)
  },
  fromTJSON: (objs, type, options) => {
    return new Set(
      objs.map((obj, i) => parse(obj, type, { ...options, parentKey: [...(options.parentKey ?? []), `[${i}]`] })),
    )
  },
}

export const BIGINT_CONVERTER: TJSONConverter<BigInt> = {
  key: 'js:bigint',
  is: (obj: any) => {
    return typeof obj === 'bigint'
  },

  toTJSON: (obj) => {
    return obj.toString()
  },

  fromTJSON: (obj) => {
    return BigInt(obj)
  },
}

export const MAP_CONVERTER: TJSONConverter<Map<any, any>> = {
  key: 'js:map',
  is: (obj: any) => {
    return Object.prototype.toString.call(obj) === '[object Map]'
  },

  toTJSON: (obj, options) => {
    return preStringify([...obj.entries()], options)
  },
  fromTJSON: (objs, type, options) => {
    const mapValues = objs.map((obj, i) =>
      parse(obj, type, { ...options, parentKey: [...(options.parentKey ?? []), `[${i}]`] }),
    )
    return new Map(mapValues)
  },
}

export const REGEX_CONVERTER: TJSONConverter<RegExp> = {
  key: 'js:regex',
  is: (obj: any) => {
    return Object.prototype.toString.call(obj) === '[object RegExp]'
  },
  toTJSON: (obj: RegExp) => {
    return `${obj}`
  },
  fromTJSON: (regexAsString: string) => {
    const regexPattern = regexAsString.slice(1, regexAsString.lastIndexOf('/'))
    const regexFlags = regexAsString.slice(regexAsString.lastIndexOf('/') + 1)
    return new RegExp(regexPattern, regexFlags)
  },
}

export const UNDEFINED_CONVERTER: TJSONConverter<undefined> = {
  key: 'js:undefined',
  is: (obj: any): boolean => {
    return typeof obj === 'undefined'
  },
  toTJSON: (): Array<any> | string => {
    return 'undefined'
  },
  fromTJSON: () => {
    return undefined
  },
}

export const NULL_CONVERTER: TJSONConverter<null> = {
  key: 'js:null',
  is: (obj: any): boolean => {
    return obj === null
  },
  toTJSON: (): Array<any> | string => {
    return 'null'
  },
  fromTJSON: () => {
    return null
  },
}

export const SYMBOL_CONVERTER: TJSONConverter<symbol> = {
  key: 'js:symbol',
  is: (obj: any): boolean => {
    return typeof obj === 'symbol'
  },
  toTJSON: (obj: symbol, options) => {
    return obj.description
  },
  fromTJSON: (obj: string) => {
    return Symbol.for(obj)
  },
}

export const INT8_ARRAY_CONVERTER: TJSONConverter<Int8Array> = {
  key: 'js:int8array',
  is: (obj: any) => obj instanceof Int8Array,
  toTJSON: (obj: Int8Array, options: PreStringifyOptions) => [...obj],
  fromTJSON: (content: any) => new Int8Array(content),
}

export const UINT8_ARRAY_CONVERTER: TJSONConverter<Uint8Array> = {
  key: 'js:uint8array',
  is: (obj: any) => obj instanceof Uint8Array,
  toTJSON: (obj: Uint8Array, options: PreStringifyOptions) => [...obj],
  fromTJSON: (content: any) => new Uint8Array(content),
}

export const UINT8_CLAMPED_ARRAY_CONVERTER: TJSONConverter<Uint8ClampedArray> = {
  key: 'js:uint8clampedarray',
  is: (obj: any) => obj instanceof Uint8ClampedArray,
  toTJSON: (obj: Uint8ClampedArray, options: PreStringifyOptions) => [...obj],
  fromTJSON: (content: any) => new Uint8ClampedArray(content),
}

export const INT16_ARRAY_CONVERTER: TJSONConverter<Int16Array> = {
  key: 'js:int16array',
  is: (obj: any) => obj instanceof Int16Array,
  toTJSON: (obj: Int16Array, options: PreStringifyOptions) => [...obj],
  fromTJSON: (content: any) => new Int16Array(content),
}

export const UINT16_ARRAY_CONVERTER: TJSONConverter<Uint16Array> = {
  key: 'js:uint16array',
  is: (obj: any) => obj instanceof Uint16Array,
  toTJSON: (obj: Uint16Array, options: PreStringifyOptions) => [...obj],
  fromTJSON: (content: any) => new Uint16Array(content),
}

export const INT32_ARRAY_CONVERTER: TJSONConverter<Int32Array> = {
  key: 'js:int32array',
  is: (obj: any) => obj instanceof Int32Array,
  toTJSON: (obj: Int32Array, options: PreStringifyOptions) => [...obj],
  fromTJSON: (content: any) => new Int32Array(content),
}

export const UINT32_ARRAY_CONVERTER: TJSONConverter<Uint32Array> = {
  key: 'js:uint32array',
  is: (obj: any) => obj instanceof Uint32Array,
  toTJSON: (obj: Uint32Array, options: PreStringifyOptions) => [...obj],
  fromTJSON: (content: any) => new Uint32Array(content),
}

export const FLOAT32_ARRAY_CONVERTER: TJSONConverter<Float32Array> = {
  key: 'js:float32array',
  is: (obj: any) => obj instanceof Float32Array,
  toTJSON: (obj: Float32Array, options: PreStringifyOptions) => [...obj],
  fromTJSON: (content: any) => new Float32Array(content),
}

export const FLOAT64_ARRAY_CONVERTER: TJSONConverter<Float64Array> = {
  key: 'js:float64array',
  is: (obj: any) => obj instanceof Float64Array,
  toTJSON: (obj: Float64Array, options: PreStringifyOptions) => [...obj],
  fromTJSON: (content: any) => new Float64Array(content),
}

export const BIGINT64_ARRAY_CONVERTER: TJSONConverter<BigInt64Array> = {
  key: 'js:bigint64array',
  is: (obj: any) => obj instanceof BigInt64Array,
  toTJSON: (obj: BigInt64Array, options: PreStringifyOptions) => preStringify([...obj.values()], options),
  fromTJSON: (content: any, type, options) =>
    new BigInt64Array(
      content.map((obj, i) => parse(obj, type, { ...options, parentKey: [...(options.parentKey ?? []), `[${i}]`] })),
    ),
}

export const BIGUINT64_ARRAY_CONVERTER: TJSONConverter<BigUint64Array> = {
  key: 'js:biguint64array',
  is: (obj: any) => obj instanceof BigUint64Array,
  toTJSON: (obj: BigUint64Array, options: PreStringifyOptions) => preStringify([...obj.values()], options),
  fromTJSON: (content: any, type, options) =>
    new BigUint64Array(
      content.map((obj, i) => parse(obj, type, { ...options, parentKey: [...(options.parentKey ?? []), `[${i}]`] })),
    ),
}
