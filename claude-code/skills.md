# Skills 系统

🔵 官方文档 | 🟢 社区经验 | 🟡 个人实践

## [官方文档] 自定义斜杠命令：目录结构与 `$ARGUMENTS` 语法

> 来源：https://docs.anthropic.com/en/docs/claude-code/slash-commands | 2025年 | 可信度：🔵官方
> 对应模块：skills.md

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

使用方式：`/review src/api/auth.ts`

**评估：** 高价值，这是 Skills 系统的完整基础，是所有自定义命令的起点。

---

## [社区经验] `/git:commit` 标准化提交命令

> 来源：Reddit r/ClaudeAI "custom commands workflow" | 2025年 | 可信度：🟢社区
> 对应模块：skills.md

**核心要点：**
- 将团队的 commit 规范（Conventional Commits）固化为 `/git:commit` 命令
- 命令自动分析 `git diff --staged` 并生成符合规范的提交信息
- 使用 `$ARGUMENTS` 可选传入额外上下文（如 ticket 号）
- 团队统一使用后，commit 信息质量显著提升

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

使用示例：`/git:commit TICKET-123`

**评估：** 高价值，团队协作场景下立即可用，是 Conventional Commits 最佳实践的自动化体现。

---

## [社区经验] 项目专属代码生成命令

> 来源：dev.to "project commands best practices" | 2025年 | 可信度：🟢社区
> 对应模块：skills.md

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

## [个人实践] `/debug` 结构化调试助手命令

> 来源：hashnode.dev/claude-code-advanced-commands | 2025年 | 可信度：🟡个人
> 对应模块：skills.md

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

## [官方文档] 全局命令 vs 项目命令分层架构

> 来源：https://docs.anthropic.com/en/docs/claude-code/slash-commands#scope | 2025年 | 可信度：🔵官方
> 对应模块：skills.md

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
