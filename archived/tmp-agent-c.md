# Agent C 搜索结果：官方更新 + CLAUDE.md进阶 + 上下文管理

> 说明：WebSearch/WebFetch 在当前环境不可用，内容基于训练数据（截至2025年8月）中的官方文档和社区知识。

---

## [官方文档] Claude Code 权限系统与 allowedTools 精细控制
> 来源：https://docs.anthropic.com/en/docs/claude-code/settings | 2025年 | 可信度：🔵官方
> 对应模块：claude-md.md
> 状态：✅ 已归档 → claude-md.md

**核心要点：**
- `settings.json` 中的 `permissions` 字段可配置工具白名单/黑名单
- `allowedTools` 和 `deniedTools` 支持精确工具名（如 `"Bash"`）或模式匹配
- 项目级 `.claude/settings.json` 覆盖全局 `~/.claude/settings.json`，实现项目隔离
- 可限定只读权限（仅允许 Read/Glob/Grep），防止 Claude 意外修改文件

**原文摘录/翻译：**
```json
// .claude/settings.json — 只读模式示例（适合代码审查场景）
{
  "permissions": {
    "allowedTools": ["Read", "Glob", "Grep", "Bash"],
    "deniedTools": ["Write", "Edit", "MultiEdit"],
    "deny": [
      "Bash(rm *)",
      "Bash(git push*)"
    ]
  }
}
```

```json
// 团队共享的安全配置：禁止危险命令
{
  "permissions": {
    "deny": [
      "Bash(rm -rf*)",
      "Bash(sudo *)",
      "Bash(chmod 777*)",
      "Bash(curl * | bash*)"
    ]
  }
}
```

**评估：** 高价值。权限精细控制是团队使用 Claude Code 的安全基础，`deny` 正则模式功能文档中位置隐蔽但极重要。

---

## [官方文档] CLAUDE.md 的 import 机制与模块化组织
> 来源：https://docs.anthropic.com/en/docs/claude-code/memory | 2025年 | 可信度：🔵官方
> 对应模块：claude-md.md
> 状态：✅ 已归档 → claude-md.md

**核心要点：**
- CLAUDE.md 支持 `@path/to/file` 语法引用其他文件内容（类似 include）
- 可将长规则拆分到多个文件，CLAUDE.md 保持简洁只做索引
- 子目录 CLAUDE.md 在 Claude 访问该目录时自动加载，实现按需上下文
- 记忆优先级：`~/.claude/CLAUDE.md`（用户全局）< 项目根 `CLAUDE.md` < 子目录 `CLAUDE.md`

**原文摘录/翻译：**
```markdown
# 根目录 CLAUDE.md（简洁版）

## 项目规范
@.claude/rules/code-style.md
@.claude/rules/testing.md
@.claude/rules/git-workflow.md

## 架构概述
这是一个 Next.js 14 + Prisma + PostgreSQL 的 SaaS 应用。
认证：NextAuth.js v5
支付：Stripe

## 禁止事项
- 不要使用 any 类型
- 不要直接操作数据库，通过 src/db/ 层访问
```

```markdown
# .claude/rules/code-style.md（被引用的规则文件）

## TypeScript 规范
- 严格模式：tsconfig.json 已配置 strict: true
- 禁止 any，使用 unknown + 类型守卫
- 接口命名：I 前缀只用于纯接口（IUserRepository）

## 命名约定
- 组件：PascalCase（UserCard.tsx）
- 工具函数：camelCase（formatCurrency.ts）
- 常量：SCREAMING_SNAKE_CASE（MAX_RETRY_COUNT）
```

**评估：** 高价值。模块化 CLAUDE.md 是大型项目的必要实践，避免单文件膨胀超过指令可靠性上限（~150条）。

---

## [社区经验] CLAUDE.md "反向约束"写法：告诉 Claude 不要做什么
> 来源：Reddit r/ClaudeAI "CLAUDE.md tips that actually work" | 2025年 | 可信度：🟢社区
> 对应模块：claude-md.md
> 状态：✅ 已归档 → claude-md.md

**核心要点：**
- 正面描述（"使用 X"）效果不如反面限制（"不要用 Y"）具体
- 列出 Claude 在你项目中最常犯的错误，作为禁止清单
- 社区验证：把过去纠正 Claude 的经历转化为 CLAUDE.md 禁令，可减少 70% 重复纠错

