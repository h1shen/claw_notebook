# Claude 完整教程 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将现有 notebook.md 迁移并扩充为多文件结构的完整 Claude 教程知识库，优先完成 claude-code/ 模块。

**Architecture:** 按主题拆分为多个 Markdown 文件，每个文件覆盖一个独立主题，以 README.md 作为导航入口。内容来源聚合官方文档、社区经验与个人实践。

**Tech Stack:** Markdown、Git

---

## Task 1: 建立目录结构

**Files:**
- Create: `README.md`
- Create: `claude-code/overview.md`
- Create: `claude-code/cli-workflows.md`
- Create: `claude-code/claude-md.md`
- Create: `claude-code/plan-mode.md`
- Create: `claude-code/hooks.md`
- Create: `claude-code/skills.md`
- Create: `claude-code/context-management.md`
- Create: `claude-code/token-optimization.md`
- Create: `resources/references.md`

**Step 1: 创建所有目录**

```bash
mkdir -p claude-code prompt-engineering ai-dev-mindset tool-integrations resources
```

**Step 2: 创建 README.md 导航首页**

内容结构：
```markdown
# Claude 完整教程与使用指南

> 面向技术开发者的最完整 Claude 使用指南，聚合官方文档、社区经验与个人实践。

## 模块目录

### 一、Claude Code 深度使用
- [概览与核心理念](claude-code/overview.md)
- [CLI 工作流与常用命令](claude-code/cli-workflows.md)
- [CLAUDE.md 编写法则](claude-code/claude-md.md)
- [计划模式深度指南](claude-code/plan-mode.md)
- [Hooks 配置与使用](claude-code/hooks.md)
- [Skills 系统](claude-code/skills.md)
- [上下文管理策略](claude-code/context-management.md)
- [Token 节省技巧与方案](claude-code/token-optimization.md)

### 二、提示词工程
> 建设中

### 三、AI 辅助编程思维
> 建设中

### 四、工具生态集成
> 建设中

## 内容来源标注说明
- 🔵 官方文档
- 🟢 社区经验
- 🟡 个人实践
```

**Step 3: 创建各空文件（带标题占位）**

每个文件初始内容为对应标题 + `> 建设中` 占位。

**Step 4: Commit**

```bash
git add README.md claude-code/ resources/
git commit -m "feat: 初始化多文件教程目录结构"
```

---

## Task 2: 迁移 notebook.md 现有内容

**Files:**
- Read: `notebook.md`
- Modify: `claude-code/claude-md.md`
- Modify: `claude-code/context-management.md`
- Modify: `claude-code/overview.md`

**迁移映射：**

| notebook.md 章节 | 迁移目标文件 |
|-----------------|------------|
| 法则一：计划模式 | `claude-code/plan-mode.md` |
| 法则二：CLAUDE.md | `claude-code/claude-md.md` |
| 法则三：200k 上下文 | `claude-code/context-management.md` |
| 法则四：架构规划 | `ai-dev-mindset/architecture.md`（新建）|
| 法则五：输入质量 | `prompt-engineering/input-quality.md`（新建）|
| 法则六：配置生态 | `claude-code/hooks.md` + `tool-integrations/mcp.md` |
| 法则七：被卡住时 | `claude-code/overview.md`（调试思维章节）|
| 法则八：自动化系统 | `tool-integrations/automation.md`（新建）|
| 结语 | `README.md`（底部引言）|

**Step 1: 逐章迁移，保留原有措辞，补充来源标注**

**Step 2: notebook.md 顶部添加迁移说明**

```markdown
> ⚠️ 此文件内容已迁移至多文件结构，请访问 [README.md](README.md) 查看最新版本。
```

**Step 3: Commit**

```bash
git add .
git commit -m "refactor: 将 notebook.md 内容迁移到对应模块文件"
```

---

## Task 3: 完善 claude-code/overview.md

**Files:**
- Modify: `claude-code/overview.md`

**内容结构：**

```markdown
# Claude Code 概览与核心理念

## 什么是 Claude Code
- 定位：CLI 工具，而非网页对话
- 与 Claude.ai 的核心区别
- 设计哲学：agentic coding assistant

## 核心理念
1. 你在"编程"它，不是在聊天
2. 计划先于执行
3. 上下文是有限资源

## 快速开始
- 安装：`npm install -g @anthropic-ai/claude-code`
- 启动：`claude` 或 `claude <指令>`
- 首次配置建议

## 工作模式概览
| 模式 | 触发方式 | 适用场景 |
|------|---------|---------|
| 交互模式 | 直接 `claude` | 日常开发 |
| 计划模式 | Shift+Tab×2 | 复杂任务规划 |
| 无头模式 | `claude -p "..."` | 自动化脚本 |
```

