use std::str::FromStr;

use strum::EnumString;

pub const SECRET_PREFIX: &str = "SECRET_";

#[derive(EnumString)]
pub enum Environments {
    LOCAL,
    DEV,
    STAGE,
    PROD,
}

///  Get file path from env var & return file contents as a string.
pub fn read_file_from_env_path(env_secret_name: &str) -> Result<_, _> {
    let file_name = std::env::var(env_secret_name)?;
    std::fs::read_to_string(file_name)
}

/// Read env var `ENVIRONMNENT`, raises an error if not set or not valid environment
pub fn get_deployment_env() -> Result<Environments, _> {
    let env = std::env::var("ENVIRONMENT")?;

    Environments::from_str(&env)
}