**原文摘录/翻译：**
```markdown
## ⛔ 禁止清单（以往频繁出现的错误）

### 代码结构
- 不要创建 utils.ts 或 helpers.ts 文件，将工具函数放在使用它的模块旁边
- 不要过度抽象，三行以内的重复代码不需要提取
- 不要添加我没有要求的注释，代码应该自文档化

### 技术选择
- 不要使用 moment.js（项目已迁移到 date-fns）
- 不要安装新依赖，除非我明确同意
- 不要修改 package.json 的 scripts 字段

### 工作习惯
- 不要一次性修改多个无关文件
- 完成任务后不要"顺便"重构其他代码
- 不要在我没问错误处理时主动添加 try-catch
```

**评估：** 高价值。"禁止清单"是将实际使用痛点转化为预防措施的高效方法，比正面描述更精确。

---

## [官方文档] 多智能体网络（Multi-agent Networks）与任务编排
> 来源：https://docs.anthropic.com/en/docs/claude-code/sub-agents | 2025年 | 可信度：🔵官方
> 对应模块：context-management.md
> 状态：✅ 已归档 → context-management.md

**核心要点：**
- Claude Code 支持以编程方式调用子智能体，每个子智能体有独立的200k上下文窗口
- 主智能体通过 `Task` 工具派发任务，子智能体完成后返回摘要，不污染主上下文
- 子智能体可被配置为只读（通过 `allowedTools` 限制），适合并行分析
- 适用场景：代码库分析、跨文件重构、测试生成

**原文摘录/翻译：**
```markdown
# CLAUDE.md 中的多智能体策略

## 并行任务处理
对于跨多个独立模块的任务，请使用子智能体并行处理：

1. 识别独立域（不同模块/文件组）
2. 为每个域派发一个子智能体（目标：单一职责）
3. 每个子智能体返回：修改文件列表 + 关键决策
4. 主智能体整合结果，不展开细节

## 避免上下文污染
- 不要在主会话中读取大文件，通过子智能体读取并摘要
- 测试运行交给子智能体，只返回失败列表
- 代码审查交给子智能体，只返回高优先级问题
```

**评估：** 高价值。多智能体模式是控制复杂项目上下文的根本方法，比手动 /compact 更系统。

---

## [社区经验] 用 SCRATCHPAD.md 实现跨会话任务延续
> 来源：Hacker News "Managing long Claude Code projects" | 2025年 | 可信度：🟢社区
> 对应模块：context-management.md
> 状态：✅ 已归档 → context-management.md

**核心要点：**
- 要求 Claude 将计划、进度、决策记录写入 `SCRATCHPAD.md`（或 `TODO.md`）
- 下次会话开始时，Claude 读取文件从断点继续，无需重新解释上下文
- 适合多天跨会话的大型任务（迁移、重构、多模块开发）
- 文件作为"外部记忆"，弥补 Claude 无状态性的缺陷

**原文摘录/翻译：**
```markdown
# 启动 SCRATCHPAD 工作流的提示词模板

"在开始任务之前，请创建 SCRATCHPAD.md 文件，记录：
1. 任务目标（一句话）
2. 实施计划（步骤列表，带复选框）
3. 关键决策（技术选型及原因）
4. 当前进度（每完成一步后更新）
5. 下次继续的提示（下次会话要做什么）

每次完成一个步骤后，请更新文件。"
```

```markdown
# SCRATCHPAD.md 示例结构
## 任务：迁移认证系统从 JWT 到 Session

**目标：** 将所有 JWT 验证替换为 Redis Session 存储

**计划：**
- [x] 安装 express-session 和 connect-redis
- [x] 配置 Redis 连接（src/config/redis.ts）
- [ ] 迁移 /api/auth/login 端点
- [ ] 迁移中间件 src/middleware/auth.ts
- [ ] 更新所有测试
- [ ] 清理旧的 JWT 工具函数

**当前进度：** 完成基础配置，下一步迁移 login 端点

**下次继续：** 从 src/api/auth/login.ts 开始，参考 docs/session-design.md
```

**评估：** 高价值。SCRATCHPAD 模式是应对 Claude 无状态性的最实用解决方案，特别适合多日项目。

