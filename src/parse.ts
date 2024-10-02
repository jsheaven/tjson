import { TJSONConverter } from './converter'

export type ParseOptions = {
  types: Array<TJSONConverter<any>>
  parentKey?: Array<string>
}

/**
 * Parses a TJSON string back into a JavaScript object, restoring types based on metadata.
 * @param content - The JSON content to parse.
 * @param type - Type metadata for restoring non-standard types.
 * @param options - Additional options for parsing.
 * @returns The parsed JavaScript object.
 */
export const parse = (content: any, type: any, options: ParseOptions): any => {
  const { types, parentKey = [] } = options
  options.parentKey = parentKey
  const key = parentKey.join('.')
  const value = type?.[key]

  if (typeof value !== 'undefined') {
    const found = types.find((transformer) => transformer.key === value)
    if (found) {
      return found.fromTJSON(content, type, options)
    }
  }

  const contentType = typeof content

  if (contentType === 'undefined') {
    return undefined
  }

  if (contentType === 'object') {
    if (Array.isArray(content)) {
      return content.map((item, index) => parse(item, type, { ...options, parentKey: [...parentKey, `[${index}]`] }))
    } else {
      // Handle objects
      const newObj = {}
      for (const key in content) {
        if (Object.prototype.hasOwnProperty.call(content, key)) {
          const value = parse(content[key], type, {
            ...options,
            parentKey: [...parentKey, key],
          })
          newObj[key] = value
        }
      }
      return newObj
    }
  } else {
    //is primitive

    return content
  }
}
