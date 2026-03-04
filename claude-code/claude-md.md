# CLAUDE.md 编写法则

🔵 官方文档 | 🟡 个人实践

## CLAUDE.md 是什么

CLAUDE.md 是 Claude Code 在每次启动会话时首先读取的配置文件。它是一个极其重要但常被误用的文件——不是项目文档，而是 **AI 的大脑**。

## 加载机制

| 类型 | 位置 | 作用范围 |
|------|------|---------|
| 项目级 | `<项目根目录>/CLAUDE.md` | 仅当前项目 |
| 全局级 | `~/.claude/CLAUDE.md` | 所有项目 |
| 子目录级 | `<子目录>/CLAUDE.md` | Claude 进入该目录时加载 |

**加载顺序：** 全局级 → 项目级 → 子目录级（后者可覆盖前者）

## 四大编写法则

### 法则一：保持简短

- Claude 一次只能可靠地遵循约 150-200 条指令
- 系统提示本身已占用约 50 条指令
- 如果写得太长，Claude 会随机忽略某些内容

**实操建议：** 定期审查 CLAUDE.md，删除不再相关的内容。

### 法则二：专注于项目特性

- 不要描述通用概念（如"组件文件夹"——Claude 已知道什么是组件）
- 重点说明项目中的"奇怪"之处：特有的 bash 命令、非标准工作流、特殊约定

**对比：**
```markdown
# 不好的写法（Claude 已知道）
使用 React 组件管理 UI。

# 好的写法（项目特有）
运行测试必须用 `pnpm test:watch`，不是 `npm test`，
因为我们有自定义的测试 runner 配置。
```

### 法则三：解释"为什么"，而不仅是"做什么"

提供原因让 Claude 能更好地理解意图并做出更优判断。

**对比：**
```markdown
# 不好的写法
使用 TypeScript 严格模式。

# 好的写法
使用 TypeScript 严格模式，因为我们曾因隐式 any 类型
导致过生产环境的 bug，这是团队的硬性要求。
```

### 法则四：持续更新

CLAUDE.md 应该是"活文档"：

- 每当发现自己**第二次纠正 Claude 同一问题**时，就应该写入 CLAUDE.md
- 优秀的 CLAUDE.md 读起来像是给失忆的自己留下的核心笔记，而不是入职文档

## 实战模板

```markdown
# 项目名称

## 技术栈
- [只列出非标准的部分，或有特殊版本要求的]

## 关键命令
- 启动开发服务器：`特定命令`
- 运行测试：`特定命令`
- 构建：`特定命令`

## 重要约定
- [项目特有的命名约定]
- [非标准的文件组织方式]
- [特殊的代码风格要求及其原因]

## 禁止事项
- 不要修改 `config/prod.json`（生产配置，需要单独流程）
- 不要直接推送到 main 分支

## 当前已知问题
- [暂时性限制或 workaround]
```

## 常见误区

| 误区 | 正确做法 |
|------|---------|
| 把整个技术文档写进去 | 只写项目特有信息 |
| 写一次就不更新 | 随项目演进持续维护 |
| 只写"做什么"不写"为什么" | 解释背后的原因和约束 |
| 过于详细导致忽略 | 简短、高密度、高优先级信息在前 |

---

## [官方文档] `@import` 机制与模块化组织

> 来源：https://docs.anthropic.com/en/docs/claude-code/memory | 2025年 | 可信度：🔵官方
> 对应模块：claude-md.md

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

## [社区经验] "反向约束"写法：禁止清单模式

> 来源：Reddit r/ClaudeAI "CLAUDE.md tips that actually work" | 2025年 | 可信度：🟢社区
> 对应模块：claude-md.md

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

## [官方文档] `settings.json` 权限精细控制

> 来源：https://docs.anthropic.com/en/docs/claude-code/settings | 2025年 | 可信度：🔵官方
> 对应模块：claude-md.md

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