**Step 1: 写入完整内容**
**Step 2: Commit**

```bash
git add claude-code/overview.md
git commit -m "docs: 完成 claude-code overview 章节"
```

---

## Task 4: 完善 claude-code/claude-md.md

**Files:**
- Modify: `claude-code/claude-md.md`

**内容结构：**

```markdown
# CLAUDE.md 编写法则

## CLAUDE.md 是什么
## 加载机制（项目级 vs 全局）
## 四大编写法则（来自 notebook.md 迁移内容）
## 实战模板
## 常见误区
```

**Step 1: 写入完整内容，包含可复用的模板**
**Step 2: Commit**

---

## Task 5: 完善 claude-code/plan-mode.md

**Files:**
- Modify: `claude-code/plan-mode.md`

**内容结构：**

```markdown
# 计划模式深度指南

## 什么时候用计划模式
## 如何触发（Shift+Tab×2）
## 如何引导出高质量计划
## 计划执行技巧
## 计划模式 vs 直接输入：对比案例
```

**Step 1: 写入完整内容**
**Step 2: Commit**

---

## Task 6: 完善 claude-code/context-management.md

**Files:**
- Modify: `claude-code/context-management.md`

**内容结构：**

```markdown
# 上下文管理策略

## 上下文衰减规律（20-40% 开始退化）
## /compact 使用时机与局限
## 多会话拆分策略
## 外部记忆技巧（SCRATCHPAD.md 等）
## 复位重置法
```

**Step 1: 写入完整内容**
**Step 2: Commit**

---

## Task 7: 完善 claude-code/token-optimization.md

**Files:**
- Modify: `claude-code/token-optimization.md`

**内容结构：**

```markdown
# Token 节省技巧与方案

## Token 计费逻辑
- input/output token 的区别
- 缓存 token（prompt caching）如何工作

## 实用节省策略
1. 精简 CLAUDE.md（只保留项目特有信息）
2. 避免冗余上下文（不要把整个文件塞进对话）
3. 使用精准的文件引用代替粘贴全文
4. 批量任务合并为单次请求

## Prompt Caching 最佳实践
- 哪些内容适合缓存
- 如何设计 prompt 结构最大化缓存命中

## Token 用量监控
- 如何查看 token 消耗
- 成本估算方法
```

**Step 1: 写入完整内容**
**Step 2: Commit**

---

## Task 8: 完善 claude-code/hooks.md

**Files:**
- Modify: `claude-code/hooks.md`

**内容结构：**

```markdown
# Hooks 配置与使用

## Hooks 是什么
## Hook 类型（PreToolUse / PostToolUse / etc.）
## 配置语法（settings.json）
## 实用场景示例
- 自动格式化（Prettier）
- 编辑后类型检查
- 自动提交
## 常见问题排查
```

**Step 1: 写入完整内容**
**Step 2: Commit**

---

## Task 9: 完善 claude-code/skills.md

**Files:**
- Modify: `claude-code/skills.md`

**内容结构：**

```markdown
# Skills 系统

## Skills 是什么
## 如何调用 skill（Skill 工具）
## 官方 skills 列表与用途
## 如何编写自定义 skill
## Skills 与 slash commands 的区别
```

**Step 1: 写入完整内容**
**Step 2: Commit**

---

## Task 10: 完善 claude-code/cli-workflows.md

**Files:**
- Modify: `claude-code/cli-workflows.md`

**内容结构：**

```markdown
# CLI 工作流与常用命令

## 启动方式
## 常用 slash commands（/help、/compact、/clear 等）
## 键盘快捷键
## 模式切换技巧
## 无头模式（-p 标志）
## 实用工作流示例
```

**Step 1: 写入完整内容**
**Step 2: Commit**

---

## Task 11: 完善 resources/references.md

**Files:**
- Modify: `resources/references.md`

内容：整理官方文档链接、社区资源、推荐阅读。

**Step 1: 写入初始参考资料**
**Step 2: Commit**

---

## 执行顺序建议

```
Task 1（建目录）→ Task 2（迁移）→ Task 3-11（按序完善各文件）
```

Task 3-11 可按需优先排序，彼此独立。
