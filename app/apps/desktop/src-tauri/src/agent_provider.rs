use std::path::Path;
use std::process::Stdio;
use std::time::Duration;

use serde::Serialize;
use tauri::command;
use tokio::process::Command;
use tokio::time::timeout;

use crate::plugin_secrets;

const CODEX_LOGIN_STATUS_CHECK: &str = "codex login status";
const CODEX_CHECK_TIMEOUT: Duration = Duration::from_secs(6);
const AI_CHAT_PLUGIN_ID: &str = "ai-chat";
const OPENAI_API_KEY_FIELD: &str = "openaiApiKey";

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum CodexReadinessStatus {
    Ready,
    CodexCliNotFound,
    LoginRequired,
    CheckTimedOut,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CodexReadiness {
    provider: &'static str,
    status: CodexReadinessStatus,
    ready: bool,
    check_name: &'static str,
    exit_code: Option<i32>,
    timed_out: bool,
    checked_at_ms: i64,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenAiApiKeyStatus {
    configured: bool,
}

#[command]
pub async fn agent_check_codex_readiness() -> CodexReadiness {
    check_codex_readiness().await
}

#[command]
pub async fn agent_get_openai_api_key_status() -> Result<OpenAiApiKeyStatus, String> {
    openai_api_key_status()
}

#[command]
pub async fn agent_set_openai_api_key(api_key: String) -> Result<OpenAiApiKeyStatus, String> {
    let trimmed = api_key.trim();
    if trimmed.is_empty() {
        delete_openai_api_key()?;
    } else {
        plugin_secrets::write_plugin_secret(AI_CHAT_PLUGIN_ID, OPENAI_API_KEY_FIELD, trimmed)
            .map_err(|error| error.to_string())?;
    }
    openai_api_key_status()
}

#[command]
pub async fn agent_clear_openai_api_key() -> Result<OpenAiApiKeyStatus, String> {
    delete_openai_api_key()?;
    openai_api_key_status()
}

async fn check_codex_readiness() -> CodexReadiness {
    if !executable_on_path("codex") {
        return readiness(CodexReadinessStatus::CodexCliNotFound, None, false);
    }

    match run_codex_login_status().await {
        CodexStatusCommand::Ready(exit_code) => {
            readiness(CodexReadinessStatus::Ready, exit_code, false)
        }
        CodexStatusCommand::LoginRequired(exit_code) => {
            readiness(CodexReadinessStatus::LoginRequired, exit_code, false)
        }
        CodexStatusCommand::TimedOut => readiness(CodexReadinessStatus::CheckTimedOut, None, true),
    }
}

async fn run_codex_login_status() -> CodexStatusCommand {
    let child = match Command::new("codex")
        .args(["login", "status"])
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true)
        .spawn()
    {
        Ok(child) => child,
        Err(_) => return CodexStatusCommand::LoginRequired(None),
    };

    match timeout(CODEX_CHECK_TIMEOUT, child.wait_with_output()).await {
        Ok(Ok(output)) => classify_codex_login_status(
            output.status.success(),
            output.status.code(),
            &output.stdout,
            &output.stderr,
        ),
        Ok(Err(_)) => CodexStatusCommand::LoginRequired(None),
        Err(_) => CodexStatusCommand::TimedOut,
    }
}

fn classify_codex_login_status(
    success: bool,
    exit_code: Option<i32>,
    stdout: &[u8],
    stderr: &[u8],
) -> CodexStatusCommand {
    if !success {
        return CodexStatusCommand::LoginRequired(exit_code);
    }
    if output_mentions_login_required(stdout) || output_mentions_login_required(stderr) {
        return CodexStatusCommand::LoginRequired(exit_code);
    }
    CodexStatusCommand::Ready(exit_code)
}

fn output_mentions_login_required(output: &[u8]) -> bool {
    let text = String::from_utf8_lossy(output).to_ascii_lowercase();
    text.contains("not logged in")
        || text.contains("not signed in")
        || text.contains("login required")
        || text.contains("logged out")
        || text.contains("not authenticated")
}

fn readiness(
    status: CodexReadinessStatus,
    exit_code: Option<i32>,
    timed_out: bool,
) -> CodexReadiness {
    let ready = status == CodexReadinessStatus::Ready;
    CodexReadiness {
        provider: "codex_cli",
        status,
        ready,
        check_name: CODEX_LOGIN_STATUS_CHECK,
        exit_code,
        timed_out,
        checked_at_ms: chrono::Utc::now().timestamp_millis(),
    }
}

#[derive(Debug, PartialEq, Eq)]
enum CodexStatusCommand {
    Ready(Option<i32>),
    LoginRequired(Option<i32>),
    TimedOut,
}

fn executable_on_path(name: &str) -> bool {
    let Some(path) = std::env::var_os("PATH") else {
        return false;
    };
    std::env::split_paths(&path).any(|dir| executable_exists(&dir.join(name)))
}

fn executable_exists(path: &Path) -> bool {
    path.is_file()
}

fn openai_api_key_status() -> Result<OpenAiApiKeyStatus, String> {
    plugin_secrets::has_plugin_secret(AI_CHAT_PLUGIN_ID, OPENAI_API_KEY_FIELD)
        .map(|configured| OpenAiApiKeyStatus { configured })
        .map_err(|error| error.to_string())
}

fn delete_openai_api_key() -> Result<(), String> {
    match plugin_secrets::delete_plugin_secret(AI_CHAT_PLUGIN_ID, OPENAI_API_KEY_FIELD) {
        Ok(()) | Err(plugin_secrets::PluginSecretError::NotFound) => Ok(()),
        Err(error) => Err(error.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn readiness_reports_missing_codex_without_exit_code() {
        let result = readiness(CodexReadinessStatus::CodexCliNotFound, None, false);

        assert!(!result.ready);
        assert_eq!(result.status, CodexReadinessStatus::CodexCliNotFound);
        assert_eq!(result.exit_code, None);
        assert!(!result.timed_out);
    }

    #[test]
    fn readiness_reports_login_required_with_exit_code() {
        let result = readiness(CodexReadinessStatus::LoginRequired, Some(1), false);

        assert!(!result.ready);
        assert_eq!(result.status, CodexReadinessStatus::LoginRequired);
        assert_eq!(result.exit_code, Some(1));
    }

    #[test]
    fn readiness_reports_timeout_without_exit_code() {
        let result = readiness(CodexReadinessStatus::CheckTimedOut, None, true);

        assert!(!result.ready);
        assert_eq!(result.status, CodexReadinessStatus::CheckTimedOut);
        assert_eq!(result.exit_code, None);
        assert!(result.timed_out);
    }

    #[test]
    fn zero_exit_logged_out_output_is_login_required() {
        let result = classify_codex_login_status(
            true,
            Some(0),
            b"Not logged in. Run codex login to continue.",
            b"",
        );

        assert_eq!(result, CodexStatusCommand::LoginRequired(Some(0)));
    }

    #[test]
    fn readiness_serialization_excludes_command_output() {
        let result = readiness(CodexReadinessStatus::LoginRequired, Some(0), false);
        let json = serde_json::to_string(&result).unwrap();

        assert!(json.contains("\"status\":\"login_required\""));
        assert!(!json.contains("Not logged in"));
        assert!(!json.contains("stdout"));
        assert!(!json.contains("stderr"));
    }

    #[test]
    fn openai_key_uses_plugin_secret_keychain_account() {
        assert_eq!(
            plugin_secrets::secret_account(AI_CHAT_PLUGIN_ID, OPENAI_API_KEY_FIELD).unwrap(),
            "ai-chat:openaiApiKey"
        );
    }
}
