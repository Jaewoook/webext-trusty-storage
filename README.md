# webext-trusty-storage

This library helps you to manage storage used by web extensions. It provides Promise based asynchronous storage actions update, delete. You don't have to call storage API inside of storage action's callback.

## Prerequisite

This library works on browser extension environment. Before using it, you must check your `manifest.json` file to specify **storage** permission.

```js
{
    "name": "Sample Extension",
    "version": "1.0",
    "permission": ["storage"],
    //  more
}
```

## Installation

**using npm:**

```sh
npm i --save webext-trusty-storage
```

**using yarn:**

```sh
yarn add webext-trusty-storage
```

## Simple usage

```ts
//  import library
import { Storage } from "webext-trusty-storage";

type MyStorageType = {
    name: string;
    value: string;
    detail: {
        createdAt: string;
    };
};

const DEFAULT_VALUE: MyStorageType = {
    name: "Hello",
    value: "World!",
    detail: {
        createdAt: "2020-08-10",
    },
};

//  initialize instance
const storage = new Storage<MyStorageType>(DEFAULT_VALUE);

//  event for ready to use
storage.on("ready", () => {
    console.log("StorageManager is ready.");
});
```

## APIs

By default, all of APIs returns Promise.

### constructor

```ts
new Storage<STORAGE_TYPE>(DEFAULT_VALUE: STORAGE_TYPE)
```

Create new instance of Storage. It receive default storage value and type. (for TypeScript) If storage value does not exist in browser, then it stores default value in storage.

### loadStorage

```ts
loadStorage() => Promise
```

### updateStorage

```ts
updateStorage(newSettings: STORAGE_TYPE) => Proise
```

### get

```ts
get(key: keyof T) => any;
```

## Event

You can also add event listener

### ready

This event emitted when StorageManager is ready to use after create new instance. When creating new instance, it checks storage previous value exists. if this task failed, passed default storage settings automatically set to storage.

## Author

- [Jaewook Ahn](https://github.com/Jaewoook)

## License

MIT License