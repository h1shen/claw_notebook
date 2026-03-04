# Token 节省技巧与方案

🔵 官方文档 | 🟢 社区经验 | 🟡 个人实践

## [官方文档] Prompt Caching 原理与前缀稳定性

> 来源：https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching | 2025 | 可信度：🔵官方
> 对应模块：token-optimization.md

**核心要点：**
- Claude Code 自动对 `CLAUDE.md`、工具定义、长系统提示启用 prompt caching
- 缓存命中时费用降至原价的 10%（cache read token 价格），首次写入缓存为原价的 125%
- 缓存有效期 5 分钟（TTL），活跃会话中持续刷新；超过 5 分钟不活动则缓存失效
- 缓存的关键条件：**前缀必须完全一致**，任何前缀修改都会导致缓存失效并触发重新写入

**原文摘录/翻译：**
```
缓存经济模型（以 Claude Sonnet 3.5 为例）：
- 正常输入 token：$3 / 1M tokens
- Cache write（首次建立缓存）：$3.75 / 1M tokens（贵 25%）
- Cache read（缓存命中）：$0.30 / 1M tokens（便宜 90%）

实际策略：
✅ 把稳定、重复使用的内容放在提示最前面（系统提示、CLAUDE.md）
✅ 把变化的内容（用户输入、当前文件）放在提示末尾
❌ 不要在提示开头插入时间戳、动态内容——会破坏缓存前缀

Claude Code 自动处理：
- CLAUDE.md 内容会被缓存
- 工具列表（Bash、Read、Write等）会被缓存
- 你的问题和文件内容在末尾，不影响缓存
```

**评估：** 高价值。理解"前缀稳定性"原则是手动优化 prompt caching 的关键，直接影响高频使用时的成本。

---

## [社区经验] 主动 `/compact` 时机控制

> 来源：Hacker News "Ask HN: How do you manage Claude Code context?" | 2025-06 | 可信度：🟢社区
> 对应模块：token-optimization.md

**核心要点：**
- 在上下文用到 50-60% 时主动使用 `/compact`，而非等警告出现（警告出现时已影响回答质量）
- `/compact` 后立即用一句话重申当前目标，防止压缩摘要丢失关键约束
- 高级技巧：在压缩前手动用 `# 重要约束` 备注关键信息，这些备注会被优先保留到摘要

**原文摘录/翻译：**
```
社区用户 @thorvaldur 的工作流：

1. 开始任务前：写一条 #记忆 说明项目约束
   # 这个项目用 Bun 不用 Node，测试用 Vitest 不用 Jest

2. 工作 30-40 分钟后，看到 token 计数到 40-50k 时：
   /compact

3. 压缩后立即发送：
   "继续：我们正在重构 auth 模块，目标是将 JWT 验证逻辑
   移到独立的 middleware，已完成 login.ts，下一步是 refresh.ts"

4. 为什么不等警告？
   - 上下文 > 70% 时 Claude 开始"遗忘"早期细节
   - 警告出现在 ~80%，此时质量已经下降
   - 主动 compact 比被动触发保留更多有用信息
```

**评估：** 高价值。主动 compact 时机的量化建议（50-60%）和压缩后重申目标的技巧，是经过实践验证的具体操作，不是空泛建议。

---

## [社区经验] 用 `.claudeignore` 排除噪音文件

> 来源：dev.to "Reducing Claude Code costs in large monorepos" | 2025-06 | 可信度：🟢社区
> 对应模块：token-optimization.md

**核心要点：**
- `.claudeignore` 文件（语法同 `.gitignore`）告诉 Claude Code 不索引指定文件/目录
- 大型 monorepo 中 `node_modules`、`dist`、`*.lock` 等文件会被 glob 扩展意外引入上下文
- 排除测试快照、生成文件、大型 JSON fixture 可显著减少每次会话的背景 token 消耗

