toolbox

# toolbox

## Table of contents

### Enumerations

- [ENVIRONMENTS](enums/ENVIRONMENTS.md)

### Type Aliases

- [NumberParseable](README.md#numberparseable)

### Variables

- [SECRET\_PREFIX](README.md#secret_prefix)

### Functions

- [build\_basic\_auth](README.md#build_basic_auth)
- [fetchJsonNT\_and\_retry\_after](README.md#fetchjsonnt_and_retry_after)
- [fetchNT\_and\_retry\_after](README.md#fetchnt_and_retry_after)
- [fetchNT\_checked\_statuscode](README.md#fetchnt_checked_statuscode)
- [getMillisToSleep](README.md#getmillistosleep)
- [get\_deployment\_env](README.md#get_deployment_env)
- [get\_env\_var](README.md#get_env_var)
- [isNumberParseable](README.md#isnumberparseable)
- [readFileSyncNT](README.md#readfilesyncnt)
- [read\_file\_from\_env\_path](README.md#read_file_from_env_path)

## Type Aliases

### NumberParseable

Ƭ **NumberParseable**: `number` \| `string` \| `boolean` & { `isNumberParseble`: unique `symbol`  }

A Branded Type for values parseable to number.

#### Defined in

[src/index.ts:8](https://github.com/noxasaxon/toolbox/blob/a437541/typescript/src/index.ts#L8)

## Variables

### SECRET\_PREFIX

• `Const` **SECRET\_PREFIX**: ``"SECRET_"``

#### Defined in

src/environment.ts:5

## Functions

### build\_basic\_auth

▸ **build_basic_auth**(`username`, `password`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `username` | `string` |
| `password` | `string` |

#### Returns

`string`

#### Defined in

src/environment.ts:14

___

### fetchJsonNT\_and\_retry\_after

▸ **fetchJsonNT_and_retry_after**(`url`, `init?`): `Promise`<`Err`<`Response`, `any`\> \| `Ok`<`any`, `never`\>\>

Fetch a URL & parses Response to JSON object wrapped in a `neverthrow` [ResultAsync](https://github.com/supermacro/neverthrow#asynchronous-api-resultasync).

Auto retries if error code is 429 & the headers include `retry-after` with a delay time or date.
The `Error` type can be a string if `fetch`/`.json()` parse failed, or `Error` can be `Response` if statuscode is not 200-299.
```ts
const responseResult = await fetchNT('www.google.com');
if (responseResult.isErr()) {
  return err(`Failed to get url: ${responseResult.error}`);
}
const response = responseResult.value;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `RequestInfo` |
| `init?` | `RequestInit` |

#### Returns

`Promise`<`Err`<`Response`, `any`\> \| `Ok`<`any`, `never`\>\>

#### Defined in

src/http.ts:106

___

### fetchNT\_and\_retry\_after

▸ **fetchNT_and_retry_after**(`url`, `init?`): `Promise`<`Result`<`Response`, `any`\> \| `Err`<`never`, `Response`\>\>

Fetch a URL and return a `neverthrow` [ResultAsync](https://github.com/supermacro/neverthrow#asynchronous-api-resultasync).
Auto retries if error code is 429 & the headers include `retry-after` with a delay time or date.
The `Error` can be a string if `fetch` failed or a `Response` if statuscode is not 200-299.
```ts
const responseResult = await fetchNT('www.google.com');
if (responseResult.isErr()) {
  return err(`Failed to get url: ${responseResult.error}`);
}
const response = responseResult.value;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `RequestInfo` |
| `init?` | `RequestInit` |

#### Returns

`Promise`<`Result`<`Response`, `any`\> \| `Err`<`never`, `Response`\>\>

#### Defined in

src/http.ts:71

___

### fetchNT\_checked\_statuscode

▸ **fetchNT_checked_statuscode**(`url`, `init?`): `Promise`<`Err`<`never`, `Response`\> \| `Result`<`Response`, `FetchError`\>\>

Fetch a URL and return a `neverthrow` [ResultAsync](https://github.com/supermacro/neverthrow#asynchronous-api-resultasync).
The error type can be a string if `fetch` failed or a `Response` if the request was not a 200.
```ts
const responseResult = await fetchNT('www.google.com');
if (responseResult.isErr()) {
  return err(`Failed to get url: ${responseResult.error}`);
}
const response = responseResult.value;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `RequestInfo` |
| `init?` | `RequestInit` |

#### Returns

`Promise`<`Err`<`never`, `Response`\> \| `Result`<`Response`, `FetchError`\>\>

#### Defined in

src/http.ts:48

___

### getMillisToSleep

▸ **getMillisToSleep**(`retryHeaderString`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `retryHeaderString` | `string` | may be a number or a date |

#### Returns

`number`

#### Defined in

src/http.ts:18

___

### get\_deployment\_env

▸ **get_deployment_env**(): [`ENVIRONMENTS`](enums/ENVIRONMENTS.md)

Read env var `ENVIRONMNENT`, raises an error if not set or not valid environment

#### Returns

[`ENVIRONMENTS`](enums/ENVIRONMENTS.md)

#### Defined in

src/environment.ts:58

___

### get\_env\_var

▸ **get_env_var**(`env_var_name`): `Result`<`string`, `string`\>

get env var and return a `neverthrow` Result type
https://docs.temporal.io/typescript/how-to-use-environment-variables-in-typescript/

#### Parameters

| Name | Type |
| :------ | :------ |
| `env_var_name` | `string` |

#### Returns

`Result`<`string`, `string`\>

Result type

#### Defined in

src/environment.ts:22

___

### isNumberParseable

▸ **isNumberParseable**(`value`): value is NumberParseable

Check if value is parseable to number.

**`Example`**

```js
isNumberParseable('AAAA');
//=> false

isNumberParseable('100');
//=> true

if (!isNumberParseable(value))
  throw new Error('Value can\'t be parseable to `Number`.')
return Number(value);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `unknown` | An `unknown` value to be checked. |

#### Returns

value is NumberParseable

#### Defined in

[src/index.ts:28](https://github.com/noxasaxon/toolbox/blob/a437541/typescript/src/index.ts#L28)

___

### readFileSyncNT

▸ **readFileSyncNT**(...`args`): `Result`<`string` \| `Buffer`, `string`\>

Neverthrow docs: https://github.com/supermacro/neverthrow#top-level-api
```ts
 const file_result = readFileSyncNT('some_file_path.txt', 'utf8');
 if (file_result.isErr()) {
  //* handle error here or throw:
  throw new Error(file_result.error)
 } else {
  file_content = file_result.value // value does not exist if you don't first check to make sure its Ok
 }
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [path: PathOrFileDescriptor, options?: null \| BufferEncoding \| ObjectEncodingOptions & Object] |

#### Returns

`Result`<`string` \| `Buffer`, `string`\>

#### Defined in

node_modules/neverthrow/dist/index.d.ts:54

___

### read\_file\_from\_env\_path

▸ **read_file_from_env_path**(`env_secret_name`): `Result`<`string`, `string`\>

Get file path from env var & return file contents as a string.
```ts
const result = read_env_secret_from_file(SECRET_PREFIX + 'ENV_VAR_THAT_HOLDS_FILE_PATH');
if (result.isErr()) throw new Error(result.error); // or handle instead of throwing
const secret = result.value; // value only exists after you ensure it didnt fail
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `env_secret_name` | `string` |

#### Returns

`Result`<`string`, `string`\>

A Result containing the contents of the file, or an error message.

#### Defined in

src/environment.ts:40
