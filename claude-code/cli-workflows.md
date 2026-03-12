# CLI 工作流与常用命令

🔵 官方文档 | 🟢 社区经验 | 🟡 个人实践

## [官方文档] 斜杠命令速查

> 来源：https://docs.anthropic.com/en/docs/claude-code/cli-reference | 2025 | 可信度：🔵官方
> 对应模块：cli-workflows.md

**核心要点：**
- `/clear` 清除对话历史但保持会话，适合切换任务时重置上下文而不退出进程
- `/compact` 压缩对话历史为摘要，释放上下文窗口空间同时保留关键信息
- `/memory` 管理跨会话持久记忆（写入 `~/.claude/memory`），可用 `#` 前缀快速追加记忆条目
- `/cost` 显示当前会话的 token 消耗与费用明细，用于实时监控开销
- `/model` 在会话中切换模型（如从 Sonnet 切换到 Opus），无需重启

**原文摘录/翻译：**
```
# 常用斜杠命令速查
/clear          # 清空对话历史（上下文归零）
/compact        # 将历史压缩为摘要（保留语义，节省 token）
/memory         # 查看/编辑持久记忆文件
/cost           # 查看本次会话 token 用量
/model          # 切换当前模型
/review         # 触发代码审查模式
/pr_comments    # 拉取当前 PR 的 GitHub 评论作为上下文

# 快速追加记忆（# 前缀，直接在输入框使用）
# 始终使用 pnpm 而非 npm
```

**评估：** 高价值。`/compact` 和 `/cost` 是高频痛点解决方案，`#` 记忆前缀鲜为人知但极实用。

---

## [社区经验] 用 `--resume` 和 `--continue` 恢复中断的长任务

> 来源：Reddit r/ClaudeAI, 帖子 "Claude Code session management tips" | 2025-04 | 可信度：🟢社区
> 对应模块：cli-workflows.md

**核心要点：**
- `claude --continue` 自动恢复最近一次会话，无需手动查找 session ID
- `claude --resume <session-id>` 恢复指定历史会话，session ID 可通过 `/sessions` 查看
- 长任务（如多文件重构）中途断开后，用 `--continue` 可让 Claude 从断点继续，而非从头开始

**原文摘录/翻译：**
```bash
# 恢复上次会话（最常用）
claude --continue

# 列出所有历史会话
claude --list-sessions

# 恢复特定会话
claude --resume abc123def456

# 实用场景：大型重构任务中途退出后继续
# 1. 上次任务用 Ctrl+C 中断
# 2. 重新打开终端
# 3. claude --continue  → Claude 会读取历史并询问"继续上次的重构吗？"
```

**评估：** 高价值。大多数用户不知道 `--continue` 标志，每次都从头开始，浪费大量 token 重建上下文。

---

## [社区经验] 键盘快捷键与输入技巧

> 来源：dev.to "Claude Code power user tips" by @swyx | 2025-05 | 可信度：🟢社区
> 对应模块：cli-workflows.md

**核心要点：**
- `Escape` 键：中断当前 Claude 响应（比 Ctrl+C 更安全，不会杀死进程）
- `Ctrl+L`：清屏但保留对话历史（等同于 `clear` 命令，但不影响上下文）
- 多行输入：在终端中用 `\` 换行，或直接粘贴多行文本（Claude Code 自动识别）
- 方向键上/下：浏览输入历史
- `Ctrl+R`：反向搜索历史输入（适合复用复杂 prompt）

**原文摘录/翻译：**
```
实用交互技巧：

1. 中断不满意的回答：按 Escape（而非 Ctrl+C）
   - Ctrl+C 在某些终端会终止整个 claude 进程
   - Escape 只中断当前生成，保持会话完整

2. 粘贴多行代码片段：直接 Ctrl+V，Claude Code 支持多行输入
   无需转义或特殊处理

3. @ 文件引用语法：
   claude> 请分析 @src/auth/login.ts 中的安全问题
   # 等同于手动将文件内容粘贴到输入框，但更简洁

4. ! 执行 shell 命令并将输出作为上下文：
   claude> !git diff HEAD~1  然后解释这些改动的影响
```

**评估：** 高价值。`Escape` vs `Ctrl+C` 的区别、`@` 文件引用、`!` shell 命令注入是三个极实用但文档位置隐蔽的功能。

---

## [官方文档] `-p` 非交互模式与 CI/CD 集成

> 来源：https://docs.anthropic.com/en/docs/claude-code/cli-reference#flags | 2025 | 可信度：🔵官方
> 对应模块：cli-workflows.md

**核心要点：**
- `-p` / `--print` 标志：非交互式单次运行，输出后立即退出，适合脚本和管道
- 配合 `--allowedTools` 限制工具权限，安全地在 CI 环境中运行
- `--dangerously-skip-permissions` 用于全自动化场景（需在隔离环境中使用）
- stdin 管道支持：可将文件内容通过管道传入，实现批量处理

**原文摘录/翻译：**
```bash
# 基本非交互模式
claude -p "解释这个错误并给出修复建议" < error.log

