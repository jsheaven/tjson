import { parse } from './parse'
import { preStringify } from './pre-stringify'
import {
  BIGINT_CONVERTER,
  DATE_CONVERTER,
  MAP_CONVERTER,
  NULL_CONVERTER,
  REGEX_CONVERTER,
  SET_CONVERTER,
  UNDEFINED_CONVERTER,
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
  type TJSONConverter,
  SYMBOL_CONVERTER,
  TJSONMapper,
  NAN_CONVERTER,
  INFINITY_CONVERTER,
} from './converter'

/**
 * TJSON class provides methods for serializing and deserializing complex JavaScript objects, including non-standard types like Date, Set, Map, BigInt, and more.
 */
export class TJSON {
  private converterMap: Map<string, TJSONConverter<unknown>> = new Map()

  constructor() {
    // Initialize with built-in converters for common types
    ;[
      NAN_CONVERTER,
      INFINITY_CONVERTER,
      DATE_CONVERTER,
      SET_CONVERTER,
      MAP_CONVERTER,
      BIGINT_CONVERTER,
      REGEX_CONVERTER,
      SYMBOL_CONVERTER,
    ].forEach((tr) => this.converterMap.set(tr.key, tr))
  }

  /**
   * Serializes a JavaScript object, including non-standard types, into a TJSON string.
   * @param value - The object to be serialized.
   * @returns TJSON string with type metadata.
   */
  stringify(value: any): string {
    const meta = {}
    const newObj = preStringify(value, {
      converters: [...this.converterMap.values()],
      meta,
    })
    //have to stringify the content to get all types
    //prevent that content is undefined
    const tsjsonStr = JSON.stringify({ content: newObj })
    if (tsjsonStr === '{}') {
      return tsjsonStr
    }
    return tsjsonStr.substring(0, tsjsonStr.length - 1) + `,"type":${JSON.stringify(meta)}}`
  }

  /**
   * Deserializes a TJSON string back into a JavaScript object, using metadata to restore non-standard types.
   * @param value - The TJSON string to be parsed.
   * @returns The deserialized JavaScript object.
   */
  parse<T = any>(value: string): T {
    const rawJson = JSON.parse(value)
    const jsonContent = rawJson?.content
    const jsonType = rawJson?.type
    return parse(jsonContent, jsonType, { types: [...this.converterMap.values()] })
  }

  /**
   * Registers a custom converter to handle a specific data type.
   * @param converter - The converter to be registered.
   * @returns The TJSON instance for chaining.
   */
  register(converter: TJSONConverter<any> | TJSONMapper<any>): TJSON {
    this.converterMap.set(converter.key, converter)
    return this
  }

  /**
   * Register standard coverter undefined.
   * @returns The TJSON instance for chaining
   */
  registerUndefined(): TJSON {
    this.register(UNDEFINED_CONVERTER)
    return this
  }
  /**
   * Register standard coverter null.
   * @returns The TJSON instance for chaining
   */

  registerNull(): TJSON {
    this.register(NULL_CONVERTER)
    return this
  }
  /**
   * Register standard coverter for typed arrays.
   * Supported Typed Arrays:
   * - Int8Array
   * - Uint8Array
   * - Uint8ClampedArray
   * - Int16Array
   * - Uint16Array
   * - Int32Array
   * - Uint32Array
   * - Float32Array
   * - Float64Array
   * - BigInt64Array
   * - BigUint64Array
   * @returns The TJSON instance for chaining
   */
  registerTypedArrays(): TJSON {
    this.register(INT8_ARRAY_CONVERTER)
    this.register(UINT8_ARRAY_CONVERTER)
    this.register(UINT8_CLAMPED_ARRAY_CONVERTER)
    this.register(INT16_ARRAY_CONVERTER)
    this.register(UINT16_ARRAY_CONVERTER)
    this.register(INT32_ARRAY_CONVERTER)
    this.register(UINT32_ARRAY_CONVERTER)
    this.register(FLOAT32_ARRAY_CONVERTER)
    this.register(FLOAT64_ARRAY_CONVERTER)
    this.register(BIGINT64_ARRAY_CONVERTER)
    this.register(BIGUINT64_ARRAY_CONVERTER)
    return this
  }
}

export default new TJSON()
