use anyhow::{Context, Result};
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
pub fn read_file_from_env_path(env_secret_name: &str) -> Result<String> {
    let file_name = std::env::var(env_secret_name)?;
    std::fs::read_to_string(&file_name).with_context(|| {
        format!(
            "failed to read file_path {} found at env var {}",
            file_name, env_secret_name
        )
    })
}

/// Read env var `ENVIRONMNENT`, raises an error if not set or not valid environment
pub fn get_deployment_env() -> Result<Environments> {
    let env = std::env::var("ENVIRONMENT")?;
    Environments::from_str(&env).with_context(|| {
        format!(
            "`ENVIRONMENTS` variable is not a valid environment: {}",
            env
        )
    })
}

pub fn get_env_var(env_var_name: &str) -> Result<String> {
    std::env::var(env_var_name)
        .with_context(|| format!("Could not read environment variable: `{}`", env_var_name))
}
