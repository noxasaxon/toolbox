/** Wrappers and utilities around `node-fetch` library functions so they don't automatically throw.
 * Uses the `neverthrow` library to return the `Result` type.
 * https://github.com/supermacro/neverthrow#top-level-api
 */
import fetch, {
  FetchError,
  RequestInfo,
  RequestInit,
  Response,
} from 'node-fetch';
import { ResultAsync, err, ok, Err, Result } from 'neverthrow';
import { inspect } from 'util';

//! Retry logic is from: https://www.useanvil.com/blog/engineering/throttling-and-consuming-apis-with-429-rate-limits/
/**
 * @param retryHeaderString may be a number or a date
 */
export function getMillisToSleep(retryHeaderString: string) {
  let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000);
  if (isNaN(millisToSleep)) {
    const date_of_retry = new Date(retryHeaderString) as any;
    const today = new Date() as any;
    millisToSleep = Math.max(0, date_of_retry - today);
  }
  return millisToSleep;
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/** Will NOT return an `Error` type if the url fetched correctly but the status code is not 200-299.
 * This means that if this Result`.isOk()`, you still need to check the `response_result.value.ok` status code is `true`
 */
const fetchNT_unchecked_status = async (url: RequestInfo, init?: RequestInit) =>
  ResultAsync.fromPromise(fetch(url, init), (e) => e as FetchError);

/** Fetch a URL and return a `neverthrow` [ResultAsync](https://github.com/supermacro/neverthrow#asynchronous-api-resultasync).
 * The error type can be a string if `fetch` failed or a `Response` if the request was not a 200.
 * ```ts
 * const responseResult = await fetchNT('www.google.com');
 * if (responseResult.isErr()) {
 *   return err(`Failed to get url: ${responseResult.error}`);
 * }
 * const response = responseResult.value;
 * ```
 */
export const fetchNT_checked_statuscode = async (
  url: RequestInfo,
  init?: RequestInit,
) => {
  const result = await fetchNT_unchecked_status(url, init);
  if (result.isOk() && !result.value.ok) {
    return err(result.value);
  } else {
    return result;
  }
};

/** Fetch a URL and return a `neverthrow` [ResultAsync](https://github.com/supermacro/neverthrow#asynchronous-api-resultasync).
 * Auto retries if error code is 429 & the headers include `retry-after` with a delay time or date.
 * The `Error` can be a string if `fetch` failed or a `Response` if statuscode is not 200-299.
 * ```ts
 * const responseResult = await fetchNT('www.google.com');
 * if (responseResult.isErr()) {
 *   return err(`Failed to get url: ${responseResult.error}`);
 * }
 * const response = responseResult.value;
 * ```
 */
export const fetchNT_and_retry_after = async (
  url: RequestInfo,
  init?: RequestInit,
): Promise<Result<Response, any> | Err<never, Response>> => {
  const result = await fetchNT_unchecked_status(url, init);

  if (result.isOk() && !result.value.ok) {
    if (result.value.status === 429) {
      const retryAfter = result.value.headers.get('retry-after');

      if (retryAfter) {
        const millisToSleep = getMillisToSleep(retryAfter);
        await sleep(millisToSleep);
        return await fetchNT_and_retry_after(url, init);
      }
      return err(result.value);
    }
    return err(result.value);
  }

  return result;
};

/** Fetch a URL & parses Response to JSON object wrapped in a `neverthrow` [ResultAsync](https://github.com/supermacro/neverthrow#asynchronous-api-resultasync).
 *
 * Auto retries if error code is 429 & the headers include `retry-after` with a delay time or date.
 * The `Error` type can be a string if `fetch`/`.json()` parse failed, or `Error` can be `Response` if statuscode is not 200-299.
 * ```ts
 * const responseResult = await fetchNT('www.google.com');
 * if (responseResult.isErr()) {
 *   return err(`Failed to get url: ${responseResult.error}`);
 * }
 * const response = responseResult.value;
 * ```
 */
export const fetchJsonNT_and_retry_after = async (
  url: RequestInfo,
  init?: RequestInit,
) => {
  const fetch_result = await fetchNT_and_retry_after(url, init);
  if (fetch_result.isErr()) {
    return fetch_result;
  }

  try {
    const json_result = await fetch_result.value.json();
    return ok(json_result as any);
  } catch (error) {
    return err(
      `Failed to parse JSON from url '${url}' response:\n ${inspect(
        fetch_result.value,
      )} \nSyntaxError: ${error}`,
    );
  }
};
