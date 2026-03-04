# Hooks 配置与使用

🔵 官方文档 | 🟢 社区经验

## [官方文档] Hooks 系统核心机制

> 来源：https://docs.anthropic.com/en/docs/claude-code/hooks | 2025年 | 可信度：🔵官方
> 对应模块：hooks.md

**核心要点：**
- Hooks 在 `settings.json` 中配置，支持四个生命周期事件：`PreToolUse`、`PostToolUse`、`Notification`、`Stop`
- Hook 脚本通过 stdin 接收 JSON 上下文，通过 stdout 输出控制指令（`continue`/`block`/`error`）
- 支持 `matcher` 字段用正则匹配特定工具名（如只在 `Write` 工具后触发格式化）
- 配置路径：`~/.claude/settings.json`（全局）或 `.claude/settings.json`（项目级）

**原文摘录/翻译：**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write $CLAUDE_TOOL_INPUT_PATH 2>/dev/null; exit 0"
          }
        ]
      }
    ]
  }
}
```

Hook 脚本接收的 stdin JSON 结构示例：
```json
{
  "tool_name": "Write",
  "tool_input": {
    "path": "/src/components/Button.tsx",
    "content": "..."
  },
  "tool_response": {
    "success": true
  }
}
```

**评估：** 高价值，这是所有 hooks 实践的基础结构，必须理解才能正确配置。

---

## [官方文档] PostToolUse Hook 实战：Prettier 自动格式化

> 来源：https://docs.anthropic.com/en/docs/claude-code/hooks#example-auto-format | 2025年 | 可信度：🔵官方
> 对应模块：hooks.md

**核心要点：**
- 在 Claude 写完文件后立即触发 Prettier，避免 Claude 写出不符合风格的代码
- 使用 `matcher` 限定只在文件写入操作后触发，节省性能
- `exit 0` 确保格式化失败不阻断 Claude 的工作流

**原文摘录/翻译：**

完整可用配置（`.claude/settings.json`）：
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_TOOL_INPUT_PATH\" 2>/dev/null; exit 0"
          }
        ]
      }
    ]
  }
}
```

对应的 shell 脚本版本（更灵活，放在 `.claude/hooks/format.sh`）：
```bash
#!/bin/bash
# 读取 Claude 传入的 JSON 上下文
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# 只格式化 JS/TS/CSS/JSON 文件
case "$FILE_PATH" in
  *.js|*.jsx|*.ts|*.tsx|*.css|*.json|*.md)
    npx prettier --write "$FILE_PATH" 2>/dev/null
    ;;
esac

exit 0
```

**评估：** 高价值，可直接复用，且展示了"脚本版"比"内联命令"更灵活的最佳实践。

---

## [社区经验] PreToolUse Hook 实战：TypeScript 类型检查拦截

> 来源：Reddit r/ClaudeAI | 2025年 | 可信度：🟢社区
> 对应模块：hooks.md

**核心要点：**
- 在 Claude 执行 `Bash` 命令（如 `git commit`）前运行 `tsc --noEmit` 检查
- 若类型错误存在，通过输出 `{"decision": "block", "reason": "..."}` 阻止提交并反馈错误
- 有效减少 Claude 提交类型不正确代码的情况

**原文摘录/翻译：**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/typecheck-guard.sh"
          }
        ]
      }
    ]
  }
}
```

`.claude/hooks/typecheck-guard.sh`：
```bash
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# 只在 git commit 时做类型检查
if echo "$COMMAND" | grep -q "git commit"; then
  ERRORS=$(npx tsc --noEmit 2>&1)
  if [ $? -ne 0 ]; then
    echo "{\"decision\": \"block\", \"reason\": \"TypeScript errors found:\\n$ERRORS\"}"
    exit 0
  fi
fi

echo "{\"decision\": \"continue\"}"
exit 0
```

**评估：** 高价值，展示了 `block` 决策的实际用法，是类型安全工作流的关键模式。

---

## [社区经验] PostToolUse Hook 实战：ESLint 自动修复 + 错误反馈

> 来源：dev.to | 2025年 | 可信度：🟢社区
> 对应模块：hooks.md

**核心要点：**
- ESLint `--fix` 在 Claude 写文件后自动修复可修复问题
- 无法自动修复的错误通过 hook 输出反馈给 Claude，让它继续修复
- 结合 Prettier，实现"写完即干净"的工作流

**原文摘录/翻译：**

`.claude/hooks/eslint-fix.sh`：
```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.path // empty')

