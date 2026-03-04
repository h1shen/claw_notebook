# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

面向技术开发者的完整 Claude 教程与使用指南知识库，聚合官方文档、社区经验与个人实践。内容按主题拆分为多文件结构，`notebook.md` 为历史遗留文件（待迁移）。

## Structure

```
claw_notebook/
├── README.md                        # 导航首页，所有模块的目录索引
├── notebook.md                      # 历史内容（迁移中，勿直接新增）
├── claude-code/                     # 模块一：Claude Code 深度使用
│   ├── overview.md
│   ├── cli-workflows.md
│   ├── claude-md.md
│   ├── plan-mode.md
│   ├── hooks.md
│   ├── skills.md
│   ├── context-management.md
│   └── token-optimization.md
├── prompt-engineering/              # 模块二：提示词工程
├── ai-dev-mindset/                  # 模块三：AI 辅助编程思维
├── tool-integrations/               # 模块四：工具生态集成
├── resources/
│   └── references.md
└── docs/plans/                      # 设计文档与实施计划
```

## Content Guidelines

1. **新内容写入对应模块文件**，不要写入 `notebook.md`
2. **每条技巧必须有可操作的示例**，不写空泛原则
3. **标注内容来源**：🔵 官方文档 / 🟢 社区经验 / 🟡 个人实践
4. **每个文件结构统一**：概念解释 → 实用技巧 → 真实案例 → 常见误区

## Common Commands

```bash
git status
git diff
git add <file>
git commit -m "docs: <描述>"
```

## 忽略规则

`archived/` 目录为已处理素材归档，已在 `.claudeignore` 中排除，无需索引。

## Project Intent

构建最完整的 Claude 使用指南，优先完成 `claude-code/` 模块，后续扩展至提示词工程、AI 开发思维、工具集成。实施计划见 `docs/plans/2026-03-04-claude-tutorial-implementation.md`。