# CI/CD 中的代码审查自动化
git diff HEAD~1 | claude -p "审查这些改动，列出潜在 bug 和安全问题" \
  --allowedTools "Read" \
  --output-format json > review.json

# 批量文件处理
for f in src/**/*.ts; do
  claude -p "检查 $f 是否有 TODO 注释并生成 issue 草稿" \
    --allowedTools "Read,Bash" >> issues-draft.md
done

# Pre-commit hook 示例（.git/hooks/pre-commit）
#!/bin/bash
staged=$(git diff --cached --name-only --diff-filter=ACM | grep '\.ts$')
if [ -n "$staged" ]; then
  echo "$staged" | xargs -I{} claude -p \
    "快速检查 {} 是否有明显的类型错误或未处理的 Promise" \
    --allowedTools "Read"
fi
```

**评估：** 高价值。`-p` 模式将 Claude Code 从交互工具变为可组合的 CLI 组件，解锁自动化流水线场景，`--allowedTools` 限权在 CI 环境中是安全必需。

---

## [官方文档] 并行子智能体（Subagents）

> 来源：https://docs.anthropic.com/en/docs/claude-code/sub-agents | 2025 | 可信度：🔵官方
> 对应模块：cli-workflows.md

**核心要点：**
- Claude Code 支持通过 `Task` 工具派生子智能体，每个子智能体有独立上下文窗口
- 在 `CLAUDE.md` 中描述任务分解策略，可引导 Claude 自动分拆大任务
- 子智能体完成后将结果摘要返回主智能体，主智能体上下文不会被子任务细节污染

**原文摘录/翻译：**
```markdown
# CLAUDE.md 中的子任务指导示例
## 大型任务处理策略
当任务涉及多个独立模块时，请拆分为子任务并行处理：
- 每个子任务聚焦单一模块（如 auth、payment、notification）
- 子任务完成后只需返回：修改的文件列表 + 关键决策摘要
- 不要在主会话中展开所有子任务的实现细节
```

**评估：** 高价值。将大任务分解给子智能体是控制主上下文膨胀的根本方法，文档中描述偏抽象，社区实践案例少。

---

## [个人实践] 多窗口工作流

> 来源：X/Twitter @GregBraxton "Claude Code multi-terminal workflow" thread | 2025-07 | 可信度：🟡个人
> 对应模块：cli-workflows.md

**核心要点：**
- 在一个终端运行 Claude Code 任务时，可在另一个终端用相同 session ID 观察进度
- 适合"一个终端执行，一个终端监控"的双屏工作流
- 配合 `tmux` 或 Windows Terminal 的分屏功能，实现任务监控与新任务并行

**原文摘录/翻译：**
```bash
# 终端 1：启动长任务并记录 session ID
claude --continue
# Claude 显示 session: abc123

# 终端 2：附加到同一会话只读监控（观察进度）
tail -f ~/.claude/sessions/abc123/log.jsonl | jq '.content'

# 实用的 tmux 工作流配置
# ~/.tmux.conf
bind-key C-c new-window \; send-keys "claude --continue" Enter \; \
  split-window -h \; send-keys "watch -n2 'cat ~/.claude/sessions/latest/summary.md'" Enter
```

**评估：** 中价值。双终端工作流对重度用户有实际价值，但 session 日志 API 稳定性依赖版本，需自行验证当前版本支持情况。

---

## CLI 配套工具

这些不是 Claude 插件，但能显著提升 Claude Code 的使用体验。

### 必装

| 工具 | 用途 | 为什么配合 Claude 好用 |
|------|------|----------------------|
| `jq` | JSON 处理 | Hooks 脚本中解析 Claude 输出的 JSON 必需 |
| `ripgrep`（`rg`） | 极速搜索 | Claude 的 Grep 工具底层依赖 |
| `fzf` | 模糊搜索 | 快速定位文件后用 `@` 引用给 Claude |
| `gh` | GitHub CLI | 配合 Claude 做 PR review、Issue 管理 |

### 推荐

| 工具 | 用途 | 配合场景 |
|------|------|----------|
| `bat` | 带语法高亮的 cat | 审查 Claude 生成的代码更清晰 |
| `delta` | Git diff 美化 | 对比 Claude 修改前后的差异 |
| `tmux` | 终端复用 | 多窗口并行跑 Claude，互不干扰 |
| `direnv` | 目录级环境变量 | 进入项目自动加载 MCP 所需的 API Key |

**tmux 多窗口工作流示例：**

```bash
# 窗口 1：Claude 主会话
claude

# 窗口 2：Claude 跑测试（独立上下文）
claude -p "运行所有测试并报告失败项"

# 窗口 3：手动编辑 / git 操作
vim src/index.ts
```