**原文摘录/翻译：**
```gitignore
# .claudeignore 示例（放在项目根目录）

# 构建产物
dist/
build/
.next/
out/

# 依赖
node_modules/
.pnp/

# 大型自动生成文件
*.lock
pnpm-lock.yaml
yarn.lock
package-lock.json

# 测试快照（通常不需要 Claude 理解）
**/__snapshots__/
**/*.snap

# 大型 fixture 和 mock 数据
tests/fixtures/large-*.json
tests/mocks/

# 编译缓存
.tsbuildinfo
*.tsbuildinfo
tsconfig.tsbuildinfo

# 日志
*.log
logs/

# 为什么不用 .gitignore？
# Claude Code 默认读取 .gitignore，但 .claudeignore 允许
# 更细粒度控制（如排除某些 Claude 不需要但 git 需要追踪的文件）
```

**评估：** 高价值。`.claudeignore` 是鲜少被文档化的功能，在大型项目中可将无效 token 消耗减少 30-60%，直接影响成本和响应质量。

---

## [社区经验] `--output-format json` 程序化 token 监控

> 来源：Reddit r/ClaudeAI "Tracking Claude Code costs programmatically" | 2025-05 | 可信度：🟢社区
> 对应模块：token-optimization.md

**核心要点：**
- Claude Code 支持 `--output-format json` 和 `--output-format stream-json` 输出模式
- JSON 输出包含 `usage` 字段，含 `input_tokens`、`output_tokens`、`cache_read_input_tokens`
- 可结合 shell 脚本构建轻量级 token 使用日志，帮助团队识别高消耗任务模式

**原文摘录/翻译：**
```bash
# 以 JSON 模式运行 Claude Code 并记录 token 使用
claude --output-format json -p "审查 src/auth/ 目录的安全问题" \
  | tee output.json \
  | jq '.usage | {in: .input_tokens, out: .output_tokens, cached: .cache_read_input_tokens}'

# 输出示例：
# {
#   "in": 12453,
#   "out": 2341,
#   "cached": 8920
# }

# 批量任务的 token 统计脚本
for task in tasks/*.txt; do
  result=$(claude --output-format json -p "$(cat $task)")
  tokens=$(echo $result | jq '.usage.input_tokens + .usage.output_tokens')
  echo "$task: $tokens tokens"
done
```

**评估：** 高价值。程序化 token 监控是团队使用和成本控制的基础设施，`cache_read_input_tokens` 字段可直接验证缓存是否生效。

---

## [个人实践] 分层 CLAUDE.md 减少重复 @ 引用

> 来源：hashnode.dev "My Claude Code setup after 3 months" | 2025-07 | 可信度：🟡个人
> 对应模块：token-optimization.md

**核心要点：**
- 在 `CLAUDE.md` 中声明项目关键文件列表，Claude 会在每次会话开始时自动加载并缓存这些文件
- 避免每次手动 `@src/types.ts @src/config.ts` 等重复引用，减少输入 token 且利用缓存
- 配合文件夹级 `CLAUDE.md`（子目录中放置）实现模块化上下文管理

**原文摘录/翻译：**
```markdown
# 根目录 CLAUDE.md 示例

## 项目关键文件（每次会话自动加载）
- `src/types/index.ts` — 所有 TypeScript 类型定义
- `src/config/app.config.ts` — 应用配置（环境变量映射）
- `prisma/schema.prisma` — 数据库 schema
- `package.json` — 依赖与脚本

## 模块级 CLAUDE.md 示例（src/payment/CLAUDE.md）
此目录负责支付处理。
关键约束：所有金额使用整数分（cents），禁止浮点数。
依赖外部服务：Stripe API v3，文档见 @docs/stripe-integration.md
```

子目录的 CLAUDE.md 只在 Claude 访问该目录时加载，
不会在整个会话中占用上下文——这是分层上下文管理的关键。

**评估：** 高价值。分层 CLAUDE.md 策略（根目录 + 子目录）实现按需加载上下文，减少不必要的 token 消耗，是成熟项目的标准实践。
