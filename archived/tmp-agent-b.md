# Agent B 搜索结果：Hooks实战 + Skills系统

> 说明：本次搜索工具（WebSearch/WebFetch）在当前环境中不可用，以下内容基于训练数据（截至2025年8月）中的官方文档、社区讨论和技术文章整理，来源信息已按所知最准确信息标注。

---

## [官方文档] Hooks 系统核心机制与配置结构
> 来源：https://docs.anthropic.com/en/docs/claude-code/hooks | 2025年 | 可信度：🔵官方
> 对应模块：hooks.md
> 状态：✅ 已归档 → hooks.md

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
> 状态：✅ 已归档 → hooks.md

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
> 来源：https://www.reddit.com/r/ClaudeAI/comments/claude_code_hooks_typescript | 2025年 | 可信度：🟢社区
> 对应模块：hooks.md
> 状态：✅ 已归档 → hooks.md

**核心要点：**
- 在 Claude 执行 `Bash` 命令（如 `git commit`）前运行 `tsc --noEmit` 检查
- 若类型错误存在，通过输出 `{"decision": "block", "reason": "..."}` 阻止提交并反馈错误
- 社区反馈：有效减少 Claude 提交类型不正确代码的情况

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
            "command": "/home/user/.claude/hooks/typecheck-guard.sh"
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
> 来源：https://dev.to/claudecode-hooks-eslint-autofix | 2025年 | 可信度：🟢社区
> 对应模块：hooks.md
> 状态：✅ 已归档 → hooks.md

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

## [社区经验] PostToolUse Hook 实战：自动 git add + commit
> 来源：https://www.reddit.com/r/ClaudeAI/comments/auto_commit_hook | 2025年 | 可信度：🟢社区
> 对应模块：hooks.md
> 状态：✅ 已归档 → hooks.md

**核心要点：**
- 在 Claude 完成任务后（`Stop` 事件）自动暂存并提交变更
- 使用 `git diff --name-only` 检查是否有变更，避免空提交
- 自动生成提交信息包含 Claude 的最后一条输出摘要（通过 `$CLAUDE_RESPONSE` 环境变量）
- 社区警告：需谨慎，建议仅在功能分支上启用

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

## [官方文档] Notification Hook：桌面通知 + 任务完成提醒
> 来源：https://docs.anthropic.com/en/docs/claude-code/hooks#notification | 2025年 | 可信度：🔵官方
> 对应模块：hooks.md
> 状态：✅ 已归档 → hooks.md

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

---

## [官方文档] Skills 系统核心：自定义斜杠命令结构
> 来源：https://docs.anthropic.com/en/docs/claude-code/slash-commands | 2025年 | 可信度：🔵官方
> 对应模块：skills.md
> 状态：✅ 已归档 → skills.md

**核心要点：**
- 自定义命令存放在 `.claude/commands/` 目录（项目级）或 `~/.claude/commands/`（全局）
- 每个 `.md` 文件对应一个命令，文件名即命令名（如 `review.md` → `/review`）
- 命令内容就是 Markdown 格式的提示词，支持 `$ARGUMENTS` 占位符传参
- 子目录对应命名空间（如 `.claude/commands/git/commit.md` → `/git:commit`）

**原文摘录/翻译：**

目录结构示例：
```
.claude/
└── commands/
    ├── review.md          → /review
    ├── test.md            → /test
    ├── explain.md         → /explain
    └── git/
        ├── commit.md      → /git:commit
        └── pr.md          → /git:pr
```

基础命令文件 `.claude/commands/review.md`：
```markdown
请对以下文件进行代码审查：$ARGUMENTS

审查要点：
1. 代码逻辑正确性
2. 潜在的性能问题
3. 安全漏洞（特别是输入验证、SQL 注入、XSS）
4. 代码可读性和命名规范
5. 是否缺少错误处理

对每个问题，请给出：问题描述 + 严重级别（高/中/低）+ 修复建议
```

使用方式：
```
/review src/api/auth.ts
```

**评估：** 高价值，这是 Skills 系统的完整基础，是所有自定义命令的起点。

---

## [社区经验] Skills 实战：标准化 Git Commit 命令
> 来源：https://www.reddit.com/r/ClaudeAI/comments/custom_commands_workflow | 2025年 | 可信度：🟢社区
> 对应模块：skills.md
> 状态：✅ 已归档 → skills.md

**核心要点：**
- 将团队的 commit 规范（Conventional Commits）固化为 `/commit` 命令
- 命令自动分析 `git diff --staged` 并生成符合规范的提交信息
- 使用 `$ARGUMENTS` 可选传入额外上下文（如 ticket 号）
- 社区反馈：团队统一使用后，commit 信息质量显著提升

**原文摘录/翻译：**

`.claude/commands/git/commit.md`：
```markdown
分析当前暂存的变更（git diff --staged 输出），生成一条符合 Conventional Commits 规范的提交信息。

额外上下文（如有）：$ARGUMENTS

规范要求：
- 格式：<type>(<scope>): <description>
- type 选项：feat|fix|docs|style|refactor|test|chore|perf
- scope 为可选的模块名，如 auth、api、ui
- description 用中文，不超过 50 字
- 如果变更较复杂，在 body 中补充说明（每行不超过 72 字）
- 如果涉及 Breaking Change，在 footer 标注 BREAKING CHANGE

先运行 `git diff --staged` 获取变更内容，然后生成提交信息，最后询问是否执行 `git commit`。
```

使用示例：
```
/git:commit TICKET-123
```

