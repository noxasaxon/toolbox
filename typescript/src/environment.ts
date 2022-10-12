import { existsSync } from 'fs';
import { Result, ok, err } from 'neverthrow';
import { readFileSyncNT } from './filesystem';

export const SECRET_PREFIX = 'SECRET_';

export enum ENVIRONMENTS {
  LOCAL = 'local',
  DEV = 'dev',
  STAGE = 'stage',
  PROD = 'prod',
}

export const build_basic_auth = (username: string, password: string) => {
  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
};

/** get env var and return a `neverthrow` Result type
 * https://docs.temporal.io/typescript/how-to-use-environment-variables-in-typescript/
 * @returns Result type
 */
export const get_env_var = (env_var_name: string): Result<string, string> => {
  const env_var = process.env[env_var_name];
  if (env_var) {
    return ok(env_var);
  } else {
    return err(`Could not read environment variable ${env_var_name}`);
  }
};

/**
 * Get file path from env var & return file contents as a string.
 * ```ts
 * const result = read_env_secret_from_file(SECRET_PREFIX + 'ENV_VAR_THAT_HOLDS_FILE_PATH');
 * if (result.isErr()) throw new Error(result.error); // or handle instead of throwing
 * const secret = result.value; // value only exists after you ensure it didnt fail
 * ```
 * @returns A Result containing the contents of the file, or an error message.
 */
export const read_file_from_env_path = (
  env_secret_name: string,
): Result<string, string> => {
  const file_name_result = get_env_var(env_secret_name);
  if (file_name_result.isErr()) return err(file_name_result.error);

  if (!existsSync(file_name_result.value))
    return err(
      `File not found for secret_env_name: ${env_secret_name} leading to path ${file_name_result.value} for cwd: ${process.cwd}`,
    );

  return readFileSyncNT(file_name_result.value, 'utf8') as Result<
    string,
    string
  >; // TYPECHECK: specifying utf8 encoding means readFileSync will not return a buffer
};

/** Read env var `ENVIRONMNENT`, raises an error if not set or not valid environment */
export function get_deployment_env(): ENVIRONMENTS {
  const environment = get_env_var(
    'ENVIRONMENT',
  )._unsafeUnwrap() as ENVIRONMENTS;

  if (Object.values(ENVIRONMENTS).includes(environment)) {
    return environment;
  } else {
    throw new Error(` 'ENVIRONMENT' env var not a valid entry: ${environment}`);
  }
}
