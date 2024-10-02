import { TJSONConverter } from './converter'

class WrappedObject {
  constructor(public value: any) {}
  toJSON() {}
}
export type PreStringifyOptions = {
  converters: Array<TJSONConverter<unknown>>
  parentKey?: Array<string>
  meta?: object
}

/**
 * !does not stringify the object it wrap known types to use the normal JSON.stringify to build up the metadata.
 * @param obj - The object to be stringified.
 * @param options - Additional options for stringification.
 * @returns The stringified object with type metadata.
 */
export const preStringify = (obj: any, options: PreStringifyOptions): any => {
  const { converters, parentKey = [], meta = {} } = options
  options.parentKey = parentKey
  options.meta = meta

  const objectType = typeof obj
  const converter = converters.find((t) => t.is(obj))
  //null is a object
  if ((objectType === 'object' && obj !== null) || converter) {
    if (Array.isArray(obj)) {
      // Handle arrays
      return obj.map((item, index) =>
        preStringify(item, {
          ...options,
          parentKey: [...parentKey, `[${index}]`],
        }),
      )
    } else {
      if (!!converter) {
        const currentObj = new WrappedObject(obj)
        //here the magic happends
        currentObj.toJSON = () => {
          const value = converter.toTJSON(currentObj.value, options)
          meta[[...parentKey].join('.')] = converter.key
          return value
        }
        return currentObj
      } else if (typeof obj?.toJSON === 'function') {
        return obj
      } else {
        // Handle objects
        const newObj = {}
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const rawValue = obj[key]
            const value = preStringify(rawValue, {
              ...options,
              parentKey: [...parentKey, key],
            })
            newObj[key] = value
          }
        }
        return newObj
      }
    }
  } else {
    if (obj === null) {
      return undefined
    }
    return obj
  }
}
