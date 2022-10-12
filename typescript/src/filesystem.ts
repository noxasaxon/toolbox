/** Wrappers around `fs` library functions so that they no longer throw
 * Uses the `neverthrow` library to return the `Result` type.
 * https://github.com/supermacro/neverthrow#top-level-api
 */
import { readFileSync } from 'fs';
import { Result } from 'neverthrow';

/** Neverthrow docs: https://github.com/supermacro/neverthrow#top-level-api
 * ```ts
 *  const file_result = readFileSyncNT('some_file_path.txt', 'utf8');
 *  if (file_result.isErr()) {
 *   //* handle error here or throw:
 *   throw new Error(file_result.error)
 *  } else {
 *   file_content = file_result.value // value does not exist if you don't first check to make sure its Ok
 *  }
 * ```
 */
export const readFileSyncNT = Result.fromThrowable(
  readFileSync,
  (error) => `Error reading file: ${error}`,
);