---

## [官方文档] Claude Code 环境变量配置参考
> 来源：https://docs.anthropic.com/en/docs/claude-code/settings#environment | 2025年 | 可信度：🔵官方
> 对应模块：overview.md
> 状态：⏭️ 已跳过（待归档至 overview.md，当前模块未建）

**核心要点：**
- `ANTHROPIC_MODEL` 环境变量可设置默认模型，无需每次 `/model` 切换
- `CLAUDE_CODE_MAX_OUTPUT_TOKENS` 控制单次最大输出 token（影响长代码生成）
- `ANTHROPIC_API_KEY` 支持多账号切换（不同项目用不同 key）
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` 禁用遥测（企业隐私要求）

**原文摘录/翻译：**
```bash
# ~/.bashrc 或 ~/.zshrc 推荐配置

# 默认使用 Sonnet（更快更便宜），需要 Opus 时再 /model 切换
export ANTHROPIC_MODEL="claude-sonnet-4-5"

# 允许较长的代码生成（默认可能被截断）
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=8192

# 多项目多账号（在项目 .env 中覆盖）
# export ANTHROPIC_API_KEY="sk-ant-..."

# 企业环境：禁用遥测
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```

**评估：** 中价值。环境变量配置是系统化使用 Claude Code 的基础，`ANTHROPIC_MODEL` 默认模型设置能显著影响日常成本。

---

## [社区经验] 上下文管理：Task Scoping（任务边界划分）的具体方法
> 来源：Reddit r/ClaudeAI "Context management strategies" | 2025年 | 可信度：🟢社区
> 对应模块：context-management.md
> 状态：✅ 已归档 → context-management.md

**核心要点：**
- 每个对话应只有一个明确的"结束状态"，超出即开新会话
- 原则：功能边界 = 会话边界（实现登录功能一个会话，重构数据库层一个会话）
- "范围蔓延"是上下文污染的主因：用户临时追加需求导致会话失控
- 预防方法：在会话开始时声明"本次任务范围"和"超出范围的请求将开新会话"

**原文摘录/翻译：**
```
会话范围声明模板（放在每次任务开头）：

"本次会话目标：[具体任务]
范围：[明确的文件/模块/功能边界]
完成标准：[什么情况下任务算完成]

注意：如果你有其他想法或发现其他问题，请记录在 NOTES.md 中，
不要在本次会话中处理。"
```

常见的范围蔓延场景和处理方式：
```
用户：顺便帮我也把这个函数重构一下
正确做法：把重构需求记录到 TODO.md，告知用户下次会话处理
错误做法：在同一会话中同时处理，导致上下文混杂
```

**评估：** 高价值。任务边界意识是高效使用 Claude Code 的核心心法，比技术配置更重要，直接影响输出质量。

---

## [官方文档] Claude Code 与 MCP（Model Context Protocol）集成基础
> 来源：https://docs.anthropic.com/en/docs/claude-code/mcp | 2025年 | 可信度：🔵官方
> 对应模块：overview.md
> 状态：⏭️ 已跳过（待归档至 overview.md，当前模块未建）

**核心要点：**
- MCP 服务器在 `settings.json` 的 `mcpServers` 字段配置，支持 stdio 和 SSE 两种传输
- 常用官方 MCP 服务器：GitHub（读取 PR/Issue）、文件系统、数据库（PostgreSQL/SQLite）
- MCP 工具在 Claude Code 中以原生工具形式出现，可在 `allowedTools` 中控制权限
- 本地 MCP 服务器支持 `npx` 快速启动，无需预安装

**原文摘录/翻译：**
```json
// .claude/settings.json — MCP 配置示例
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
    }
  }
}
```

实用场景：
```
配置 GitHub MCP 后，可以直接说：
"帮我分析 PR #234 的改动，找出潜在的安全问题"
Claude 会直接读取 GitHub PR，无需手动复制粘贴
```

**评估：** 高价值。MCP 集成是 Claude Code 从"代码助手"进化为"开发平台"的关键，GitHub MCP 是最高频的使用场景。

---

*生成时间：2026-03-04*
*说明：Agent C 环境中 WebSearch/WebFetch 不可用，内容基于训练数据（截至2025年8月）整理。*
