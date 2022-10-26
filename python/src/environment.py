import os
from result import Ok, Err, Result


SECRET_ = "SECRET_"


class CriticalEnvironmentError(Exception):
    pass


def get_env_var(env_var_name: str) -> Result[str, str]:
    env_var = os.environ.get(env_var_name)
    if env_var:
        return Ok(env_var)
    else:
        return Err(f"Could not read environment variable {env_var_name}")


def read_file_to_string(file_path: str) -> Result[str, str]:
    try:
        with open(str(file_path)) as f:
            data = f.read()
        return Ok(data)
    except Exception as e:
        return Err(f"Unable to read file at path: {file_path}. {e}")


def read_file_from_env_path(env_secret_name: str) -> Result[str, str]:
    file_name_result = get_env_var(env_secret_name)

    if isinstance(file_name_result, Err):
        return Err(file_name_result.err())

    if not os.path.exists(file_name_result.ok()):
        return Err(
            f"File not found for secret_env_name: {env_secret_name} leading to path {file_name_result.ok} for cwd: {os.getcwd()}"
        )

    return read_file_to_string(file_name_result.ok())