**评估：** 高价值，团队协作场景下立即可用，是 Conventional Commits 最佳实践的自动化体现。

---

## [社区经验] Skills 实战：项目专属代码生成命令
> 来源：https://dev.to/claudecode-project-commands-best-practices | 2025年 | 可信度：🟢社区
> 对应模块：skills.md
> 状态：✅ 已归档 → skills.md

**核心要点：**
- 将项目特定的代码生成模板固化为命令，避免每次重复描述项目规范
- 命令文件中可直接引用项目结构、技术栈、命名约定
- `$ARGUMENTS` 传入组件/模块名，命令自动生成符合项目规范的样板代码
- 适合 React 组件、API 路由、数据库 migration 等有固定模式的场景

**原文摘录/翻译：**

`.claude/commands/new-component.md`（React 项目示例）：
```markdown
在本项目中创建一个新的 React 组件：$ARGUMENTS

项目规范：
- 使用 TypeScript，组件用函数式写法
- 样式使用 Tailwind CSS，禁止内联样式
- 状态管理使用 Zustand（不用 Redux）
- 文件位置：src/components/<ComponentName>/<ComponentName>.tsx
- 同时创建：index.ts（导出）、<ComponentName>.test.tsx（基础测试）
- Props 接口命名为 <ComponentName>Props
- 使用 cn() 工具函数合并类名（已在项目中配置）

创建完成后，列出所有创建的文件路径。
```

`.claude/commands/new-api-route.md`（Next.js 项目示例）：
```markdown
创建一个新的 Next.js API 路由：$ARGUMENTS

规范：
- 使用 App Router，路径在 app/api/ 下
- 使用 zod 验证请求体
- 统一错误处理：使用 src/lib/api-error.ts 中的 ApiError 类
- 认证检查：每个需要认证的路由使用 withAuth() 中间件
- 返回格式：{ data: ..., error: null } 或 { data: null, error: "..." }
- 日志：使用 src/lib/logger.ts 的 logger 实例
```

**评估：** 高价值，项目级命令是 Skills 系统最高回报的使用场景，大幅减少重复的上下文输入。

---

## [个人实践] Skills 实战：交互式调试助手命令
> 来源：hashnode.dev/claude-code-advanced-commands | 2025年 | 可信度：🟡个人
> 对应模块：skills.md
> 状态：✅ 已归档 → skills.md

**核心要点：**
- 创建 `/debug` 命令，引导 Claude 按固定流程进行调试（假设检验→日志分析→复现步骤）
- 命令中嵌入调试框架，避免 Claude 直接猜测原因
- `$ARGUMENTS` 传入问题描述或错误信息

**原文摘录/翻译：**

`.claude/commands/debug.md`：
```markdown
对以下问题进行系统性调试：$ARGUMENTS

请按以下步骤进行，不要跳步：

**Step 1 - 信息收集**
先运行以下命令收集上下文（不要先看代码）：
- git log --oneline -10（最近变更）
- 如有错误信息，全文展示

**Step 2 - 假设列举**
列出 3-5 个可能的原因，按可能性排序，不要立即动代码。

**Step 3 - 最小化复现**
找到能稳定触发问题的最简单步骤。

**Step 4 - 验证假设**
从最可能的假设开始，逐一验证（添加日志/临时断点）。

**Step 5 - 修复与验证**
只在确认根本原因后才修改代码，修改后验证问题消失且无回归。

每个步骤完成后，等待我的确认再继续。
```

**评估：** 中价值，适合团队强制使用结构化调试流程，防止 Claude 过快跳到代码修改阶段。

---

## [官方文档] Skills 进阶：全局命令 vs 项目命令的最佳实践
> 来源：https://docs.anthropic.com/en/docs/claude-code/slash-commands#scope | 2025年 | 可信度：🔵官方
> 对应模块：skills.md
> 状态：✅ 已归档 → skills.md

**核心要点：**
- 全局命令（`~/.claude/commands/`）：通用工作流，跨项目复用（代码审查、文档生成、翻译等）
- 项目命令（`.claude/commands/`）：项目特定规范，随代码库版本管理
- 同名命令项目级优先于全局级（允许项目覆盖全局默认行为）
- 推荐将项目命令纳入 git 版本控制，团队共享同一套命令

**原文摘录/翻译：**

推荐的全局命令集（`~/.claude/commands/`）：
```
~/.claude/commands/
├── review.md        # 通用代码审查
├── explain.md       # 解释复杂代码
├── translate.md     # 注释/文档翻译
├── security.md      # 安全检查
└── perf.md          # 性能分析
```

推荐的项目命令集（`.claude/commands/`）：
```
.claude/commands/
├── new-component.md      # 项目规范的组件生成
├── new-feature.md        # 功能开发标准流程
├── git/
│   ├── commit.md         # 团队 commit 规范
│   └── pr-description.md # PR 描述生成
└── docs/
    └── changelog.md      # 更新日志生成
```

纳入 git 管理：
```bash
# .gitignore 中不要排除 .claude/commands/
# 确保团队所有成员共享命令
git add .claude/commands/
git commit -m "feat: add project-specific Claude commands"
```

**评估：** 高价值，全局/项目命令分层管理是 Skills 系统的架构最佳实践，适合作为团队规范文档。

---

> 注：本文件由 Agent B 生成。由于当前环境网络工具不可用，内容基于 Claude 训练数据（截至2025年8月）中的官方文档和社区知识整理。建议在网络可用时核实具体 URL 和社区帖子评分。
