# @jsheaven/tjson
**TJSON** is a TypeScript library that extends JSON serialization and deserialization by providing support for additional JavaScript data types such as `Date`, `Set`, `Map`, `BigInt`, `RegExp`, and more. This ensures seamless handling of complex data structures that are not natively supported by the standard JSON methods.

## User Stories

- **As a developer**, I want to use **TJSON** to serialize and deserialize complex JavaScript objects, such as `Date`, `Set`, and `Map`, so that I can maintain data fidelity when working with APIs or saving data.
- **As a developer**, I don't want to manually handle custom serialization for these non-standard JSON types, so that I can focus on other logic and improve productivity.

## Key Features

- **Extended JSON Handling**: Supports serialization and deserialization of `Date`, `Set`, `Map`, `BigInt`, `RegExp`, `null`, `undefined`, `Symbol`, ` and more.
- **Custom converters**: Easily register custom converter to extend support for additional types.
- **Compact Output**: Generates compact JSON strings with metadata for types.
- **First-class TypeScript support**: Full TypeScript support for safer and cleaner code.
- **Lightweight**: Small package size with no external dependencies.
- ✅ Available as a simple API
- ✅ Just `1205 byte` nano sized (ESM, gizpped)
- ✅ Tree-shakable and side-effect free
- ✅ Runs on Windows, Mac, Linux, CI tested
- ✅ First class TypeScript support
- ✅ 100% Unit Test coverage

## Installation

You can install **TJSON** via npm or yarn:

### npm
```bash
npm install @jsheaven/tjson
```

### yarn
```bash
yarn add @jsheaven/tjson
```

## Usage

TJSON provides a simple API for converting complex data structures into JSON strings and parsing them back to JavaScript objects.

### Example Usage

#### Stringifying and Parsing Objects

```ts
import TJSON from '@jsheaven/tjson'

// Example object with Date, Set, and Map
const obj = {
  date: new Date(),
  set: new Set([1, 2, 3]),
  map: new Map([['key1', 'value1'], ['key2', 'value2']]),
}

// Stringify the object
const jsonString = TJSON.stringify(obj)
console.log(jsonString)

// Parse it back to an object
const parsedObj = TJSON.parse(jsonString)
console.log(parsedObj)
```

### Registering Custom Converter

You can extend TJSON by registering custom Converter for types that are not supported out of the box.

```ts
import TJSON from '@jsheaven/tjson'

const customConverter = {
  key: 'js:customType',
  is: (obj) => obj instanceof CustomType,
  toTJSON: (obj) => { /* serialization logic */ },
  fromTJSON: (json) => { /* deserialization logic */ },
}

TJSON.register(customConverter)

const obj = new CustomType()

const jsonString = TJSON.stringify(obj)
const parsedObj = TJSON.parse(jsonString)
```

Certainly! Here's the updated documentation with a note indicating that only global symbols are supported in **TJSON**:

---

## TJSON Documentation for Supported Types

### Supported Types Overview

**TJSON** provides built-in support for several types, including non-standard JavaScript types such as `Date`, `RegExp`, `Set`, `Map`, `BigInt`, `null`, `undefined` and **Typed Arrays**. Additionally, **TJSON** supports global symbols but **does not support local symbols**. This means only global symbols created with `Symbol.for()` are supported.
### Undefined, Null
activate undefined and null by calling the fn

```ts
import TJSON from '@jsheaven/tjson'

TSJSON.registerUndefined()
      .registerNull()
```
### Global Symbols

- **Supported**: Global symbols created using `Symbol.for()`.
- **Not Supported**: Symbols created using `Symbol()` (local symbols).
  
TJSON handles global symbols by serializing them into their unique key representations, ensuring that symbols shared across different parts of the application can be properly serialized and deserialized. **Locale symbols are converted to globals** 

#### Example

```ts
import TJSON from '@jsheaven/tjson'

const globalSymbol = Symbol.for('myGlobalSymbol')
const obj = { sym: globalSymbol }

// Serialize
const jsonString = TJSON.stringify(obj)
console.log(jsonString) // Output: {"content":{"sym":"myGlobalSymbol"},"type":{"sym":"js:symbol"}}

// Deserialize
const parsedObj = TJSON.parse(jsonString)
console.log(parsedObj.sym === Symbol.for('myGlobalSymbol')) // Output: true
```

> **Note:** Local symbols (those created using `Symbol()`) are not supported by **TJSON** because they are inherently unique and not shareable across different realms or contexts, making serialization impractical.

---

### Typed Arrays

The `registerTypedArrays()` method in **TJSON** allows for the serialization and deserialization of several **Typed Arrays**, which are essential for handling binary data in JavaScript.

#### List of Supported Typed Arrays:

- **Int8Array**
- **Uint8Array**
- **Uint8ClampedArray**
- **Int16Array**
- **Uint16Array**
- **Int32Array**
- **Uint32Array**
- **Float32Array**
- **Float64Array**
- **BigInt64Array**
- **BigUint64Array**

#### How to Use `registerTypedArrays()`

After calling the `registerTypedArrays()` method, all listed typed arrays can be serialized and deserialized as part of an object or structure.

#### Example Usage

```ts
import TJSON from '@jsheaven/tjson'

// Register Typed Arrays
TJSON.registerTypedArrays()

// Object containing typed arrays
const obj = {
  int8Array: new Int8Array([1, 2, 3]),
  float32Array: new Float32Array([1.1, 2.2, 3.3]),
}

// Stringify the object
const jsonString = TJSON.stringify(obj)
console.log(jsonString)

// Parse it back to an object
const parsedObj = TJSON.parse(jsonString)
console.log(parsedObj)
```

---

This should provide a clear indication that only global symbols are supported in **TJSON**, along with documentation on the usage of Typed Arrays and other supported types.
  
## Contributing

We welcome contributions! If you have ideas for new features, find bugs, or want to improve documentation, feel free to open an issue or submit a pull request.

### Steps to Contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add your feature'`)
6. Push to the branch (`git push origin feature/your-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.