if [ -z "$FILE_PATH" ]; then
  echo "{\"decision\": \"continue\"}"
  exit 0
fi

case "$FILE_PATH" in
  *.js|*.jsx|*.ts|*.tsx)
    # 先尝试自动修复
    npx eslint --fix "$FILE_PATH" 2>/dev/null

    # 检查是否还有错误
    REMAINING=$(npx eslint "$FILE_PATH" --format=compact 2>&1)
    if [ $? -ne 0 ] && [ -n "$REMAINING" ]; then
      # 输出错误让 Claude 看到并修复
      echo "{\"decision\": \"continue\", \"message\": \"ESLint errors remain after auto-fix: $REMAINING\"}"
      exit 0
    fi
    ;;
esac

echo "{\"decision\": \"continue\"}"
exit 0
```

对应 `settings.json` 配置：
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/eslint-fix.sh"
          }
        ]
      }
    ]
  }
}
```

**评估：** 高价值，展示了"修复后反馈"模式，是 linting hooks 的完整闭环实现。

---

## [社区经验] Stop Hook 实战：自动 git commit

> 来源：Reddit r/ClaudeAI | 2025年 | 可信度：🟢社区
> 对应模块：hooks.md

**核心要点：**
- 在 Claude 完成任务后（`Stop` 事件）自动暂存并提交变更
- 使用 `git diff --name-only` 检查是否有变更，避免空提交
- 自动生成提交信息包含时间戳（通过 `$CLAUDE_RESPONSE` 环境变量可进一步定制）
- **社区警告：** 需谨慎，建议仅在功能分支上启用

**原文摘录/翻译：**

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/auto-commit.sh"
          }
        ]
      }
    ]
  }
}
```

`.claude/hooks/auto-commit.sh`：
```bash
#!/bin/bash
# 检查是否在 git 仓库内
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  exit 0
fi

# 检查是否有变更
CHANGED=$(git diff --name-only HEAD 2>/dev/null)
STAGED=$(git diff --name-only --cached 2>/dev/null)

if [ -z "$CHANGED" ] && [ -z "$STAGED" ]; then
  exit 0
fi

# 暂存所有变更（可改为更精细的逻辑）
git add -A

# 生成提交信息
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
git commit -m "auto: Claude changes at $TIMESTAMP [skip ci]" 2>/dev/null

exit 0
```

**评估：** 中价值，实用但需配合分支策略使用，适合快速原型阶段，生产环境需额外审查逻辑。

---

## [官方文档] Notification Hook：桌面通知与任务完成提醒

> 来源：https://docs.anthropic.com/en/docs/claude-code/hooks#notification | 2025年 | 可信度：🔵官方
> 对应模块：hooks.md

**核心要点：**
- `Notification` 事件在 Claude 需要用户输入时触发，可用于发送桌面通知
- 支持 macOS (`osascript`)、Linux (`notify-send`)、Windows (`PowerShell`)
- 可扩展为发送 Slack 消息、邮件等

**原文摘录/翻译：**

macOS 桌面通知配置：
```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude needs your input\" with title \"Claude Code\" sound name \"Glass\"'"
          }
        ]
      }
    ]
  }
}
```

跨平台通知脚本 `.claude/hooks/notify.sh`：
```bash
#!/bin/bash
INPUT=$(cat)
MESSAGE=$(echo "$INPUT" | jq -r '.message // "Claude needs attention"')

case "$(uname -s)" in
  Darwin)
    osascript -e "display notification \"$MESSAGE\" with title \"Claude Code\""
    ;;
  Linux)
    notify-send "Claude Code" "$MESSAGE" 2>/dev/null
    ;;
  MINGW*|CYGWIN*|MSYS*)
    powershell.exe -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('$MESSAGE', 'Claude Code')" 2>/dev/null
    ;;
esac

exit 0
```

**评估：** 中价值，长任务场景非常实用，避免守在屏幕前等待，提升开发体验。
